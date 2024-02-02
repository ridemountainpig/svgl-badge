const fetch = require("node-fetch");
const fs = require("fs");

async function getAllSvglJson() {
    try {
        const response = await fetch("https://svgl.app/api/svgs");
        if (!response.ok) {
            throw new Error("Failed to fetch SVGs");
        }

        const data = await response.json();
        const filePath = "public/svgs.json";
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
        console.log("SVGs updated successfully.");
    } catch (error) {
        console.error(error);
    }
}

getAllSvglJson();
