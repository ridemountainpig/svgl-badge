import { motion } from "framer-motion";

export function Loading() {
    return (
        <div className="flex w-fit items-center justify-center">
            <div className="h-fit w-full select-none">
                <div className="flex items-center justify-center">
                    <img
                        className="dark:hidden"
                        src="/svgl-loading-light.svg"
                        alt="Svgl Logo"
                        width={260}
                        height={260}
                    />
                    <img
                        className="hidden dark:block"
                        src="/svgl-loading-dark.svg"
                        alt="Svgl Logo"
                        width={260}
                        height={260}
                    />
                </div>
                <div className="mt-4 w-full">
                    <div className="h-2 w-full rounded-full bg-neutral-800/50 dark:bg-neutral-200/50"></div>
                    <motion.div
                        className="-mt-2 h-2 rounded-full bg-neutral-800 dark:bg-neutral-200"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1.8, ease: "easeInOut" }}
                    ></motion.div>
                </div>
            </div>
        </div>
    );
}
