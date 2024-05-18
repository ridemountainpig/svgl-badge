import React, { useState, useEffect } from "react";
import { Badge } from "@/components/badge";

interface BadgesProps {
    badges: Record<
        string,
        { light: string; dark: string; lightSvg: string; darkSvg: string }
    >;
    domain: string;
    setProgressLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const Badges = React.memo(
    ({ badges, domain, setProgressLoading }: BadgesProps) => {
        const [loading, setLoading] = useState(true); // State to track loading status

        useEffect(() => {
            setTimeout(() => {
                setLoading(false);
                setProgressLoading(false);
            }, 2500);
        }, [badges, setProgressLoading]);

        return (
            <div className="h-fit w-full bg-white dark:bg-neutral-900">
                <div
                    className={`flex flex-wrap justify-center gap-[1.3rem] bg-white p-2 dark:bg-neutral-900 md:p-6 ${loading ? "hidden" : ""}`}
                >
                    {Object.keys(badges).map((key, index) => {
                        const badge = badges[key];
                        const badgeName = key;
                        return (
                            <Badge
                                key={`${badgeName}-${index}`}
                                badge={badge}
                                domain={domain}
                                badgeName={badgeName}
                            />
                        );
                    })}
                </div>
            </div>
        );
    },
);

Badges.displayName = "Badges"; // Add display name to the component

export { Badges };
