import requests
import json


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
    with open("public/svgs.json", "r") as f:
        data = json.load(f)
        for svg in data:
            badgeId = svg["id"]
            title = svg["title"]
            lightUrl = f"https://svgl-badge.vercel.app/api/{badgeId}?theme=light"
            darkUrl = f"https://svgl-badge.vercel.app/api/{badgeId}?theme=dark"
            light_badge_md += f"| {title} | ![{title}]({lightUrl}) | `{lightUrl}` |\n"
            dark_badge_md += f"| {title} | ![{title}]({darkUrl}) | `{darkUrl}` |\n"
    with open("public/light_badge.md", "w") as f:
        f.write(light_badge_md)
    with open("public/dark_badge.md", "w") as f:
        f.write(dark_badge_md)
    print("Badges updated successfully.")


def updateSvglBadgeReadme():
    readme = """
# Svgl Badges

[![Svgl](https://svgl-badge.vercel.app/api/336?theme=light)](https://svgl.app)
[![GitHub](https://svgl-badge.vercel.app/api/1?theme=light)](https://github.com/ridemountainpig/svgl-badge)
[![Vercel](https://svgl-badge.vercel.app/api/4?theme=light)](https://vercel.com)
[![Next.JS](https://svgl-badge.vercel.app/api/9?theme=light)](https://nextjs.org)
[![Tailwind CSS](https://svgl-badge.vercel.app/api/39?theme=light)](https://tailwindcss.com)

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
updateSvglBadgeReadme()
