import aiohttp
import asyncio
import os
import json
from urllib.parse import quote


async def fetchSvg(session, svgFileUrl):
    try:
        svgFileName = svgFileUrl.split("/")[-1]
        svgFileUrl = "https://raw.githubusercontent.com/pheralb/svgl/main/static" + svgFileUrl

        async with session.get(svgFileUrl) as response:
            response.raise_for_status()
            data = await response.text()

        file_path = f"static/library/{svgFileName}"
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(data)

        print(f"SVG {svgFileName} downloaded successfully.")
    except Exception as error:
        print(error)


async def getSvglJson():
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get("https://raw.githubusercontent.com/pheralb/svgl/main/src/data/svgs.ts") as response:
                response.raise_for_status()
                data = await response.text()
                data = data.split("export const svgs: iSVG[] = [")[1].split("];")[0]

        svg_data_keys = ["title:", "category:", "route:", "wordmark:", "url:", "light:", "dark:"]
        data = data.replace("'", '"')

        for key in svg_data_keys:
            data = data.replace(key, f"\"{key[:-1]}\":")

        data = json.loads("[" + data + "]")

        for svg in data:
            if type(svg["category"]) == list:
                svg["category"].sort()

        file_path = "public/svgs.json"
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=4)

        print("SVGs updated successfully.")
    except Exception as error:
        print(error)


async def getSvglLibrarySvg():
    try:
        with open("public/svgs.json", "r") as f:
            data = json.load(f)

        async with aiohttp.ClientSession() as session:
            tasks = []
            for svg in data:
                if type(svg["route"]) == str:
                    tasks.append(fetchSvg(session, svg["route"]))
                else:
                    tasks.append(fetchSvg(session, svg["route"]["light"]))
                    tasks.append(fetchSvg(session, svg["route"]["dark"]))

                if svg.get("wordmark"):
                    if type(svg["wordmark"]) == str:
                        tasks.append(fetchSvg(session, svg["wordmark"]))
                    else:
                        tasks.append(fetchSvg(session, svg["wordmark"]["light"]))
                        tasks.append(fetchSvg(session, svg["wordmark"]["dark"]))

            await asyncio.gather(*tasks)
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
    with open("public/svgs.json", "r") as f:
        data = json.load(f)
        for svg in data:
            badgeTitle = quote(
                svg["title"]
                if "/" not in svg["title"]
                else svg["title"].replace("/", "")
            )
            badgeCategory = quote(
                svg["category"] if type(svg["category"]) == str else svg["category"][0]
            )

            badgeSvgRoute = svg["route"]
            lightSvg = ""
            darkSvg = ""
            if type(badgeSvgRoute) == dict:
                lightSvg = badgeSvgRoute["light"].replace(
                    "/library/", ""
                )
                darkSvg = badgeSvgRoute["dark"].replace("/library/", "")
            else:
                lightSvg = badgeSvgRoute.replace("/library/", "")
                darkSvg = badgeSvgRoute.replace("/library/", "")

            title = svg["title"]
            lightUrl = f"/api/{badgeCategory}/{badgeTitle}?theme=light"
            darkUrl = f"/api/{badgeCategory}/{badgeTitle}?theme=dark"
            lightBadgeUrl = f"https://svgl-badge.vercel.app/api/{badgeCategory}/{badgeTitle}?theme=light"
            darkBadgeUrl = f"https://svgl-badge.vercel.app/api/{badgeCategory}/{badgeTitle}?theme=dark"
            light_badge_md += (
                f"| {title} | ![{title}]({lightBadgeUrl}) | `{lightBadgeUrl}` |\n"
            )
            dark_badge_md += (
                f"| {title} | ![{title}]({darkBadgeUrl}) | `{darkBadgeUrl}` |\n"
            )
            badge_json_data[f"{title} {badgeCategory}"] = {
                "light": lightUrl,
                "dark": darkUrl,
                "lightSvg": lightSvg,
                "darkSvg": darkSvg,
            }
    with open("public/light_badge.md", "w") as f:
        f.write(light_badge_md)
    with open("public/dark_badge.md", "w") as f:
        f.write(dark_badge_md)
    with open("public/badge.json", "w") as f:
        json.dump(badge_json_data, f, ensure_ascii=False, indent=4)
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
    wordmark_badge_json_data = {}
    with open("public/svgs.json", "r") as f:
        data = json.load(f)
        for svg in data:
            if svg.get("wordmark"):
                badgeTitle = quote(
                    svg["title"]
                    if "/" not in svg["title"]
                    else svg["title"].replace("/", "")
                )
                badgeCategory = quote(
                    svg["category"]
                    if type(svg["category"]) == str
                    else svg["category"][0]
                )

                badgeSvgRoute = svg["wordmark"]
                lightSvg = ""
                darkSvg = ""
                if type(badgeSvgRoute) == dict:
                    lightSvg = badgeSvgRoute["light"].replace(
                        "/library/", ""
                    )
                    darkSvg = badgeSvgRoute["dark"].replace(
                        "/library/", ""
                    )
                else:
                    lightSvg = badgeSvgRoute.replace("/library/", "")
                    darkSvg = badgeSvgRoute.replace("/library/", "")

                title = svg["title"]
                lightWordmarkUrl = (
                    f"/api/{badgeCategory}/{badgeTitle}?theme=light&wordmark=true"
                )
                darkWordmarkUrl = (
                    f"/api/{badgeCategory}/{badgeTitle}?theme=dark&wordmark=true"
                )
                lightWordmarkBadgeUrl = f"https://svgl-badge.vercel.app/api/{badgeCategory}/{badgeTitle}?theme=light&wordmark=true"
                darkWordmarkBadgeUrl = f"https://svgl-badge.vercel.app/api/{badgeCategory}/{badgeTitle}?theme=dark&wordmark=true"
                light_badge_md += f"| {title} | ![{title}]({lightWordmarkBadgeUrl}) | `{lightWordmarkBadgeUrl}` |\n"
                dark_badge_md += f"| {title} | ![{title}]({darkWordmarkBadgeUrl}) | `{darkWordmarkBadgeUrl}` |\n"
                wordmark_badge_json_data[f"{title} {badgeCategory}"] = {
                    "light": lightWordmarkUrl,
                    "dark": darkWordmarkUrl,
                    "lightSvg": lightSvg,
                    "darkSvg": darkSvg,
                }
    with open("public/light_wordmark_badge.md", "w") as f:
        f.write(light_badge_md)
    with open("public/dark_wordmark_badge.md", "w") as f:
        f.write(dark_badge_md)
    with open("public/wordmark-badge.json", "w") as f:
        json.dump(wordmark_badge_json_data, f, ensure_ascii=False, indent=4)
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


async def main():
    await getSvglJson()
    await getSvglLibrarySvg()

asyncio.run(main())
updateSvglBadge()
updateSvglWordmarkBadge()
# updateSvglBadgeReadme()
