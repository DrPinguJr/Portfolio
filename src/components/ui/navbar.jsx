import * as React from "react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full">
            <div className="relative h-16 sm:h-20 w-full overflow-hidden border-b border-white/10">
                {/* Background image */}
                <img
                    src={`${import.meta.env.BASE_URL}images/Galaxy_nav.jpg`}
                    alt="Galaxy background"
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full object-cover contrast-[2.4] brightness-[0.65]"
                />

                {/* Dark overlay for readability */}
                <div className="absolute inset-0 bg-black/55" />

                {/* Inner content */}
                <div className="relative mx-auto flex h-full max-w-6xl items-center justify-between px-4">
                    {/* Left links */}
                    <nav className="flex items-center gap-1 sm:gap-3">
                        <Button
                            variant="ghost"
                            className="text-white/90 hover:text-white hover:bg-white/10"
                            asChild
                        >
                            <Link to="/">Home</Link>
                        </Button>
                    </nav>

                    {/* Center title */}
                    <div className="select-none text-white drop-shadow-sm">
                        <span className="font-didot text-xl sm:text-3xl tracking-[0.35em]">
                            LANCE
                        </span>
                    </div>

                    {/* Right link */}
                    <nav className="flex items-center">
                        <Button
                            variant="ghost"
                            className="text-white/90 hover:text-white hover:bg-white/10"
                            asChild
                        >
                            {/* If your About is on Home page as an anchor, this is simplest */}
                            <a href={`${import.meta.env.BASE_URL}#about`}>About Me</a>
                        </Button>
                    </nav>
                </div>
            </div>
        </header>
    )
}
