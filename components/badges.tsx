"use client";

import React from "react";
import toast from "react-hot-toast";

interface BadgesProps {
    badges: Record<string, { light: string; dark: string }>;
}

export function Badges({ badges }: BadgesProps) {
    return (
        <div className="flex flex-wrap justify-center gap-[1.3rem] p-6">
            {Object.keys(badges).map((key, index) => {
                const badge = badges[key];
                return (
                    <React.Fragment key={index}>
                        <img
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
                                src={badge.dark}
                                alt={`${key}-dark`}
                                className="hidden cursor-pointer transition-transform duration-300 hover:scale-115 dark:block"
                                onClick={() => {
                                    navigator.clipboard.writeText(badge.dark);
                                    toast.success(`Copied badge to clipboard!`);
                                }}
                            />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}
