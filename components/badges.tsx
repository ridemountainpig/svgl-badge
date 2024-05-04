import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Loading } from "@/components/loading";

interface BadgesProps {
    badges: Record<string, { light: string; dark: string }>;
    domain: string;
}

const Badges = React.memo(({ badges, domain }: BadgesProps) => {
    const [loading, setLoading] = useState(true); // State to track loading status
    const [loadingImageCount, setLoadingImageCount] = useState(0); // State to track loading count

    useEffect(() => {
        const images: NodeListOf<HTMLImageElement> =
            document.querySelectorAll(".badge-image");

        const handleImageLoad = () => {
            setLoadingImageCount((prev) => prev + 1);
        };

        images.forEach((image: HTMLImageElement) => {
            if (image.complete) {
                setLoadingImageCount((prev) => prev + 1);
            } else {
                image.addEventListener("load", handleImageLoad);
            }
        });

        return () => {
            images.forEach((image) => {
                image.removeEventListener("load", handleImageLoad);
            });
        };
    }, []);

    useEffect(() => {
        if (loadingImageCount >= Object.keys(badges).length * 2) {
            setLoading(false);
        }
    }, [loadingImageCount, badges]);

    return (
        <>
            <div
                className={`flex h-[75%] w-full items-center justify-center ${loading ? "" : "hidden"}`}
            >
                <Loading />
            </div>
            <div className="h-[75%] w-full bg-white dark:bg-neutral-900">
                <div
                    className={`flex flex-wrap justify-center gap-[1.3rem] bg-white  p-6 dark:bg-neutral-900 ${loading ? "hidden" : ""}`}
                >
                    {Object.keys(badges).map((key) => {
                        const badge = badges[key];
                        return (
                            <motion.div
                                key={key} // Use key as the badge key to ensure proper tracking and prevent re-creation
                                initial={{ opacity: 0, y: 0 }}
                                animate={{ opacity: 1, y: 0 }}
                                // viewport={{ once: true }}
                                transition={{
                                    duration: 0.4,
                                    // delay: 0.2,
                                }}
                            >
                                <img
                                    src={domain + badge.light}
                                    alt={key}
                                    title={key}
                                    className="badge-image block cursor-pointer transition-transform duration-300 hover:scale-115 dark:hidden"
                                    onClick={() => {
                                        navigator.clipboard.writeText(
                                            domain + badge.light,
                                        );
                                        toast.success(
                                            `Copied badge to clipboard!`,
                                        );
                                    }}
                                />
                                {badge.dark && (
                                    <img
                                        src={domain + badge.dark}
                                        alt={`${key}-dark`}
                                        title={key}
                                        className="badge-image hidden cursor-pointer transition-transform duration-300 hover:scale-115 dark:block"
                                        onClick={() => {
                                            navigator.clipboard.writeText(
                                                domain + badge.dark,
                                            );
                                            toast.success(
                                                `Copied badge to clipboard!`,
                                            );
                                        }}
                                    />
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </>
    );
});

Badges.displayName = "Badges"; // Add display name to the component

export { Badges };
