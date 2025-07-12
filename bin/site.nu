#!/usr/bin/env nu

def "get-repo-root" [] {
    const script_path = path self
    $script_path | path split | drop 2 | path join
}

def "create-post" [slug: string, templatePath: string, outputPath: string] {
    let todays_date = date now | format date "%Y-%m-%d"
    let root = get-repo-root
    let template = open ($root | path join $templatePath)
    $template | str replace --all "{{create_post_placeholder}}" $slug | save $"($root)/($outputPath)/($todays_date)-($slug).html"
}

def "main create blog" [slug: string] {
    create-post $slug "bin/templates/blog-template.html" "content/blog"
}

def "main create til" [slug: string] {
    create-post $slug "bin/templates/til-template.html" "content/things-i-like"
}

def "main reblog" [url: string, title: string, comment?: string] {
    let todays_date = date now | format date "%Y-%m-%d"
    let root = get-repo-root
    let data_path = $root | path join "data/reblogs.yml"
    
    mut dataAsPlaintext = open --raw $data_path
    mut record = {
        url: $url
        title: $title
    }
    if ($comment != null) {
        $record = $record | merge { comment: $comment }
    }
    $record = $record | merge { date: $todays_date }
    let yamlData = [$record] | to yaml
    
    $dataAsPlaintext + $"\n($yamlData)" | save -f $data_path
    
    cd $root
    git add data/reblogs.yml
    git commit -m $"Reblog '($title)'"
    git push
}

def main [] {
    print "Commands:"
    print "  create blog $slug"
    print "  create til $slug"
    print "  reblog $url $title $comment?"
}
