### how this works

1. (on nushell) install [`asdf`](https://github.com/asdf-vm/asdf-ruby)
1. `asdf install ruby 3.3.0`
1. `asdf global 3.30`
1. `bundle install`
1. `bundle exec jekyll serve --trace --drafts`

Markdown files in the root directory create pages correspondending to their names. They can use YAML 'front matter' to specify config and template information.

The gallery template requires a YAML entry in `_data` and photos in `assets/images`
