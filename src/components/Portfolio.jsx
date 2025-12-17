// src/components/Portfolio.jsx
import * as React from "react"
import CodeViewer from "@/components/CodeViewer"
import { Button } from "@/components/ui/button"

export default function Portfolio() {
    return (
        <section className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-12">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">Code</h2>
                    <p className="mt-1 text-sm text-white/60">
                        Browsing the full GitHub repo (read-only).
                    </p>
                </div>

                <a
                    href="https://github.com/DrPinguJr/Portfolio"
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0"
                >
                    <Button
                        variant="outline"
                        className="border-white/15 bg-black/40 text-white hover:bg-white/10"
                    >
                        Open on GitHub
                    </Button>
                </a>
            </div>

            <div className="w-full">
                <CodeViewer
                    title="DrPinguJr/Portfolio"
                    github={{
                        showAll: true,
                        repo: "DrPinguJr/Portfolio",
                        prefix: "portfolio/",
                    }}
                    // lower height = more “wide rectangle” feel
                    height={420}
                />
            </div>
        </section>
    )
}
