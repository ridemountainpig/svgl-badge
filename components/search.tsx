"use client";

import { useState, useEffect, useRef } from "react";
import { Badges } from "@/components/badges";
import { SearchIcon, Command, X, ArrowDown } from "lucide-react";

interface SearchProps {
    badgeCount: number;
    badges: Record<string, { light: string; dark: string }>;
    domain: string;
}

export function Search({ badgeCount, badges, domain }: SearchProps) {
    const [inputValue, setInputValue] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const [badgeLimit, setBadgeLimit] = useState(150);
    const [loadMoreBtn, setLoadMoreBtn] = useState(false);

    const filteredBadges =
        inputValue !== ""
            ? Object.keys(badges)
                  .filter((key) =>
                      key.toLowerCase().includes(inputValue.toLowerCase()),
                  )
                  .reduce(
                      (acc, key) => {
                          acc[key] = badges[key];
                          return acc;
                      },
                      {} as Record<string, { light: string; dark: string }>,
                  )
            : Object.keys(badges).length < badgeLimit
              ? badges
              : Object.fromEntries(Object.entries(badges).slice(0, badgeLimit));

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            // Check if Command + K or Ctrl + K was pressed
            if ((event.metaKey || event.ctrlKey) && event.key === "k") {
                event.preventDefault(); // Prevent the default action to avoid conflicts
                if (inputRef.current) {
                    inputRef.current.focus(); // Focus the input element
                }
            }
        }

        // Add event listener to the window object
        window.addEventListener("keydown", handleKeyDown);

        // Cleanup function to remove the event listener
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    useEffect(() => {
        if (inputValue != "") {
            setBadgeLimit(badgeCount);
            setLoadMoreBtn(false);
        }
    }, [inputValue, badgeCount]);

    return (
        <>
            <div className="relative w-full px-4 py-2 text-[16px] md:px-6">
                <div className="absolute inset-y-0 left-4 flex items-center pl-3 text-neutral-500 md:left-6">
                    <div className="pointer-events-none">
                        <SearchIcon size={20} strokeWidth={2.5} />
                    </div>
                </div>
                <input
                    type="text"
                    value={inputValue}
                    ref={inputRef}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                    }}
                    placeholder={`Search ${badgeCount} badges...`}
                    className="w-full rounded-md border-b border-neutral-300 bg-white p-3 px-11 placeholder-neutral-500 outline-none ring-1 ring-neutral-300 dark:border-neutral-800 dark:bg-neutral-900 dark:ring-neutral-700"
                />
                {inputValue ? (
                    <div className="absolute inset-y-0 right-6 flex items-center pr-3">
                        <button
                            type="button"
                            className="rounded-md focus:outline-none focus:ring-1 focus:ring-neutral-300"
                            onClick={() => setInputValue("")}
                        >
                            <X size={18} />
                        </button>
                    </div>
                ) : (
                    <div className="absolute inset-y-0 right-4 flex items-center pr-4 text-neutral-500 md:right-6">
                        <div className="pointer-events-none flex h-full items-center gap-x-1 font-mono">
                            <Command size={16} />
                            <span>K</span>
                        </div>
                    </div>
                )}
            </div>
            <Badges
                badges={filteredBadges}
                domain={domain}
                setLoadMoreBtn={setLoadMoreBtn}
            ></Badges>
            {loadMoreBtn && Object.keys(badges).length > badgeLimit && (
                <div className="flex items-center justify-center bg-white pb-4 pt-2 dark:bg-neutral-900 md:pt-0">
                    <button
                        className="flex h-10 items-center space-x-2 rounded-full border border-neutral-200 bg-transparent px-4 text-neutral-950 transition-colors duration-100 hover:bg-neutral-200/50 focus:outline-none focus:ring-1 focus:ring-neutral-300 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:text-white dark:hover:bg-neutral-800/50 dark:focus:ring-neutral-700"
                        onClick={() => {
                            setLoadMoreBtn(false);
                            setBadgeLimit(badgeCount);
                        }}
                    >
                        <div className="flex items-center space-x-2">
                            <ArrowDown size={16} />{" "}
                            <span>Load All SVG Badges</span>{" "}
                            <span className="opacity-70">
                                ({badgeCount} more)
                            </span>
                        </div>
                    </button>
                </div>
            )}
        </>
    );
}
