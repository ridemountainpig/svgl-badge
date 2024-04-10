"use client";

import toast from "react-hot-toast";

interface BadgesProps {
    badges: Record<string, { light: string; dark: string }>;
}

export function Badges({ badges }: BadgesProps) {
    return (
        <div className="flex flex-wrap justify-center gap-[1.3rem] p-6">
            {Object.keys(badges).map((key) => {
                const badge = badges[key];
                return (
                    <>
                        <img
                            key={key}
                            src={badge.light}
                            alt={key}
                            className="block cursor-pointer transition-transform duration-300 hover:scale-115 dark:hidden"
                            onClick={() => {
                                navigator.clipboard.writeText(badge.light);
                                toast.success(`Copied badge to clipboard!`);
                            }}
                        />
                        {badge.dark && (
                            <img
                                key={`${key}-dark`}
                                src={badge.dark}
                                alt={`${key}-dark`}
                                className="hidden cursor-pointer transition-transform duration-300 hover:scale-115 dark:block"
                                onClick={() => {
                                    navigator.clipboard.writeText(badge.dark);
                                    toast.success(`Copied badge to clipboard!`);
                                }}
                            />
                        )}
                    </>
                );
            })}
        </div>
    );
}
