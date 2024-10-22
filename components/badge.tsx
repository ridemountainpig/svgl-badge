import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

interface BadgeProps {
    badge: { light: string; dark: string; lightSvg: string; darkSvg: string };
    domain: string;
    badgeName: string;
}

export function Badge({ badge, domain, badgeName }: BadgeProps) {
    const { theme } = useTheme();
    const wordmark = badge.light.includes("wordmark=true") ? true : false;

    const badgeNameSplit = badgeName
        .split(" ")
        .slice(0, -1)
        .join(" ")
        .toUpperCase();
    let badgeWidth = 0;
    if (badgeName) {
        badgeWidth =
            badgeName.split(" ").slice(0, -1).join(" ").length * 10 +
            badgeName.split(" ").slice(0, -1).join(" ").length * 0.4 +
            52;
    } else {
        badgeWidth = 100;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.4,
            }}
        >
            <div
                style={{
                    height: "40px",
                    width: `${wordmark ? "fit" : badgeWidth + "px"}`,
                }}
                className="cursor-pointer select-none transition-transform duration-300 hover:scale-115"
                onClick={() => {
                    if (theme == "dark") {
                        navigator.clipboard.writeText(domain + badge.dark);
                    } else {
                        navigator.clipboard.writeText(domain + badge.light);
                    }
                    toast.success(`Copied badge to clipboard!`);
                }}
            >
                <div className="flex h-full w-full items-center justify-center gap-x-2 rounded-md border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
                    {wordmark ? (
                        <div className="flex w-[92%] items-center justify-center px-[0.55rem]">
                            <img
                                src={`/static/library/${badge.lightSvg}`}
                                alt={badgeNameSplit + " Wordmark Badge"}
                                className="h-[30px] dark:hidden"
                                loading="lazy"
                            />
                            <img
                                src={`/static/library/${badge.darkSvg}`}
                                alt={badgeNameSplit + " Wordmark Badge"}
                                className="hidden h-[30px] dark:block"
                                loading="lazy"
                            />
                        </div>
                    ) : (
                        <>
                            <div className="pl-2">
                                <img
                                    src={`/static/library/${badge.lightSvg}`}
                                    alt={badgeNameSplit + " Badge"}
                                    className="h-7 w-7 dark:hidden"
                                    loading="lazy"
                                />
                                <img
                                    src={`/static/library/${badge.darkSvg}`}
                                    alt={badgeNameSplit + " Badge"}
                                    className="hidden h-7 w-7 dark:block"
                                    loading="lazy"
                                />
                            </div>
                            <div className="pr-2">
                                <span className="truncate text-center font-sans text-[15px] font-semibold tracking-wide text-black dark:text-white">
                                    {badgeNameSplit}
                                </span>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
