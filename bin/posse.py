#!/usr/bin/env python3
"""
POSSE (Publish Own Site, Syndicate Elsewhere) script for ikesau.co

Usage: posse.py <slug>

Loads environment variables from .env file in repo root.
See .env.example for required variables.
"""

import os
import sys
import re
import time
import subprocess
import requests
from pathlib import Path
from urllib.parse import quote

# Configuration
REPO_DIR = Path(__file__).parent.parent.resolve()
BLOG_DIR = REPO_DIR / "content" / "blog"
ENV_FILE = REPO_DIR / ".env"


def load_env():
    """Load environment variables from .env file."""
    if not ENV_FILE.exists():
        return

    with open(ENV_FILE) as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            if "=" in line:
                key, value = line.split("=", 1)
                key = key.strip()
                value = value.strip().strip('"').strip("'")
                if value:  # Only set if value is non-empty
                    os.environ.setdefault(key, value)


load_env()
SITE_URL = "https://ikesau.co"
GITHUB_REPO = "ikesau/ikesau.github.io"
GOTOSOCIAL_INSTANCE = "https://micro.ikesau.co"
BLUESKY_API = "https://bsky.social/xrpc"


def find_post_file(slug: str) -> Path | None:
    """Find blog post file by slug."""
    for f in BLOG_DIR.glob("*.html"):
        # Extract slug from filename (date-slug.html)
        match = re.match(r"\d{4}-\d{2}-\d{2}-(.+)\.html$", f.name)
        if match and match.group(1) == slug:
            return f
    return None


def parse_frontmatter(content: str) -> tuple[dict, str]:
    """Parse YAML frontmatter and return (frontmatter_dict, body)."""
    if not content.startswith("---"):
        return {}, content

    parts = content.split("---", 2)
    if len(parts) < 3:
        return {}, content

    frontmatter = {}
    for line in parts[1].strip().split("\n"):
        if ":" in line:
            key, value = line.split(":", 1)
            key = key.strip()
            value = value.strip().strip('"').strip("'")
            if key == "tags":
                continue  # Skip tags for now, handled specially
            frontmatter[key] = value

    return frontmatter, "---" + parts[1] + "---" + parts[2]


def update_frontmatter(content: str, updates: dict) -> str:
    """Update frontmatter with new values."""
    if not content.startswith("---"):
        return content

    parts = content.split("---", 2)
    if len(parts) < 3:
        return content

    lines = parts[1].strip().split("\n")
    new_lines = []
    updated_keys = set()

    for line in lines:
        if ":" in line:
            key = line.split(":", 1)[0].strip()
            if key in updates:
                value = updates[key]
                # Quote URLs
                if value.startswith("http"):
                    new_lines.append(f'{key}: "{value}"')
                else:
                    new_lines.append(f"{key}: {value}")
                updated_keys.add(key)
                continue
        new_lines.append(line)

    # Add any new keys
    for key, value in updates.items():
        if key not in updated_keys:
            if value.startswith("http"):
                new_lines.append(f'{key}: "{value}"')
            else:
                new_lines.append(f"{key}: {value}")

    return "---\n" + "\n".join(new_lines) + "\n---" + parts[2]


def git_commit_and_push(message: str):
    """Commit all changes and push."""
    subprocess.run(["git", "add", "-A"], cwd=REPO_DIR, check=True)
    subprocess.run(["git", "commit", "-m", message], cwd=REPO_DIR, check=True)
    subprocess.run(["git", "push"], cwd=REPO_DIR, check=True)


def wait_for_github_actions():
    """Wait for GitHub Actions workflow to complete."""
    print("Waiting for GitHub Actions to complete...")

    # Give GitHub a moment to register the push
    time.sleep(5)

    # Poll for workflow completion
    headers = {}
    gh_token = os.environ.get("GITHUB_TOKEN")
    if gh_token:
        headers["Authorization"] = f"token {gh_token}"

    for _ in range(60):  # Max 10 minutes
        try:
            resp = requests.get(
                f"https://api.github.com/repos/{GITHUB_REPO}/actions/runs",
                headers=headers,
                params={"per_page": 1}
            )
            if resp.ok:
                runs = resp.json().get("workflow_runs", [])
                if runs:
                    status = runs[0].get("status")
                    conclusion = runs[0].get("conclusion")
                    print(f"  Workflow status: {status}, conclusion: {conclusion}")
                    if status == "completed":
                        if conclusion == "success":
                            print("GitHub Actions completed successfully!")
                            return True
                        else:
                            print(f"GitHub Actions failed with conclusion: {conclusion}")
                            return False
        except Exception as e:
            print(f"  Error checking workflow status: {e}")

        time.sleep(10)

    print("Timed out waiting for GitHub Actions")
    return False


def post_to_gotosocial(title: str, url: str) -> str | None:
    """Post to GotoSocial, returns status ID."""
    token = os.environ.get("GOTOSOCIAL_TOKEN")
    if not token:
        print("Error: GOTOSOCIAL_TOKEN not set")
        return None

    status_text = f"{title}\n\n{url}"

    resp = requests.post(
        f"{GOTOSOCIAL_INSTANCE}/api/v1/statuses",
        headers={"Authorization": f"Bearer {token}"},
        data={"status": status_text}
    )

    if resp.ok:
        status_id = resp.json().get("id")
        print(f"Posted to GotoSocial: {status_id}")
        return status_id
    else:
        print(f"Failed to post to GotoSocial: {resp.status_code} {resp.text}")
        return None


def post_to_bluesky(title: str, url: str) -> str | None:
    """Post to Bluesky, returns post URL."""
    handle = os.environ.get("BLUESKY_HANDLE")
    password = os.environ.get("BLUESKY_APP_PASSWORD")

    if not handle or not password:
        print("Error: BLUESKY_HANDLE or BLUESKY_APP_PASSWORD not set")
        return None

    # Create session
    session_resp = requests.post(
        f"{BLUESKY_API}/com.atproto.server.createSession",
        json={"identifier": handle, "password": password}
    )

    if not session_resp.ok:
        print(f"Failed to create Bluesky session: {session_resp.status_code} {session_resp.text}")
        return None

    session = session_resp.json()
    access_token = session["accessJwt"]
    did = session["did"]

    # Create post with link card facet
    post_text = f"{title}\n\n{url}"

    # Calculate byte positions for the URL facet
    text_before_url = f"{title}\n\n"
    url_start = len(text_before_url.encode("utf-8"))
    url_end = url_start + len(url.encode("utf-8"))

    record = {
        "$type": "app.bsky.feed.post",
        "text": post_text,
        "createdAt": time.strftime("%Y-%m-%dT%H:%M:%S.000Z", time.gmtime()),
        "facets": [
            {
                "index": {"byteStart": url_start, "byteEnd": url_end},
                "features": [{"$type": "app.bsky.richtext.facet#link", "uri": url}]
            }
        ]
    }

    post_resp = requests.post(
        f"{BLUESKY_API}/com.atproto.repo.createRecord",
        headers={"Authorization": f"Bearer {access_token}"},
        json={
            "repo": did,
            "collection": "app.bsky.feed.post",
            "record": record
        }
    )

    if post_resp.ok:
        uri = post_resp.json().get("uri")
        # Convert at:// URI to bsky.app URL
        # at://did:plc:xxx/app.bsky.feed.post/yyy -> https://bsky.app/profile/handle/post/yyy
        post_id = uri.split("/")[-1]
        post_url = f"https://bsky.app/profile/{handle}/post/{post_id}"
        print(f"Posted to Bluesky: {post_url}")
        return post_url
    else:
        print(f"Failed to post to Bluesky: {post_resp.status_code} {post_resp.text}")
        return None


def main():
    if len(sys.argv) != 2:
        print("Usage: posse.py <slug>")
        print("Example: posse.py my-blog-post")
        sys.exit(1)

    slug = sys.argv[1]

    # Find the post file
    post_file = find_post_file(slug)
    if not post_file:
        print(f"Error: Could not find post with slug '{slug}'")
        print(f"Looking in: {BLOG_DIR}")
        sys.exit(1)

    print(f"Found post: {post_file}")

    # Read and parse frontmatter
    content = post_file.read_text()
    frontmatter, _ = parse_frontmatter(content)

    title = frontmatter.get("title", slug.replace("-", " "))
    post_url = f"{SITE_URL}/blog/{slug}/"

    print(f"Title: {title}")
    print(f"URL: {post_url}")

    # Check if already syndicated
    if frontmatter.get("gotosocial_post_id") or frontmatter.get("bluesky_post_url"):
        print("Warning: Post already has syndication IDs in frontmatter")
        response = input("Continue anyway? [y/N] ")
        if response.lower() != "y":
            sys.exit(0)

    # Step 1: Commit and push
    print("\n--- Step 1: Commit and push ---")
    try:
        git_commit_and_push(f"Publish: {title}")
    except subprocess.CalledProcessError as e:
        print(f"Git error: {e}")
        print("Maybe nothing to commit? Continuing...")

    # Step 2: Wait for GitHub Actions
    print("\n--- Step 2: Wait for deploy ---")
    if not wait_for_github_actions():
        print("Warning: Could not verify deploy completed")
        response = input("Continue with syndication anyway? [y/N] ")
        if response.lower() != "y":
            sys.exit(1)

    # Step 3: Post to social platforms
    print("\n--- Step 3: Syndicate to social platforms ---")
    updates = {}

    gotosocial_id = post_to_gotosocial(title, post_url)
    if gotosocial_id:
        updates["gotosocial_post_id"] = gotosocial_id

    bluesky_url = post_to_bluesky(title, post_url)
    if bluesky_url:
        updates["bluesky_post_url"] = bluesky_url

    if not updates:
        print("Error: Failed to post to any platform")
        sys.exit(1)

    # Step 4: Update frontmatter
    print("\n--- Step 4: Update frontmatter ---")
    new_content = update_frontmatter(content, updates)
    post_file.write_text(new_content)
    print(f"Updated {post_file.name}")

    # Step 5: Commit and push again
    print("\n--- Step 5: Commit syndication IDs ---")
    git_commit_and_push(f"Add syndication IDs: {title}")

    print("\n--- Done! ---")
    print(f"Post URL: {post_url}")
    if gotosocial_id:
        print(f"GotoSocial: {GOTOSOCIAL_INSTANCE}/@ikesau/{gotosocial_id}")
    if bluesky_url:
        print(f"Bluesky: {bluesky_url}")


if __name__ == "__main__":
    main()
