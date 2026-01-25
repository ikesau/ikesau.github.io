(function () {
  const commentsContainer = document.getElementById("comments");
  const loadButton = document.getElementById("load-comments");

  if (!commentsContainer || !loadButton) return;

  const gotosocialId = commentsContainer.dataset.gotosocialId;
  const gotosocialToken = commentsContainer.dataset.gotosocialToken;
  const blueskyUrl = commentsContainer.dataset.blueskyUrl;

  // Root post IDs to identify top-level replies
  let rootIds = [];

  loadButton.addEventListener("click", loadComments);

  async function loadComments() {
    loadButton.disabled = true;
    loadButton.textContent = "Loading...";

    // Set root IDs for identifying top-level comments
    rootIds = [];
    if (gotosocialId) rootIds.push(gotosocialId);
    if (blueskyUrl) {
      const atUri = blueskyUrlToAtUri(blueskyUrl);
      if (atUri) rootIds.push(atUri);
    }

    try {
      const [gotosocialComments, blueskyComments] = await Promise.all([
        gotosocialId ? fetchGotoSocialComments(gotosocialId, gotosocialToken) : [],
        blueskyUrl ? fetchBlueskyComments(blueskyUrl) : [],
      ]);

      const allComments = [...gotosocialComments, ...blueskyComments];
      const tree = buildCommentTree(allComments);

      renderComments(tree);
      loadButton.style.display = "none";
    } catch (error) {
      console.error("Failed to load comments:", error);
      loadButton.textContent = "Failed to load - click to retry";
      loadButton.disabled = false;
    }
  }

  async function fetchGotoSocialComments(postId, token) {
    const headers = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const response = await fetch(
      `https://micro.ikesau.co/api/v1/statuses/${postId}/context`,
      { headers }
    );
    if (!response.ok) {
      throw new Error(`GotoSocial API error: ${response.status}`);
    }
    const data = await response.json();
    return data.descendants.map((status) =>
      normalizeComment(status, "gotosocial")
    );
  }

  async function fetchBlueskyComments(postUrl) {
    const atUri = blueskyUrlToAtUri(postUrl);
    if (!atUri) return [];

    const response = await fetch(
      `https://public.api.bsky.app/xrpc/app.bsky.feed.getPostThread?uri=${encodeURIComponent(atUri)}&depth=10`
    );
    if (!response.ok) {
      throw new Error(`Bluesky API error: ${response.status}`);
    }
    const data = await response.json();
    return flattenBlueskyReplies(data.thread, atUri);
  }

  function blueskyUrlToAtUri(url) {
    // https://bsky.app/profile/{handle}/post/{id} -> at://{handle}/app.bsky.feed.post/{id}
    const match = url.match(
      /bsky\.app\/profile\/([^\/]+)\/post\/([a-zA-Z0-9]+)/
    );
    if (!match) return null;
    const [, handle, postId] = match;
    return `at://${handle}/app.bsky.feed.post/${postId}`;
  }

  function flattenBlueskyReplies(thread, parentUri, result = []) {
    if (!thread.replies) return result;

    for (const reply of thread.replies) {
      if (reply.post) {
        result.push(normalizeComment(reply.post, "bluesky", parentUri));
        flattenBlueskyReplies(reply, reply.post.uri, result);
      }
    }
    return result;
  }

  function normalizeComment(raw, source, parentUri = null) {
    if (source === "gotosocial") {
      return {
        id: raw.id,
        replyToId: raw.in_reply_to_id,
        avatar: raw.account.avatar,
        handle: `@${raw.account.acct}`,
        profileUrl: raw.account.url,
        content: raw.content,
        date: raw.created_at,
        source: "gotosocial",
        children: [],
      };
    } else {
      // bluesky
      return {
        id: raw.uri,
        replyToId: parentUri,
        avatar: raw.author.avatar,
        handle: `@${raw.author.handle}`,
        profileUrl: `https://bsky.app/profile/${raw.author.handle}`,
        content: raw.record.text,
        date: raw.record.createdAt,
        source: "bluesky",
        children: [],
      };
    }
  }

  function buildCommentTree(comments) {
    const commentMap = new Map();
    const roots = [];

    // Index all comments by ID
    for (const comment of comments) {
      commentMap.set(comment.id, comment);
    }

    // Build tree structure
    for (const comment of comments) {
      const isTopLevel = rootIds.includes(comment.replyToId);
      const parent = commentMap.get(comment.replyToId);

      if (isTopLevel || !parent) {
        roots.push(comment);
      } else {
        parent.children.push(comment);
      }
    }

    // Sort roots and children by date (oldest first for chronological threading)
    const sortByDate = (a, b) => new Date(a.date) - new Date(b.date);
    roots.sort(sortByDate);
    for (const comment of commentMap.values()) {
      comment.children.sort(sortByDate);
    }

    return roots;
  }

  function renderComments(comments) {
    if (comments.length === 0) {
      commentsContainer.innerHTML = "<p class='no-comments'>No comments yet.</p>";
      return;
    }

    commentsContainer.innerHTML = renderCommentList(comments, 0);
  }

  function renderCommentList(comments, depth) {
    return comments
      .map((comment) => renderComment(comment, depth))
      .join("");
  }

  function renderComment(comment, depth) {
    const icon = comment.source === "gotosocial" ? "&#x1F418;" : "&#x1F98B;";
    const timeAgo = formatTimeAgo(new Date(comment.date));
    const sanitizedContent =
      comment.source === "gotosocial"
        ? comment.content
        : escapeHtml(comment.content);

    const childrenHtml = comment.children.length > 0
      ? `<div class="comment-replies">${renderCommentList(comment.children, depth + 1)}</div>`
      : "";

    return `
      <div class="comment comment-${comment.source} comment-depth-${Math.min(depth, 3)}">
        <div class="comment-header">
          <span class="comment-platform" title="${comment.source === "gotosocial" ? "GotoSocial" : "Bluesky"}">${icon}</span>
          <img class="comment-avatar" src="${comment.avatar}" alt="" loading="lazy">
          <a class="comment-handle" href="${comment.profileUrl}" target="_blank" rel="noopener">${comment.handle}</a>
        </div>
        <div class="comment-content">${sanitizedContent}</div>
        <time class="comment-time" datetime="${comment.date}">${timeAgo}</time>
        ${childrenHtml}
      </div>
    `;
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML.replace(/\n/g, "<br>");
  }

  function formatTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "week", seconds: 604800 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count >= 1) {
        return `${count} ${interval.label}${count !== 1 ? "s" : ""} ago`;
      }
    }
    return "just now";
  }
})();
