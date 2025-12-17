// src/pages/Aboutme.jsx
import React, { useMemo, useState } from "react"
import { Sparkles, Compass, Wrench } from "lucide-react"
import ParticlesBackground from "@/components/backgrounds/ParticlesBackground"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import MeImg from "@/assets/images/CARTOON_ME.png"

const STARS = [
    {
        id: "northstar",
        label: "North Star",
        type: "core",
        x: 52,
        y: 42,
        desc: "I build practical products that feel good to use — where clean logic and clear people-skills meet.",
        evidence: ["Portfolio projects", "Internship systems", "School builds"],
    },

    { id: "react", label: "React", type: "hard", x: 28, y: 28, desc: "Component-driven UI, routing, reusable layouts, and polished interactions.", evidence: ["Portfolio website", "Project pages", "UI components"] },
    { id: "flutter", label: "Flutter", type: "hard", x: 22, y: 62, desc: "Mobile UI, stateful screens, assets, and clean layout structure.", evidence: ["Calculator app", "Profile screen improvements"] },
    { id: "csharp", label: "C# / ASP.NET", type: "hard", x: 76, y: 30, desc: "MVC patterns, controllers, views, AJAX updates, and workflow features.", evidence: ["OrderChecker", "CheckList features"] },
    { id: "sql", label: "SQL", type: "hard", x: 84, y: 52, desc: "Stored procedures, filtering logic, performance tuning, reliable data flows.", evidence: ["LiveView SPs", "Report queries", "Business rules"] },
    { id: "python", label: "Python", type: "hard", x: 66, y: 70, desc: "Automation pipelines, data processing, Excel outputs, and workflow speedups.", evidence: ["Processing scripts", "Data summaries", "Tooling helpers"] },

    { id: "communication", label: "Communication", type: "soft", x: 42, y: 16, desc: "I translate messy requirements into clear steps and keep people aligned.", evidence: ["Clarifying rules", "Explaining fixes", "Writing notes"] },
    { id: "ownership", label: "Ownership", type: "soft", x: 12, y: 42, desc: "I follow bugs to the root cause, not just the symptoms.", evidence: ["Fixing bottlenecks", "Stabilising flows", "Edge-case handling"] },
    { id: "perseverance", label: "Perseverance", type: "soft", x: 50, y: 84, desc: "I keep going until it works — then I make it clean.", evidence: ["Debug sessions", "UI refinements", "Iterative improvements"] },
    { id: "teamwork", label: "Teamwork", type: "soft", x: 90, y: 18, desc: "I work smoothly with others, adapt fast, and make handovers easy.", evidence: ["Sharing progress", "Readable output", "Consistent structure"] },
]

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

const deg = (d) => (d * Math.PI) / 180

export default function Aboutme() {
    const [activeId, setActiveId] = useState("northstar")

    // ✅ YOU: centered (feel free to tweak top)
    const ME_POS = { left: "50%", top: "64%" }

    // ===== ORBIT LAYOUT KNOBS (this is the “more space” part) =====
    const ORBIT = {
        // center of the constellation in SVG coords (0..100)
        cx: 50,
        cy: 64,

        // stretch X so it uses more horizontal space on wide screens
        sx: 2.0,
        sy: 1.0,

        // radii
        rOuter: 34,
        rMid: 28,
        rInner: 22,

        // North Star fixed ABOVE you
        northStar: { x: 52, y: 49 },
    }

    // Each star gets an angle + radius (bigger radius = more spread)
    // Angles: 0° right, 90° down, 180° left, 270° up
    const ORBIT_POS = {
        communication: { a: 285, r: ORBIT.rOuter }, // top
        teamwork: { a: 330, r: ORBIT.rOuter }, // top-right (away from panel a bit)
        csharp: { a: 25, r: ORBIT.rMid }, // right-upper
        sql: { a: 70, r: ORBIT.rMid }, // right
        python: { a: 105, r: ORBIT.rOuter }, // bottom-right
        perseverance: { a: 125, r: ORBIT.rInner }, // bottom
        flutter: { a: 150, r: ORBIT.rMid }, // bottom-left
        ownership: { a: 190, r: ORBIT.rMid }, // left
        react: { a: 235, r: ORBIT.rMid }, // left-upper
    }

    const stars = useMemo(() => {
        return STARS.map((s) => {
            if (s.id === "northstar") {
                return { ...s, x: ORBIT.northStar.x, y: ORBIT.northStar.y }
            }

            const p = ORBIT_POS[s.id]
            if (!p) return s

            const x = ORBIT.cx + Math.cos(deg(p.a)) * p.r * ORBIT.sx
            const y = ORBIT.cy + Math.sin(deg(p.a)) * p.r * ORBIT.sy

            return { ...s, x, y }
        })
    }, [])

    const byId = useMemo(() => {
        const m = new Map()
        for (const s of stars) m.set(s.id, s)
        return m
    }, [stars])

    const active = byId.get(activeId) || byId.get("northstar")

    return (
        <div className="relative h-[calc(100vh-80px)] w-full overflow-hidden">
            <ParticlesBackground fullScreen zIndex={0} particleCount={220} speed={0.12} />

            {/* Heading */}
            <div className="absolute left-0 top-0 w-full z-40 pointer-events-none">
                <div className="mx-auto max-w-6xl px-6 pt-14">
                    <div className="inline-block rounded-2xl bg-black/35 backdrop-blur-md border border-white/10 px-6 py-5">
                        <h1 className="pointer-events-auto text-4xl sm:text-5xl font-semibold">About Me</h1>
                        <p className="pointer-events-auto mt-3 text-white/70 max-w-2xl">
                            My skills aren’t separate dots — they connect like constellations. Soft skills guide the direction,
                            hard skills build the ship, and together they create something beautiful and useful.
                        </p>
                    </div>
                </div>
            </div>

            {/* Constellation */}
            <div className="absolute inset-0 z-20">
                <svg viewBox="0 0 100 100" className="h-full w-full" role="img" aria-label="Constellation map">
                    <defs>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="0.9" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        {/* Hide lines behind the astronaut (now perfectly aligned because we removed transforms) */}
                        <mask id="avoidBodyMask" maskUnits="userSpaceOnUse">
                            <rect x="0" y="0" width="100" height="100" fill="white" />
                            <circle cx={ORBIT.cx} cy={ORBIT.cy} r="14" fill="black" />
                        </mask>
                    </defs>

                    {/* Links */}
                    <g mask="url(#avoidBodyMask)">
                        {LINKS.map(([a, b]) => {
                            const A = byId.get(a)
                            const B = byId.get(b)
                            if (!A || !B) return null
                            const isHot = activeId === a || activeId === b

                            return (
                                <line
                                    key={`${a}-${b}`}
                                    x1={A.x}
                                    y1={A.y}
                                    x2={B.x}
                                    y2={B.y}
                                    stroke="rgba(255,255,255,1)"
                                    strokeWidth={0.22}
                                    style={{ opacity: isHot ? 0.9 : 0.26, transition: "opacity 220ms ease" }}
                                />
                            )
                        })}
                    </g>

                    {/* Stars */}
                    {stars.map((s) => {
                        const isActive = s.id === activeId
                        const isCore = s.type === "core"

                        return (
                            <g
                                key={s.id}
                                onMouseEnter={() => setActiveId(s.id)}
                                onClick={() => setActiveId(s.id)}
                                style={{ cursor: "pointer" }}
                            >
                                <circle
                                    cx={s.x}
                                    cy={s.y}
                                    r={isCore ? 2.8 : 1.95}
                                    fill="rgba(255,255,255,1)"
                                    filter="url(#glow)"
                                    style={{
                                        opacity: isActive ? 1 : 0.72,
                                        transformOrigin: `${s.x}px ${s.y}px`,
                                        transform: isActive ? "scale(1.12)" : "scale(1)",
                                        transition: "opacity 220ms ease, transform 220ms ease",
                                    }}
                                />
                                <circle
                                    cx={s.x}
                                    cy={s.y}
                                    r={isCore ? 4.6 : 3.3}
                                    fill="transparent"
                                    stroke="rgba(255,255,255,0.16)"
                                    strokeWidth={0.32}
                                />
                                <text x={s.x + 2.2} y={s.y - 2.2} fontSize="2.6" fill="rgba(255,255,255,0.68)">
                                    {s.label}
                                </text>
                            </g>
                        )
                    })}
                </svg>
            </div>

            {/* You (behind constellation, so lines stay visible) */}
            <div className="absolute z-10" style={{ left: ME_POS.left, top: ME_POS.top, transform: "translate(-50%, -50%)" }}>
                <div className="relative">
                    <div className="absolute inset-0 -z-10 rounded-full blur-2xl bg-white/10" />
                    <img
                        src={MeImg}
                        alt="Lance"
                        className="h-[440px] sm:h-[600px] w-auto drop-shadow-[0_18px_40px_rgba(0,0,0,0.65)]"
                        style={{ pointerEvents: "none" }}
                    />
                </div>
            </div>

            {/* Info panel (unchanged) */}
            <div className="absolute z-30 right-4 sm:right-8 top-[22%] sm:top-[24%] w-[320px] sm:w-[360px]">
                <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md p-5">
                    <div className="text-white font-semibold text-lg">{active?.label}</div>

                    <div className="mt-2 flex items-center gap-2 text-white/70 text-sm">
                        {typeMeta(active?.type).icon}
                        <span>{typeMeta(active?.type).label}</span>
                        <Badge variant="outline" className="border-white/15 text-white/80">
                            {active?.type === "core" ? "Anchor" : "Connected"}
                        </Badge>
                    </div>

                    <p className="mt-3 text-white/70 leading-relaxed">{active?.desc}</p>

                    <div className="mt-4">
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
                        className="mt-5 w-full border-white/15 bg-black/40 text-white hover:bg-white/10"
                        onClick={() => setActiveId("northstar")}
                    >
                        Re-center on North Star
                    </Button>
                </div>
            </div>
        </div>
    )
}
