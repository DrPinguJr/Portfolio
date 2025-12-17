import ParticlesBackground from "@/components/backgrounds/ParticlesBackground"
import ProjectsSection from "@/components/ProjectsSection"
import Portfolio from "@/components/Portfolio"
import ExperiencePlanet from "@/components/ExperiencePlanet"
import Experience from "@/components/Experience"

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

            {/* foreground (hero) */}
            <div className="relative z-10 flex min-h-[20vh] items-center justify-center px-6 py-16">
                <div className="mx-auto w-full max-w-3xl text-center">
                    <div className="rounded-2xl border border-white/10 bg-black/40 p-10 backdrop-blur">

                        <p className="mt-4 text-white/75 text-base sm:text-lg leading-relaxed">
                            Inspired by the idea of always being new - this website is my way of staying unique,
                            reaching for the stars, and building things people haven’t tried before.
                        </p>
                    </div>
                </div>
            </div>

            {/* code right under hero */}
            <Portfolio />

            {/* keep this on top too */}
            <div className="relative z-10">
                <ProjectsSection />
            </div>

            <div className="mt-28 sm:mt-36">
                <Experience />
            </div>
        </div>
    )
}
