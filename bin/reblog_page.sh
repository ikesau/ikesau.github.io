#!/bin/bash

# Check if at least 2 arguments are provided
if [ $# -lt 2 ]; then
    echo "Usage: $0 <url> <title> [comment]"
    exit 1
fi

# Assign arguments to variables
url="$1"
title="$2"
comment="${3:-}"  # If $3 is not set, use an empty string

# Define the file path
file="/Users/ikesau/code/ikesau.github.io/_data/reblogs.yml"

# Append to the YAML file
{
    echo "- url: $url"
    echo "  title: \"$title\""
    if [ -n "$comment" ]; then
        echo "  comment: \"$comment\""
    fi
    echo "  date: $(date +'%Y-%m-%d')"
    echo ""  
} >> "$file"

echo "Bookmark added successfully."