import type { NextApiRequest, NextApiResponse } from "next";

export default async function svgs(req: NextApiRequest, res: NextApiResponse) {
    try {
        const response = await fetch("https://api.svgl.app", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "User-Agent":
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
            },
        });
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
