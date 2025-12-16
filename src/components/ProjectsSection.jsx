import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Link } from "react-router-dom"

const FILTERS = ["All", "Website", "App"]

// ✅ Add optional "picture" field for cover images (use later)
const PROJECTS = [
    {
        id: "arc",
        title: "ARC",
        type: "Website",
        to: "/projects/arc",
        picture: "", // e.g. "/images/projects/arc-cover.jpg"
    },
    {
        id: "pocket",
        title: "Pocket",
        type: "App",
        to: "/projects/pocket",
        picture: "", // e.g. "/images/projects/pocket-cover.jpg"
    },
]

function ProjectCard({ title, to, picture }) {
    return (
        <Link
            to={to}
            className={cn(
                "group relative overflow-hidden rounded-2xl border border-white/10",
                "bg-white/5 backdrop-blur",
                "min-h-[200px] md:min-h-[240px]",
                "transition-transform duration-300 hover:-translate-y-1"
            )}
        >
            {/* ✅ Cover image if provided, fallback gradient if not */}
            {picture ? (
                <img
                    src={picture}
                    alt={`${title} cover`}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                />
            ) : (
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
            )}

            {/* Dark overlay for readability */}
            <div className="absolute inset-0 bg-black/25 transition-colors duration-300 group-hover:bg-black/60" />

            {/* Title reveal */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="rounded-full border border-white/15 bg-black/50 px-5 py-2 text-sm tracking-wide text-white">
                        {title}
                    </div>
                </div>
            </div>

            {/* Corner label */}
            <div className="relative z-10 p-5 text-white/80">
                <div className="text-xs uppercase tracking-widest opacity-70">Project</div>
            </div>
        </Link>
    )
}

export default function ProjectsSection() {
    const [active, setActive] = React.useState("All")

    const filtered = React.useMemo(() => {
        if (active === "All") return PROJECTS
        return PROJECTS.filter((p) => p.type === active)
    }, [active])

    return (
        <section id="projects" className="relative z-10 mx-auto max-w-6xl px-6 py-12">
            <div className="rounded-2xl border border-white/10 bg-black/40 p-8 backdrop-blur">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold">Projects</h2>
                        <p className="mt-1 text-white/70">
                            Filter by type. Click a card to open the project page.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {FILTERS.map((f) => {
                            const isActive = active === f
                            return (
                                <Button
                                    key={f}
                                    type="button"
                                    variant={isActive ? "secondary" : "ghost"}
                                    onClick={() => setActive(f)}
                                    className={cn(
                                        "h-9 rounded-full",
                                        isActive
                                            ? "bg-white/15 text-white hover:bg-white/20"
                                            : "text-white/80 hover:text-white hover:bg-white/10"
                                    )}
                                >
                                    {f}
                                </Button>
                            )
                        })}
                    </div>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((p) => (
                        <ProjectCard
                            key={p.id}
                            title={p.title}
                            to={p.to}
                            picture={p.picture}
                        />
                    ))}

                    {filtered.length === 0 && (
                        <div className="col-span-full rounded-xl border border-white/10 bg-white/5 p-6 text-white/70">
                            No projects in this category yet.
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}
