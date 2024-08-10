import fs from "fs";
import { Toaster } from "react-hot-toast";
import { Suspense } from 'react';

import { Navbar } from "@/components/navbar";
import { Search } from "@/components/search";

export default function Home() {
    const badgeData = fs.readFileSync("public/wordmark-badge.json", "utf-8");
    const badges = JSON.parse(badgeData);
    const badgeCount = Object.keys(badges).length;
    const domain = process.env.DEPLOY_DOMAIN ?? "";

    return (
        <div className="h-screen w-full flex-col justify-center bg-white font-sans text-black dark:bg-neutral-900 dark:text-white">
            <div className="h-full w-full">
                <Navbar></Navbar>
                <Suspense fallback={ <></> }>
                    <Search
                        badgeCount={badgeCount}
                        badges={badges}
                        domain={domain}
                    ></Search>
                </Suspense>
            </div>
            <Toaster
                position="bottom-right"
                toastOptions={{
                    className:
                        "text-[14px] tracking-wide font-bold text-neutral-900 font-sans w-[18rem] h-[4rem] bg-white dark:bg-neutral-900 dark:text-white border border-neutral-300 dark:border-neutral-800 rounded-md shadow-lg",
                }}
            />
        </div>
    );
}
