source "https://rubygems.org"

# Run Jekyll with `bundle exec jekyll serve`

# https://github.com/github/pages-gem
gem "github-pages", "~> 214", group: :jekyll_plugins

# Windows and JRuby does not include zoneinfo files, so bundle the tzinfo-data gem
# and associated library.
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", "~> 1.2"
  gem "tzinfo-data"
end

# Performance-booster for watching directories on Windows
gem "wdm", "~> 0.1.1", :platforms => [:mingw, :x64_mingw, :mswin]

# not included in default jekyll install anymore
# https://github.com/jekyll/jekyll/issues/8523
gem "webrick", "~> 1.7"

gem "jekyll-feed"