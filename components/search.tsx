"use client";

import { useState, useEffect, useRef } from "react";
import { Badges } from "@/components/badges";
import { SearchIcon, Command, X } from "lucide-react";

interface SearchProps {
    badgeCount: number;
    badges: Record<string, { light: string; dark: string }>;
    domain: string;
}

export function Search({ badgeCount, badges, domain }: SearchProps) {
    const [inputValue, setInputValue] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

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
            : badges;

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

    return (
        <>
            <div className="relative w-full px-6 py-2 text-[16px]">
                <div className="absolute inset-y-0 left-6 flex items-center pl-3 text-neutral-500">
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
                    <div className="absolute inset-y-0 right-6 flex items-center pr-4 text-neutral-500">
                        <div className="pointer-events-none flex h-full items-center gap-x-1 font-mono">
                            <Command size={16} />
                            <span>K</span>
                        </div>
                    </div>
                )}
            </div>
            <Badges badges={filteredBadges} domain={domain}></Badges>
        </>
    );
}
