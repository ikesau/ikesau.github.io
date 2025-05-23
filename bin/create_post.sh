#!/bin/bash

# Function to display usage
usage() {
    echo "Usage: $0 [-t template_type] post-title"
    echo "  -t: Template type ('blog' or 'til'). Default: 'blog'"
    echo "  post-title: Hyphen-separated string for the post title"
    echo
    echo "Examples:"
    echo "  $0 my-awesome-post                    # Creates a blog post"
    echo "  $0 -t blog my-awesome-post           # Creates a blog post (explicit)"
    echo "  $0 -t til cool-gadget      # Creates a things-i-like post"
    exit 1
}

# Default template type
template_type="blog"

# Parse command line options
while getopts "t:h" opt; do
    case $opt in
        t)
            template_type="$OPTARG"
            ;;
        h)
            usage
            ;;
        \?)
            echo "Invalid option: -$OPTARG" >&2
            usage
            ;;
    esac
done

# Shift to get the post title argument
shift $((OPTIND-1))

# Check if post title argument is provided
if [ $# -eq 0 ]; then
    echo "No post title supplied. Please provide a hyphen-separated string."
    usage
fi

post_title="$1"

# Validate template type
if [ "$template_type" != "blog" ] && [ "$template_type" != "til" ]; then
    echo "Invalid template type: $template_type"
    echo "Supported types: 'blog', 'til'"
    exit 1
fi

# Placeholder symbol in the template file
placeholder="{{create_post_placeholder}}"

# Replace hyphens with spaces and capitalize for title
title=$(echo $post_title | sed 's/-/ /g')

# Get the current date in YYYY-MM-DD format
current_date=$(date +%Y-%m-%d)

# Set template file and destination based on template type
if [ "$template_type" = "blog" ]; then
    template="./_layouts/blog-template.html"
    destination="./_posts/${current_date}-$post_title.html"
else
    template="./_layouts/thing-i-like-template.html"
    destination="./_posts/${current_date}-$post_title.html"
fi

# Check if the template file exists
if [ ! -f "$template" ]; then
    echo "Template file not found: $template"
    exit 1
fi

# Copy and modify the template
sed "s/$placeholder/$title/g" "$template" > "$destination"

echo "File copied and modified to $destination using $template_type template"