import json

with open("issues.json") as f:
    issues = json.load(f)

with open("communities.json", "r+") as f:
    data = json.load(f)
    for issue in issues:
        body_lines = issue["body"].split("\n")
        new_entry = {
            "name": body_lines[0].split(": ")[1],
            "website": body_lines[1].split(": ")[1],
            "twitter": body_lines[2].split(": ")[1],
            "contact": body_lines[3].split(": ")[1]
        }
        data.append(new_entry)

    f.seek(0)
    json.dump(data, f, indent=2)
