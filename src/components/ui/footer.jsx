// src/components/ui/footer.jsx
import React, { Suspense, useMemo, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { Linkedin, Instagram, Mail } from "lucide-react"

function LinkItem({ href, icon: Icon, title, subtitle, size = "md" }) {
    const isSmall = size === "sm"

    return (
        <a
            href={href}
            target={href.startsWith("mailto:") ? undefined : "_blank"}
            rel={href.startsWith("mailto:") ? undefined : "noreferrer"}
            className={[
                "group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 text-white/85 backdrop-blur-md transition hover:bg-white/10",
                isSmall ? "px-3 py-2 w-[260px] h-[58px]" : "px-4 py-3 w-[300px] h-[70px]",
            ].join(" ")}
        >
            <span
                className={[
                    "grid shrink-0 place-items-center rounded-xl border border-white/10 bg-black/30",
                    isSmall ? "h-9 w-9" : "h-10 w-10",
                ].join(" ")}
            >
                <Icon className={isSmall ? "h-4 w-4" : "h-4 w-4"} />
            </span>

            <span className="min-w-0 leading-tight">
                <div className={isSmall ? "text-sm font-semibold" : "text-sm font-semibold"}>{title}</div>
                <div className={isSmall ? "truncate text-[11px] text-white/55 group-hover:text-white/65" : "truncate text-xs text-white/55 group-hover:text-white/65"}>
                    {subtitle}
                </div>
            </span>
        </a>
    )
}


function EarthMesh({ radius = 2.8 }) {
    const ref = useRef(null)

    const [dayMap, normalMap] = useMemo(() => {
        const loader = new THREE.TextureLoader()
        loader.setCrossOrigin?.("anonymous")

        const day = loader.load("https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg")
        day.colorSpace = THREE.SRGBColorSpace
        day.anisotropy = 8

        const normal = loader.load("https://threejs.org/examples/textures/planets/earth_normal_2048.jpg")
        normal.anisotropy = 8

        return [day, normal]
    }, [])

    useFrame((_, dt) => {
        if (!ref.current) return
        ref.current.rotation.y += dt * 0.30
    })

    return (
        // ✅ push down more so it gets cut at the bottom edge (your red line)
        <group ref={ref} position={[0, -2.55, 0]} rotation={[0, 0.25, 0]}>
            <mesh>
                <sphereGeometry args={[radius, 128, 128]} />
                <meshStandardMaterial map={dayMap} normalMap={normalMap} roughness={0.55} metalness={0.05} />
            </mesh>

            <mesh scale={1.02}>
                <sphereGeometry args={[radius, 128, 128]} />
                <meshStandardMaterial color="#79b8ff" transparent opacity={0.08} roughness={1} metalness={0} />
            </mesh>
        </group>
    )
}

function EarthHeader() {
    return (
        <div className="relative w-full h-[240px] overflow-hidden">
            <Canvas
                dpr={[1, 1.5]}
                camera={{ position: [0, 0.15, 5.6], fov: 33 }}
                gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
            >
                <ambientLight intensity={0.25} />
                <directionalLight position={[-6, 6, 6]} intensity={2.4} />
                <directionalLight position={[6, -2, 5]} intensity={0.6} />
                <pointLight position={[0, 7, 6]} intensity={1.0} />

                <Suspense fallback={null}>
                    <EarthMesh radius={3.45} />
                </Suspense>
            </Canvas>

            {/* ✅ hard cutoff at the earth line */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-6 bg-black" />
            {/* tiny blend so the cutoff doesn’t look jagged */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-b from-transparent to-black" />
        </div>
    )
}


export default function Footer() {
    return (
        <footer className="relative w-full border-t border-white/10 bg-transparent overflow-hidden">
            {/* bg (clear) */}
            <div className="pointer-events-none absolute inset-0 bg-transparent" />

            {/* earth (middle layer) */}
            <div className="relative z-10">
                <EarthHeader />
            </div>

            {/* buttons + name (TOP layer) */}
            <div className="absolute inset-x-0 bottom-0 z-20">
                <div className="mx-auto max-w-6xl px-4">
                    <div className="pb-6 sm:pb-8 md:pb-10">
                        <div className="flex items-end justify-between gap-6">
                            {/* left name card */}
                            <div className="rounded-3xl border border-white/10 bg-black/35 px-6 py-5 text-white backdrop-blur-xl">
                                <div className="text-lg font-semibold">Lance Liu</div>
                                <div className="mt-1 text-sm text-white/65">Building clean, practical products</div>
                                <div className="mt-4 text-xs text-white/40">© {new Date().getFullYear()} Lance Liu</div>
                            </div>

                            {/* right buttons */}
                            <div className="flex flex-col gap-2 md:gap-3">
                                <LinkItem
                                    href="https://www.linkedin.com/in/lanceliu"
                                    icon={Linkedin}
                                    title="LinkedIn"
                                    subtitle="linkedin.com/in/lanceliu"
                                    size="sm"
                                />
                                <LinkItem
                                    href="https://instagram.com/la._.ncee"
                                    icon={Instagram}
                                    title="Instagram"
                                    subtitle="@la._.ncee"
                                    size="sm"
                                />
                                <LinkItem
                                    href="mailto:Poplance88@gmail.com"
                                    icon={Mail}
                                    title="Email"
                                    subtitle="Poplance88@gmail.com"
                                    size="sm"
                                />
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

