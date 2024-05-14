import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import { motion } from "framer-motion";
import "react-loading-skeleton/dist/skeleton.css";

interface BadgeProps {
    badge: { light: string; dark: string };
    domain: string;
    badgeName: string;
    setLoadingImageCount: React.Dispatch<React.SetStateAction<number>>;
}

export function Badge({
    badge,
    domain,
    badgeName,
    setLoadingImageCount,
}: BadgeProps) {
    const [lightBadgeLoaded, setlightBadgeLoaded] = useState(false);
    const [darkBadgeLoaded, setDarkBadgeLoaded] = useState(false);
    useEffect(() => {
        const lightBadge = new Image();
        const darkBadge = new Image();
        lightBadge.src = domain + badge.light;
        darkBadge.src = domain + badge.dark;
        lightBadge.onload = () => {
            setlightBadgeLoaded(true);
            setLoadingImageCount((prev) => prev + 1);
        };
        darkBadge.onload = () => {
            setDarkBadgeLoaded(true);
            setLoadingImageCount((prev) => prev + 1);
        };
    }, [badge, domain, setLoadingImageCount]);

    let badgeWidth = 0;
    if (badgeName) {
        badgeWidth =
            badgeName.split(" ")[0].length * 10 +
            badgeName.split(" ")[0].length * 0.4 +
            52;
    } else {
        badgeWidth = 100;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            // viewport={{ once: true }}
            transition={{
                duration: 0.4,
                // delay: 0.2,
            }}
        >
            {lightBadgeLoaded && darkBadgeLoaded ? (
                <>
                    <img
                        src={domain + badge.light}
                        alt={badgeName}
                        title={badgeName}
                        loading="lazy"
                        className="badge-image block cursor-pointer transition-transform duration-300 hover:scale-115 dark:hidden"
                        onClick={() => {
                            navigator.clipboard.writeText(domain + badge.light);
                            toast.success(`Copied badge to clipboard!`);
                        }}
                    />
                    {badge.dark && (
                        <img
                            src={domain + badge.dark}
                            alt={badgeName}
                            title={badgeName}
                            loading="lazy"
                            className="badge-image hidden cursor-pointer transition-transform duration-300 hover:scale-115 dark:block"
                            onClick={() => {
                                navigator.clipboard.writeText(
                                    domain + badge.dark,
                                );
                                toast.success(`Copied badge to clipboard!`);
                            }}
                        />
                    )}
                </>
            ) : (
                <>
                    <div className="-mt-1 dark:hidden">
                        <Skeleton
                            width={badgeWidth}
                            height={40}
                            baseColor="rgb(229 229 229)"
                            highlightColor="rgb(245 245 245)"
                        />
                    </div>
                    <div className="hidden dark:block">
                        <Skeleton
                            width={badgeWidth}
                            height={40}
                            baseColor="rgb(38 38 38)"
                            highlightColor="rgb(64 64 64)"
                        />
                    </div>
                </>
            )}
        </motion.div>
    );
}
