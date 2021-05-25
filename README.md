### how this works

1. set up ruby with `rvm`
1. `rvm install 3.0.0`
1. `rvm use 3.0.0`
1. `bundle install`
1. `bundle exec jekyll serve --trace`

Markdown files in the root directory create pages correspondending to their names. They can use YAML 'front matter' to specify config and template information.

The gallery template requires a YAML entry in `_data` and photos in `assets/images`
