"use client";

import React from "react";
import Image from "next/image";
import toast from "react-hot-toast";

interface BadgesProps {
    badges: Record<string, { light: string; dark: string }>;
}

export function Badges({ badges }: BadgesProps) {
    return (
        <div className="flex flex-wrap justify-center gap-[1.3rem] p-6">
            {Object.keys(badges).map((key, index) => {
                const badge = badges[key];
                const svgWidth = key.length * 10 + key.length * 0.4 + 52;
                return (
                    <React.Fragment key={index}>
                        <Image
                            src={badge.light}
                            alt={key}
                            width={svgWidth}
                            height={40}
                            className="block cursor-pointer transition-transform duration-300 hover:scale-115 dark:hidden"
                            onClick={() => {
                                navigator.clipboard.writeText(badge.light);
                                toast.success(`Copied badge to clipboard!`);
                            }}
                        />
                        {badge.dark && (
                            <Image
                                src={badge.dark}
                                alt={`${key}-dark`}
                                width={svgWidth}
                                height={40}
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
