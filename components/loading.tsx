import { LoaderCircle } from "lucide-react";

export function Loading() {
    return (
        <div className="flex w-fit items-center justify-center gap-x-2 rounded-md border border-neutral-200 bg-white  dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex h-10 items-center justify-center gap-x-2 px-4">
                <LoaderCircle className="animate-spin" />
                <span className="truncate text-center font-sans text-[15px] font-semibold tracking-wider text-black dark:text-white">
                    Loading...
                </span>
            </div>
        </div>
    );
}
