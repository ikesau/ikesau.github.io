#!/usr/bin/env nu

def "create-post" [slug: string, templatePath: string] {
    let todays_date = date now | format date "%Y-%m-%d"
    let template = open $templatePath
    $template | str replace --all "{{create_post_placeholder}}" $slug | save $"_posts/($todays_date)-($slug).html"
}

def "main create blog" [slug: string] {
    create-post $slug "_layouts/blog-template.html"
}

def "main create til" [slug: string] {
    create-post $slug "_layouts/thing-i-like-template.html"
}

def "main reblog" [url: string, title: string, comment?: string] {
    let todays_date = date now | format date "%Y-%m-%d"
    mut dataAsPlaintext = open --raw _data/reblogs.yml

    mut record = {
        url: $url
        title: $title
    }

    if ($comment != null) {
        $record = $record | merge { comment: $comment }
    }

    $record = $record | merge { date: $todays_date }

    let yamlData = [$record] | to yaml

    $dataAsPlaintext + $"\n($yamlData)" | save -f _data/reblogs.yml

    git add _data/reblogs.yml
    git commit -m $"Reblog '($title)'"
    git push

}

def main [] {
    print "Commands:"
    print "  create blog $slug"
    print "  create til $slug"
    print "  reblog $url $title $description?"
}
