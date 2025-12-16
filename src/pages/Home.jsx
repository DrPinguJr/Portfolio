import Galaxy from "@/components/backgrounds/Galaxy"

export default function Home() {
    return (
        <div className="relative min-h-screen overflow-hidden bg-black text-white">
            {/* background */}
            <div className="absolute inset-0">
                <Galaxy
                    mouseRepulsion={true}
                    mouseInteraction={true}
                    density={3}          // HIGH density
                    glowIntensity={0.7}
                    saturation={0.5}
                    hueShift={170}
                    twinkleIntensity={0.4}
                    rotationSpeed={0}
                    repulsionStrength={1}
                    autoCenterRepulsion={0}
                    transparent={true}
                />
            </div>

            {/* foreground (your UI goes here) */}
            <div className="relative z-10 mx-auto max-w-6xl px-6 py-16">
                <div className="rounded-2xl border border-white/10 bg-black/40 p-10 backdrop-blur">
                    <h1 className="text-4xl font-semibold">Lance</h1>
                    <p className="mt-2 text-white/70">Hero content goes here.</p>
                </div>
            </div>
        </div>
    )
}
