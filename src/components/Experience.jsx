import * as React from "react"
import ExperiencePlanet from "@/components/ExperiencePlanet"
import { cn } from "@/lib/utils"

// ✅ Edit this freely (add/remove jobs)
export const EXPERIENCE = [
    {
        id: "seagate",
        company: "Seagate (Projects / Learning)",
        role: "SeagateLance — Builder",
        timeline: "Ongoing",
        skills: ["React", "Vite", "Three.js", "UI Polish"],
        highlights: [
            "Built a portfolio with routing + embedded code viewer",
            "Improved component structure and visual polish",
            "Explored interactive 3D storytelling for experience",
        ],

        // ✅ Solar-system controls
        label: "Seagate",
        orbitRadius: 3.2,  // farther = requires zoom out
        planetSize: 0.22,
        orbitSpeed: 0.22,
        orbitTilt: 12,     // degrees (optional)
        startAngle: 40,    // degrees
        planetColor: "#b7d4ff",
    },

    {
        id: "portfolio",
        company: "Portfolio",
        role: "Frontend / UI Builder",
        timeline: "2025 – Present",
        skills: ["React Router", "Shadcn UI", "UX polish"],
        highlights: [
            "Built project routing and page layouts",
            "Created reusable UI components",
            "Designed interactive sections for storytelling",
        ],

        label: "Portfolio",
        orbitRadius: 2.4,
        planetSize: 0.18,
        orbitSpeed: 0.32,
        orbitTilt: -8,
        startAngle: 160,
        planetColor: "#ffd6a6",
    },

    // add more planets as you go...
]


function ExperienceDetails({ item, onClose }) {
    if (!item) return null

    return (
        <div className="mx-auto mt-10 max-w-3xl rounded-2xl bg-black/40 p-6 backdrop-blur">
            <div className="text-lg sm:text-xl font-semibold">
                {item.role} — {item.company}
            </div>
            <div className="mt-1 text-sm text-white/60">{item.timeline}</div>

            <div className="mt-5">
                <div className="text-sm font-semibold text-white/80">Skills gained</div>
                <div className="mt-2 flex flex-wrap gap-2">
                    {item.skills?.map((s) => (
                        <span
                            key={s}
                            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80"
                        >
                            {s}
                        </span>
                    ))}
                </div>
            </div>

            <div className="mt-5">
                <div className="text-sm font-semibold text-white/80">Highlights</div>
                <ul className="mt-2 space-y-2 text-sm text-white/70">
                    {item.highlights?.map((h, idx) => (
                        <li key={idx}>• {h}</li>
                    ))}
                </ul>
            </div>

            <div className="mt-5">
                <button
                    type="button"
                    onClick={onClose}
                    className="text-xs text-white/60 hover:text-white/90"
                >
                    close
                </button>
            </div>
        </div>
    )
}

export default function Experience() {
    const [selectedId, setSelectedId] = React.useState(null)

    const selected = React.useMemo(() => {
        if (!selectedId) return null
        return EXPERIENCE.find((x) => x.id === selectedId) || null
    }, [selectedId])

    return (
        <section className="relative z-10 mx-auto w-full max-w-7xl px-6 py-20">
            <div className="mb-10 text-center">
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Work Experience</h2>
                <p className="mt-2 text-white/60 text-sm sm:text-base">
                    Click a planet to reveal details. Click empty space to close.
                </p>
            </div>

            {/* ✅ Sun + right-side panel */}
            <div className="grid items-center gap-10 lg:grid-cols-[1fr_420px]">
                {/* Big planet area */}
                <div className="min-h-[720px] sm:min-h-[900px]">
                    <ExperiencePlanet
                        items={EXPERIENCE}
                        selectedId={selectedId}
                        onSelect={(id) => setSelectedId(id)}
                        onDeselect={() => setSelectedId(null)}
                    />
                </div>

                {/* Right panel (shows only when selected) */}
                <div className="lg:sticky lg:top-24">
                    {selected ? (
                        <ExperienceDetails item={selected} onClose={() => setSelectedId(null)} />
                    ) : (
                        <div className="rounded-2xl bg-black/30 p-6 backdrop-blur">
                            <div className="text-lg font-semibold text-white/90">Select a planet</div>
                            <div className="mt-2 text-sm text-white/60">
                                Drag around the Sun to explore the solar system :D
                            </div>
                            <div className="mt-2 text-sm text-white/60">
                                Each planet represents one experience. Click one to view role, timeline, and skills.
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}
