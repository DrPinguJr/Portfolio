// src/projects/arc.jsx
// ✅ Match Pocket/EcoVision layout: full-page particles, wide container, code left + images right

import CodeViewer from "@/components/CodeViewer"
import { PROJECT_CODE } from "./projectCodeConfig"
import { Card, CardContent } from "@/components/ui/card"
import ParticlesBackground from "@/components/backgrounds/ParticlesBackground"

export default function ArcProject() {
    const cfg = PROJECT_CODE.arc

    return (
        <div className="min-h-screen w-full relative">
            {/* full-page background */}
            <ParticlesBackground fullScreen zIndex={0} particleCount={220} speed={0.12} />

            {/* content */}
            <div className="relative z-10 w-full px-6 pt-10 pb-16">
                <h1 className="text-4xl font-semibold">ARC</h1>
                <p className="mt-2 text-white/70">Code + screenshots</p>

                <div className="mt-8 grid grid-cols-1 2xl:grid-cols-12 gap-10 items-start">
                    {/* code */}
                    <div className="2xl:col-span-7">
                        <CodeViewer
                            title={cfg.title}
                            github={cfg.github}
                            files={{ "my-highlights/what-i-changed.ts": `// paste your edits here` }}
                            height={900}
                        />
                    </div>

                    {/* images */}
                    <div className="2xl:col-span-5 grid gap-10">
                        <Card className="border-white/10 bg-white/5 rounded-2xl overflow-hidden">
                            <CardContent className="p-0">
                                <div className="h-[420px] w-full bg-white/10 flex items-center justify-center text-white/60">
                                    Image 1
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-white/10 bg-white/5 rounded-2xl overflow-hidden">
                            <CardContent className="p-0">
                                <div className="h-[420px] w-full bg-white/10 flex items-center justify-center text-white/60">
                                    Image 2
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
