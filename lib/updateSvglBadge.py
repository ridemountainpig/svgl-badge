import requests
import json
from urllib.parse import quote


def getSvglJson():
    try:
        response = requests.get("https://svgl.app/api/svgs")
        response.raise_for_status()

        data = response.json()
        for svg in data:
            if type(svg["category"]) == list:
                svg["category"].sort()
        file_path = "public/svgs.json"

        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=4)

        print("SVGs updated successfully.")
    except Exception as error:
        print(error)


def updateSvglBadge():
    light_badge_md = f"""
| Title | Badge | Markdown |
| --- | --- | --- |
"""
    dark_badge_md = f"""
| Title | Badge | Markdown |
| --- | --- | --- |
"""
    badge_json_data = {}
    wordmark_badge_json_data = {}
    with open("public/svgs.json", "r") as f:
        data = json.load(f)
        for svg in data:
            badgeTitle = quote(svg["title"] if "/" not in svg["title"] else svg["title"].replace("/", ""))
            badgeCategory = quote(svg["category"] if type(svg["category"]) == str else svg["category"][0])
            title = svg["title"]
            lightUrl = f"https://svgl-badge.vercel.app/api/{badgeCategory}/{badgeTitle}?theme=light"
            darkUrl = f"https://svgl-badge.vercel.app/api/{badgeCategory}/{badgeTitle}?theme=dark"
            if svg.get("wordmark"):
                lightWordmarkUrl = f"https://svgl-badge.vercel.app/api/{badgeCategory}/{badgeTitle}?theme=light&wordmark=true"
                darkWordmarkUrl = f"https://svgl-badge.vercel.app/api/{badgeCategory}/{badgeTitle}?theme=dark&wordmark=true"
            light_badge_md += f"| {title} | ![{title}]({lightUrl}) | `{lightUrl}` |\n"
            dark_badge_md += f"| {title} | ![{title}]({darkUrl}) | `{darkUrl}` |\n"
            badge_json_data[title] = {"light": lightUrl, "dark": darkUrl}
            if svg.get("wordmark"):
                wordmark_badge_json_data[title] = {"light": lightWordmarkUrl, "dark": darkWordmarkUrl}
    with open("public/light_badge.md", "w") as f:
        f.write(light_badge_md)
    with open("public/dark_badge.md", "w") as f:
        f.write(dark_badge_md)
    with open("public/badge.json", "w") as f:
        json.dump(badge_json_data, f, ensure_ascii=False, indent=4)
    with open("public/wordmark-badge.json", "w") as f:
        json.dump(wordmark_badge_json_data, f, ensure_ascii=False, indent=4)
    print("Badges updated successfully.")


def updateSvglWordmarkBadge():
    light_badge_md = f"""
| Title | Badge | Markdown |
| --- | --- | --- |
"""
    dark_badge_md = f"""
| Title | Badge | Markdown |
| --- | --- | --- |
"""
    with open("public/svgs.json", "r") as f:
        data = json.load(f)
        for svg in data:
            if svg.get("wordmark"):
                badgeTitle = quote(svg["title"] if "/" not in svg["title"] else svg["title"].replace("/", ""))
                badgeCategory = quote(svg["category"] if type(svg["category"]) == str else svg["category"][0])
                title = svg["title"]
                lightUrl = f"https://svgl-badge.vercel.app/api/{badgeCategory}/{badgeTitle}?theme=light&wordmark=true"
                darkUrl = f"https://svgl-badge.vercel.app/api/{badgeCategory}/{badgeTitle}?theme=dark&wordmark=true"
                light_badge_md += f"| {title} | ![{title}]({lightUrl}) | `{lightUrl}` |\n"
                dark_badge_md += f"| {title} | ![{title}]({darkUrl}) | `{darkUrl}` |\n"
    with open("public/light_wordmark_badge.md", "w") as f:
        f.write(light_badge_md)
    with open("public/dark_wordmark_badge.md", "w") as f:
        f.write(dark_badge_md)
    print("Wordmark Badges updated successfully.")


def updateSvglBadgeReadme():
    readme = """
# Svgl Badges

[![Svgl](https://svgl-badge.vercel.app/api/Library/Svgl?theme=light)](https://svgl.app)
[![GitHub](https://svgl-badge.vercel.app/api/Software/Github?theme=light)](https://github.com/ridemountainpig/svgl-badge)
[![Vercel](https://svgl-badge.vercel.app/api/Hosting/Vercel?theme=light)](https://vercel.com)
[![Next.JS](https://svgl-badge.vercel.app/api/Framework/Next.js?theme=light)](https://nextjs.org)
[![Tailwind CSS](https://svgl-badge.vercel.app/api/Framework/Tailwind%20CSS?theme=light)](https://tailwindcss.com)

The Markdown Badges for all the SVGs available on [Svgl](https://svgl.app).

## Usage: 
- Press `Ctrl + f` on your keyboard, to bring out the search modal.
- Enter the SVG name of the badge you need.<br/>
- Copy the badge's markdown or download the badge for use.

"""
    readme += "## Light Theme\n"

    with open("public/light_badge.md", "r", encoding="utf-8") as f:
        readme += f.read()

    readme += "## Dark Theme\n"

    with open("public/dark_badge.md", "r", encoding="utf-8") as f:
        readme += f.read()

    with open("README.md", "w", encoding="utf-8") as f:
        f.write(readme)

    print("Readme updated successfully.")


getSvglJson()
updateSvglBadge()
updateSvglWordmarkBadge()
# updateSvglBadgeReadme()
