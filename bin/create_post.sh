#!/bin/bash

# Check if an argument is provided
if [ $# -eq 0 ]; then
    echo "No argument supplied. Please provide a hyphen-separated string."
    exit 1
fi

# Placeholder symbol in the template file
placeholder="{{create_post_placeholder}}"

# Replace hyphens with spaces and capitalize for title
title=$(echo $1 | sed 's/-/ /g') 

# Get the current date in YYYY-MM-DD format
current_date=$(date +%Y-%m-%d)

# Construct the destination file path
destination="./_posts/${current_date}-$1.html"

# Check if the template file exists
template="./_layouts/thing-i-like-template.html"
if [ ! -f "$template" ]; then
    echo "Template file not found." exit 1
fi

# Copy and modify the template
sed "s/$placeholder/$title/g" "$template" > "$destination"

echo "File copied and modified to $destination"

