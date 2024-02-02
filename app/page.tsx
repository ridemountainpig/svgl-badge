import Image from "next/image";

export default function Home() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-white">
            <div className="flex flex-col h-fit items-center gap-y-4">
                <Image
                    src="/svgl.svg"
                    alt="Svgl Logo"
                    width={100}
                    height={100}
                />
                <span className="text-3xl font-semibold tracking-wide">
                    Svgl Badge
                </span>
            </div>
        </main>
    );
}
