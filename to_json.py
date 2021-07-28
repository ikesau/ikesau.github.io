import json
with open("path-to-clippings") as file:
    lines = file.readlines()
    filtered_lines = filter(lambda line: line not in ["\n", "\r"], lines)
    with open("assets/clippings.json", "w", encoding="utf-8") as output:
        output.write(json.dumps(list(filtered_lines)))
