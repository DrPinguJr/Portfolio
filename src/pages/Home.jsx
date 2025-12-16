import ParticlesBackground from "@/components/backgrounds/ParticlesBackground"
import ProjectsSection from "@/components/ProjectsSection"

export default function Home() {
    return (
        <div className="relative min-h-screen bg-black text-white">
            {/* background */}
            <ParticlesBackground
                fullScreen
                zIndex={0}
                particleColors={["#ffffff", "#ffffff"]}
                particleCount={220}
                particleSpread={10}
                speed={0.12}
                particleBaseSize={90}
                moveParticlesOnHover={true}
                alphaParticles={false}
                disableRotation={false}
            />

            {/* foreground (your UI goes here) */}
            <div className="relative z-10 mx-auto max-w-6xl px-6 py-16">
                <div className="rounded-2xl border border-white/10 bg-black/40 p-10 backdrop-blur">
                    <h1 className="text-4xl font-semibold">Lance</h1>
                    <p className="mt-2 text-white/70">Hero content goes here.</p>
                </div>
            </div>

            {/* keep this on top too */}
            <div className="relative z-10">
                <ProjectsSection />
            </div>
        </div>
    )
}
