// src/pages/Aboutme.jsx
import React, { useMemo, useState } from "react"
import { Sparkles, Compass, Wrench } from "lucide-react"
import ParticlesBackground from "@/components/backgrounds/ParticlesBackground"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import MeImg from "@/assets/images/CARTOON_ME.png"

const STARS = [
    // Anchor
    {
        id: "northstar",
        label: "North Star",
        type: "core",
        desc: "I connect people + tech to build clean, practical products that feel good to use.",
        evidence: ["Portfolio builds", "Internship systems", "School projects"],
    },

    // TECH
    { id: "python", label: "Python", type: "hard", desc: "Automation, scripting, and data workflows.", evidence: ["Jupyter notebooks", "Processing scripts", "Data summaries"] },
    { id: "sql", label: "SQL", type: "hard", desc: "Queries, joins, and business logic in data.", evidence: ["Stored procedures", "Reports", "Filtering rules"] },
    { id: "mysql", label: "MySQL", type: "hard", desc: "Relational DB work and schema thinking.", evidence: ["DBMS modules", "Project databases", "Query practice"] },
    { id: "csharp", label: "C#", type: "hard", desc: "Building structured apps with clean logic.", evidence: ["ASP.NET MVC", "Controllers + views", "Workflow features"] },
    { id: "js", label: "JavaScript", type: "hard", desc: "Interactive UI and web app behaviour.", evidence: ["React pages", "UI interactions", "Routing"] },
    { id: "ts", label: "TypeScript", type: "hard", desc: "Safer JS with types and better structure.", evidence: ["React components", "Reusable modules", "Cleaner codebase"] },
    { id: "htmlcss", label: "HTML/CSS", type: "hard", desc: "Layout, styling, responsiveness.", evidence: ["Portfolio UI", "Component styling", "Polished screens"] },
    { id: "figma", label: "Figma", type: "hard", desc: "UI planning and quick prototyping.", evidence: ["Wireframes", "Layout planning", "Design iteration"] },
    { id: "postman", label: "Postman", type: "hard", desc: "Testing APIs and debugging requests.", evidence: ["API testing", "Request validation", "Debug flows"] },
    { id: "excel", label: "Excel", type: "hard", desc: "Working with data and readable outputs.", evidence: ["Reports", "Tables", "Exports"] },
    { id: "vsc", label: "VS Code", type: "hard", desc: "Daily driver for building + debugging.", evidence: ["Frontend work", "Scripts", "Project structure"] },
    { id: "jupyter", label: "Jupyter", type: "hard", desc: "Exploration, analysis, and quick experiments.", evidence: ["Python analysis", "Notebooks", "Iteration"] },
    { id: "autopsy", label: "Autopsy", type: "hard", desc: "Digital forensics tooling and analysis.", evidence: ["Forensics labs", "Artifact review", "Casework practice"] },
    { id: "dbeaver", label: "DBeaver", type: "hard", desc: "DB client workflows and SQL productivity.", evidence: ["Querying", "Schema browsing", "DB work"] },

    // SOFT
    { id: "adapt", label: "Adaptability", type: "soft", desc: "I learn new tools fast and adjust quickly.", evidence: ["New stacks", "New tasks", "Fast ramp-ups"] },
    { id: "problem", label: "Problem-solving", type: "soft", desc: "I chase root causes, not just symptoms.", evidence: ["Debugging", "Edge cases", "Fix validation"] },
    { id: "critical", label: "Critical thinking", type: "soft", desc: "I question assumptions and verify behaviour.", evidence: ["Testing", "Code review mindset", "Better decisions"] },
    { id: "comm", label: "Communication", type: "soft", desc: "Clear, structured updates and explanations.", evidence: ["Handover notes", "Progress updates", "Write-ups"] },
    { id: "team", label: "Teamwork", type: "soft", desc: "I collaborate smoothly and keep work aligned.", evidence: ["Pairing", "Sharing context", "Helping others"] },
    { id: "resilience", label: "Resilience", type: "soft", desc: "I keep going until it’s stable and clean.", evidence: ["Long debugging", "Iteration", "Polish passes"] },
    { id: "time", label: "Time management", type: "soft", desc: "I prioritise and ship the important parts first.", evidence: ["Task planning", "Deadlines", "Milestones"] },
    { id: "discipline", label: "Self-discipline", type: "soft", desc: "Consistent progress, even on tough tasks.", evidence: ["Daily improvements", "Practice", "Follow-through"] },
    { id: "ownership", label: "Ownership", type: "soft", desc: "I take accountability and deliver end-to-end.", evidence: ["Feature completion", "Fix tracking", "Reliable output"] },
    { id: "curious", label: "Curiosity", type: "soft", desc: "I explore and experiment to find better solutions.", evidence: ["New tools", "Better approaches", "Learning loops"] },
    { id: "analytical", label: "Analytical", type: "soft", desc: "I break problems into clear, testable parts.", evidence: ["Debug plans", "Data checks", "Structured thinking"] },
    { id: "creative", label: "Creativity", type: "soft", desc: "I design solutions that look good and work well.", evidence: ["UI ideas", "Layouts", "User-friendly flows"] },
]

const deg = (d) => (d * Math.PI) / 180

function placeOnRing(items, cx, cy, r, startDeg = -90, sx = 1.0, sy = 1.0) {
    const n = Math.max(1, items.length)
    return items.map((s, i) => {
        const a = startDeg + (360 * i) / n
        return {
            ...s,
            x: cx + Math.cos(deg(a)) * r * sx,
            y: cy + Math.sin(deg(a)) * r * sy,
        }
    })
}

function typeMeta(type) {
    if (type === "hard") return { icon: <Wrench className="h-4 w-4" />, label: "Hard skill" }
    if (type === "soft") return { icon: <Compass className="h-4 w-4" />, label: "Soft skill" }
    return { icon: <Sparkles className="h-4 w-4" />, label: "Core" }
}

export default function Aboutme() {
    const [activeId, setActiveId] = useState("northstar")

    // astronaut position
    const ME_POS = { left: "50%", top: "64%" }

    // constellation center (match the astronaut)
    const ORBIT = {
        cx: 50,
        cy: 64,
        sx: 2.0,      // wider spread
        sy: 1.0,
        hardR: 20,    // inner ring radius
        softR: 30,    // outer ring radius
        north: { x: 52, y: 49 }, // North Star above you
    }

    // ✅ place stars with real x/y
    const stars = useMemo(() => {
        const north = STARS.find((s) => s.id === "northstar")
        const hard = STARS.filter((s) => s.type === "hard")
        const soft = STARS.filter((s) => s.type === "soft")

        // rotate a bit so the right side has breathing room near the info panel
        const hardPlaced = placeOnRing(hard, ORBIT.cx, ORBIT.cy, ORBIT.hardR, -135, ORBIT.sx, ORBIT.sy)
        const softPlaced = placeOnRing(soft, ORBIT.cx, ORBIT.cy, ORBIT.softR, -95, ORBIT.sx, ORBIT.sy)

        return [
            { ...north, x: ORBIT.north.x, y: ORBIT.north.y },
            ...hardPlaced,
            ...softPlaced,
        ]
    }, [])

    const byId = useMemo(() => {
        const m = new Map()
        for (const s of stars) m.set(s.id, s)
        return m
    }, [stars])

    // ✅ always valid connections
    const links = useMemo(() => {
        const out = []
        for (const s of stars) if (s.id !== "northstar") out.push([s.id, "northstar"])

        // optional “story” links (only add if both exist)
        const extra = [
            ["comm", "js"],
            ["comm", "csharp"],
            ["problem", "sql"],
            ["critical", "sql"],
            ["analytical", "python"],
            ["creative", "figma"],
            ["team", "comm"],
        ]
        for (const [a, b] of extra) {
            if (byId.has(a) && byId.has(b)) out.push([a, b])
        }

        return out
    }, [stars, byId])

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

                        {/* hide lines behind astronaut */}
                        <mask id="avoidBodyMask" maskUnits="userSpaceOnUse">
                            <rect x="0" y="0" width="100" height="100" fill="white" />
                            <circle cx={ORBIT.cx} cy={ORBIT.cy} r="14" fill="black" />
                        </mask>
                    </defs>

                    {/* Links */}
                    <g mask="url(#avoidBodyMask)">
                        {links.map(([a, b]) => {
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
                                    strokeLinecap="round"
                                    style={{ opacity: isHot ? 0.9 : 0.24, transition: "opacity 220ms ease" }}
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

            {/* You */}
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

            {/* Info panel */}
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
