import type { NextApiRequest, NextApiResponse } from "next";

import fs from "fs";
import path from "path";

type ThemeOptions = {
    light: string;
    dark: string;
};

interface iSVG {
    id: number;
    title: string;
    category: string | string[];
    route: string | ThemeOptions;
    wordmark?: string | ThemeOptions;
    url: string;
}

function svgToBase64(svgContent: string) {
    return Buffer.from(svgContent).toString("base64");
}

function getSvglBadgeCss() {
    const filePath = path.join(process.cwd(), "app", "svgl-badge.css");
    const cssContent = fs.readFileSync(filePath, "utf8");
    return cssContent;
}

async function getSvglJsonByName(name: string) {
    try {
        const response = await fetch(
            `https://svgl.app/api/svgs?search=${name}`,
        );

        if (!response.ok) {
            throw new Error("Failed to fetch svgl json");
        }

        try {
            const svglJson = await response.json();
            return svglJson;
        } catch (jsonError) {
            throw new Error("Failed to parse JSON");
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function getSvglSVGs(url: string) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Failed to fetch svgl svg");
        }

        return await response.text();
    } catch (error) {
        console.log(error);
        return null;
    }
}

export default async function svglBadge(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    try {
        const filePath = path.join(process.cwd(), "public", "svgs.json");
        const jsonData = JSON.parse(fs.readFileSync(filePath, "utf8"));

        const { id, theme } = req.query;

        const svglJson = jsonData.find((svg: iSVG) => svg.id.toString() === id);

        if (!svglJson) {
            throw new Error(`SVG with id ${id} not found`);
        }

        let svgUrl;
        if (typeof svglJson["route"] == "object") {
            svgUrl =
                theme == "dark"
                    ? svglJson["route"]["dark"]
                    : svglJson["route"]["light"];
        } else {
            svgUrl = svglJson["route"];
        }

        let svgString = await getSvglSVGs(svgUrl);
        if (!svgString) {
            throw new Error("Failed to fetch svgl svg");
        }
        const svgBase64 = svgToBase64(svgString);

        const svgName = svglJson["title"].toUpperCase();
        const svgWidth = svgName.length * 10 + svgName.length * 0.4 + 52;
        const css = getSvglBadgeCss();

        const svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgWidth} 40" width="${svgWidth}" height="40">
            <style>
                ${css}
            </style>
            <foreignObject x="0" y="0" width="${svgWidth}" height="40" class="rounded-md overflow-hidden">
                <div xmlns="http://www.w3.org/1999/xhtml" class="w-full h-full flex justify-center items-center ${theme == "dark" ? "bg-black" : "bg-white"} border ${theme == "dark" ? "border-neutral-800" : "border-neutral-200"}  rounded-md gap-x-2">
                    <div class="pl-2">
                        <img src="data:image/svg+xml;base64,${svgBase64}" class="h-7 w-7" />
                    </div>
                    <div class="pr-2">
                        <span class="truncate text-[15px] font-semibold font-sans tracking-wide text-center ${theme == "dark" ? "text-white" : "text-black"}">
                            ${svgName}
                        </span>
                    </div>
                </div>
            </foreignObject>
        </svg>
        `;

        res.setHeader("Content-Type", "image/svg+xml");
        res.status(200).send(svgContent);
    } catch (error) {
        console.log(error);
        res.setHeader("Content-Type", "text/plain");
        res.status(200).send("null");
    }
}
