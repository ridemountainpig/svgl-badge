import type { NextApiRequest, NextApiResponse } from "next";

import fs from "fs";
import path from "path";
import { imageSize } from "image-size";

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

async function getSvglSVGs(url: string) {
    const filePath = path.join(process.cwd(), "static", url);
    const svgContent = fs.readFileSync(filePath, "utf8");
    return svgContent;
}

function getImageDimensions(base64: string) {
    const buffer = Buffer.from(base64, "base64");
    return imageSize(buffer);
}

export default async function svglBadge(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    try {
        const filePath = path.join(process.cwd(), "public", "svgs.json");
        const jsonData = JSON.parse(fs.readFileSync(filePath, "utf8"));

        const svgParam = req.query["category-name"] as string[];
        const svgCategoryParam = svgParam[0] as string;
        const svgNameParam = svgParam[1] as string;
        const theme = req.query.theme as string;
        const wordmark = req.query.wordmark as string;

        const svglJson = jsonData.find((svg: iSVG) =>
            svg.title.includes("/")
                ? svg.title.replace("/", "") === svgNameParam
                : svg.title === svgNameParam &&
                  (typeof svg.category === "string"
                      ? svg.category === svgCategoryParam
                      : svg.category?.includes(svgCategoryParam)),
        );

        if (!svglJson) {
            throw new Error(
                `SVG Name ${svgNameParam} with Category ${svgCategoryParam} not found`,
            );
        }

        let svgUrl;
        if (wordmark && svglJson["wordmark"]) {
            if (typeof svglJson["wordmark"] == "object") {
                svgUrl =
                    theme == "dark"
                        ? svglJson["wordmark"]["dark"]
                        : svglJson["wordmark"]["light"];
            } else {
                svgUrl = svglJson["wordmark"];
            }
        } else {
            if (typeof svglJson["route"] == "object") {
                svgUrl =
                    theme == "dark"
                        ? svglJson["route"]["dark"]
                        : svglJson["route"]["light"];
            } else {
                svgUrl = svglJson["route"];
            }
        }

        let svgString = await getSvglSVGs(
            svgUrl.replace("https://svgl.app/", ""),
        );
        if (!svgString) {
            throw new Error("Failed to fetch svgl svg");
        }
        const svgBase64 = svgToBase64(svgString);
        const dimensions = getImageDimensions(svgBase64);
        let svgWordmarkWidth;
        if (
            wordmark &&
            svglJson["wordmark"] &&
            dimensions.height &&
            dimensions.width
        ) {
            svgWordmarkWidth = (30 / dimensions.height) * dimensions.width + 20;
        }

        const svgName = svglJson["title"].toUpperCase();
        const svgWidth =
            wordmark && svglJson["wordmark"]
                ? svgWordmarkWidth
                : svgName.length * 10 + svgName.length * 0.4 + 52;
        const css = getSvglBadgeCss();

        const svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgWidth} 40" width="${svgWidth}" height="40">
            <style>
                ${css}
            </style>
            <foreignObject x="0" y="0" width="${svgWidth}" height="40" class="rounded-md overflow-hidden">
                <div xmlns="http://www.w3.org/1999/xhtml" class="w-full h-full flex justify-center items-center ${theme == "dark" ? "bg-neutral-900" : "bg-white"} border ${theme == "dark" ? "border-neutral-800" : "border-neutral-200"}  rounded-md gap-x-2">
                    ${
                        wordmark && svglJson["wordmark"]
                            ? `
                            <div class="w-[92%] flex justify-center items-center">
                                <img src="data:image/svg+xml;base64,${svgBase64}" class="h-[30px]" />
                            </div>
                            `
                            : `
                        <div class="pl-2">
                            <img src="data:image/svg+xml;base64,${svgBase64}" class="h-7 w-7" />
                        </div>
                        <div class="pr-2">
                            <span class="truncate text-[15px] font-semibold font-sans tracking-wide text-center ${theme == "dark" ? "text-white" : "text-black"}">
                                ${svgName}
                            </span>
                        </div>
                        `
                    }
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
