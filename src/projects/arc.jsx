// src/projects/arc.jsx
// ✅ Match EcoVision layout: full repo code viewer + screenshots right

import CodeViewer from "@/components/CodeViewer"
import { Card, CardContent } from "@/components/ui/card"
import ParticlesBackground from "@/components/backgrounds/ParticlesBackground"

// If you don't have these yet, create them in src/assets/images/
// (or rename paths to whatever you actually use)
import Arc1 from "@/assets/images/Arc1.jpg"
import Arc2 from "@/assets/images/Arc2.jpg"
import Arc3 from "@/assets/images/Arc3.jpg"
import Arc4 from "@/assets/images/Arc4.jpg"
import Arc5 from "@/assets/images/Arc5.jpg"
import Arc6 from "@/assets/images/Arc6.jpg"

export default function ArcProject() {
    const screenshots = [
        { src: Arc1, alt: "ARC screenshot 1" },
        { src: Arc2, alt: "ARC screenshot 2" },
        { src: Arc3, alt: "ARC screenshot 3" },
        { src: Arc4, alt: "ARC screenshot 4" },
        { src: Arc5, alt: "ARC screenshot 5" },
        { src: Arc6, alt: "ARC screenshot 6" },
    ]

    return (
        <div className="min-h-screen w-full relative">
            <ParticlesBackground fullScreen zIndex={0} particleCount={220} speed={0.12} />

            <div className="relative z-10 w-full px-6 pt-10 pb-16">
                <h1 className="text-4xl font-semibold">ARC</h1>
                <p className="mt-2 text-white/70">Code + screenshots</p>

                <div className="mt-8 grid grid-cols-1 2xl:grid-cols-12 gap-10 items-start">
                    {/* code */}
                    <div className="2xl:col-span-7">
                        <CodeViewer
                            title="ccz82/arc"
                            github={{ repo: "ccz82/arc", showAll: true, prefix: "github/" }}
                            // optional: keep a “my edits” file pinned in the tree too
                            files={{ "my-highlights/what-i-changed.ts": `// paste your edits here` }}
                            height={900}
                        />
                    </div>

                    {/* images */}
                    <div className="2xl:col-span-5 grid gap-10">
                        {screenshots.map((img) => (
                            <Card
                                key={img.alt}
                                className="border-white/10 bg-white/5 rounded-2xl overflow-hidden"
                            >
                                <CardContent className="p-0">
                                    <img
                                        src={img.src}
                                        alt={img.alt}
                                        className="h-[420px] w-full object-cover"
                                    />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
