import type { NextApiRequest, NextApiResponse } from "next";

export default async function svgs(req: NextApiRequest, res: NextApiResponse) {
    try {
        const response = await fetch("https://svgl.app/api/svgs");
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
