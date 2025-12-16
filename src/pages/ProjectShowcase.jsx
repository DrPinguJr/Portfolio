import ParticlesBackground from "@/components/backgrounds/ParticlesBackground"

export default function ProjectShowcase() {
    return (
        <div className="relative min-h-screen">
            <ParticlesBackground
                className="-z-10"
                color={true}
                count={600}
                spread={10}
                speed={0.2}
                baseSize={100}
                mouseInteraction={true}
                particleTransparency={false}
                disableRotation={false}
                pixelRatio={2}
            />
            <div className="relative z-10 p-10 text-white">
                <h1 className="text-4xl">Project Showcase</h1>
            </div>
        </div>
    )
}
