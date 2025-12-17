// src/components/sections/AboutConstellation.jsx
import React, { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Sparkles, Compass, Wrench } from "lucide-react"

// ✅ Edit these to match YOUR story
const STARS = [
    {
        id: "northstar",
        label: "North Star",
        type: "core",
        x: 52,
        y: 38,
        desc:
            "I build practical products that feel good to use — where clean logic and clear people-skills meet.",
        evidence: ["Portfolio projects", "Internship systems", "School builds"],
    },

    // Hard skills
    {
        id: "react",
        label: "React",
        type: "hard",
        x: 28,
        y: 28,
        desc: "Component-driven UI, routing, reusable layouts, and polished interactions.",
        evidence: ["Portfolio website", "Project pages", "UI components"],
    },
    {
        id: "flutter",
        label: "Flutter",
        type: "hard",
        x: 22,
        y: 60,
        desc: "Mobile UI, stateful screens, assets, and clean layout structure.",
        evidence: ["Calculator app", "Profile screen improvements"],
    },
    {
        id: "csharp",
        label: "C# / ASP.NET",
        type: "hard",
        x: 78,
        y: 28,
        desc: "MVC patterns, controllers, views, AJAX updates, and workflow features.",
        evidence: ["OrderChecker", "CheckList features"],
    },
    {
        id: "sql",
        label: "SQL",
        type: "hard",
        x: 84,
        y: 52,
        desc: "Stored procedures, filtering logic, performance tuning, reliable data flows.",
        evidence: ["LiveView SPs", "Report queries", "Business rules"],
    },
    {
        id: "python",
        label: "Python",
        type: "hard",
        x: 66,
        y: 66,
        desc: "Automation pipelines, data processing, Excel outputs, and workflow speedups.",
        evidence: ["Processing scripts", "Data summaries", "Tooling helpers"],
    },

    // Soft skills
    {
        id: "communication",
        label: "Communication",
        type: "soft",
        x: 42,
        y: 14,
        desc: "I translate messy requirements into clear steps and keep people aligned.",
        evidence: ["Clarifying rules", "Explaining fixes", "Writing reflections/notes"],
    },
    {
        id: "ownership",
        label: "Ownership",
        type: "soft",
        x: 12,
        y: 40,
        desc: "I follow bugs to the root cause, not just the symptoms.",
        evidence: ["Fixing bottlenecks", "Stabilising flows", "Edge-case handling"],
    },
    {
        id: "perseverance",
        label: "Perseverance",
        type: "soft",
        x: 50,
        y: 78,
        desc: "I keep going until it works — then I make it clean.",
        evidence: ["Debug sessions", "UI refinements", "Iterative improvements"],
    },
    {
        id: "teamwork",
        label: "Teamwork",
        type: "soft",
        x: 92,
        y: 18,
        desc: "I work smoothly with others, adapt fast, and make handovers easy.",
        evidence: ["Sharing progress", "Readable output", "Consistent structure"],
    },
]

// Lines = “this is how my skills combine”
const LINKS = [
    ["react", "northstar"],
    ["flutter", "northstar"],
    ["csharp", "northstar"],
    ["sql", "northstar"],
    ["python", "northstar"],

    ["communication", "react"],
    ["communication", "csharp"],
    ["ownership", "flutter"],
    ["ownership", "sql"],
    ["perseverance", "python"],
    ["teamwork", "northstar"],
]

function typeMeta(type) {
    if (type === "hard") return { icon: <Wrench className="h-4 w-4" />, label: "Hard skill" }
    if (type === "soft") return { icon: <Compass className="h-4 w-4" />, label: "Soft skill" }
    return { icon: <Sparkles className="h-4 w-4" />, label: "Core" }
}

export default function AboutConstellation() {
    const [activeId, setActiveId] = useState("northstar")

    const byId = useMemo(() => {
        const m = new Map()
        for (const s of STARS) m.set(s.id, s)
        return m
    }, [])

    const active = byId.get(activeId) || byId.get("northstar")

    return (
        <section className="relative w-full">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="mb-6">
                    <h2 className="text-3xl sm:text-4xl font-semibold">About Me</h2>
                    <p className="mt-2 text-white/70 max-w-2xl">
                        My skills aren’t separate dots — they connect like constellations. Soft skills guide the
                        direction, hard skills build the ship, and together they create something worth using.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    {/* Constellation map */}
                    <Card className="lg:col-span-8 bg-white/5 border-white/10 backdrop-blur-md overflow-hidden">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-white flex items-center gap-2">
                                <Sparkles className="h-5 w-5" />
                                Skill Constellation
                            </CardTitle>
                            <p className="text-sm text-white/60">
                                Hover or tap a star to see how it contributes to the bigger picture.
                            </p>
                        </CardHeader>

                        <CardContent>
                            <div className="relative rounded-2xl border border-white/10 bg-black/30 overflow-hidden">
                                {/* SVG star map */}
                                <svg
                                    viewBox="0 0 100 100"
                                    className="w-full h-[340px] sm:h-[420px]"
                                    role="img"
                                    aria-label="Constellation map of skills"
                                >
                                    {/* faint grid glow */}
                                    <defs>
                                        <filter id="glow">
                                            <feGaussianBlur stdDeviation="0.8" result="coloredBlur" />
                                            <feMerge>
                                                <feMergeNode in="coloredBlur" />
                                                <feMergeNode in="SourceGraphic" />
                                            </feMerge>
                                        </filter>
                                    </defs>

                                    {/* Links */}
                                    {LINKS.map(([a, b]) => {
                                        const A = byId.get(a)
                                        const B = byId.get(b)
                                        if (!A || !B) return null
                                        const isHot = activeId === a || activeId === b
                                        return (
                                            <motion.line
                                                key={`${a}-${b}`}
                                                x1={A.x}
                                                y1={A.y}
                                                x2={B.x}
                                                y2={B.y}
                                                initial={{ pathLength: 0, opacity: 0.35 }}
                                                animate={{ pathLength: 1, opacity: isHot ? 0.85 : 0.35 }}
                                                transition={{ duration: 0.7 }}
                                                stroke="currentColor"
                                                className="text-white"
                                                strokeWidth={0.25}
                                            />
                                        )
                                    })}

                                    {/* Stars */}
                                    {STARS.map((s) => {
                                        const isActive = s.id === activeId
                                        const isCore = s.type === "core"
                                        return (
                                            <g
                                                key={s.id}
                                                onMouseEnter={() => setActiveId(s.id)}
                                                onClick={() => setActiveId(s.id)}
                                                style={{ cursor: "pointer" }}
                                            >
                                                {/* outer pulse */}
                                                <motion.circle
                                                    cx={s.x}
                                                    cy={s.y}
                                                    r={isCore ? 2.6 : 1.9}
                                                    className="text-white"
                                                    fill="currentColor"
                                                    filter="url(#glow)"
                                                    initial={{ opacity: 0.7 }}
                                                    animate={{ opacity: isActive ? 1 : 0.75, scale: isActive ? 1.1 : 1 }}
                                                    transition={{ type: "spring", stiffness: 220, damping: 18 }}
                                                />
                                                {/* tiny halo */}
                                                <circle
                                                    cx={s.x}
                                                    cy={s.y}
                                                    r={isCore ? 4.2 : 3.2}
                                                    fill="transparent"
                                                    stroke="rgba(255,255,255,0.18)"
                                                    strokeWidth={0.35}
                                                />

                                                {/* label */}
                                                <text
                                                    x={s.x + 2.2}
                                                    y={s.y - 2.2}
                                                    fontSize="3"
                                                    fill="rgba(255,255,255,0.75)"
                                                >
                                                    {s.label}
                                                </text>
                                            </g>
                                        )
                                    })}
                                </svg>

                                {/* Bottom hint */}
                                <div className="px-4 pb-4 -mt-2 text-xs text-white/50">
                                    Tip: make the links tell your story (what you combine often).
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Details card */}
                    <Card className="lg:col-span-4 bg-white/5 border-white/10 backdrop-blur-md">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-white">{active?.label}</CardTitle>
                            <div className="flex items-center gap-2 text-white/70 text-sm">
                                {typeMeta(active?.type).icon}
                                <span>{typeMeta(active?.type).label}</span>
                                {active?.type !== "core" ? (
                                    <Badge variant="outline" className="border-white/15 text-white/80">
                                        Connected
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="border-white/15 text-white/80">
                                        Anchor
                                    </Badge>
                                )}
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <p className="text-white/70 leading-relaxed">{active?.desc}</p>

                            <div>
                                <div className="text-xs uppercase tracking-wide text-white/50">Where it shows up</div>
                                <ul className="mt-2 space-y-1 text-sm text-white/75">
                                    {(active?.evidence || []).map((e) => (
                                        <li key={e} className="flex items-start gap-2">
                                            <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-white/60" />
                                            <span>{e}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <Button
                                variant="outline"
                                className="w-full border-white/15 bg-black/40 text-white hover:bg-white/10"
                                onClick={() => setActiveId("northstar")}
                            >
                                Re-center on North Star
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}
