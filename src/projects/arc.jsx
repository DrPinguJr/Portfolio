// ✅ 3) Update src/projects/arc.jsx to match your layout mock (left code, right 2 images)

import CodeViewer from "@/components/CodeViewer"
import { PROJECT_CODE } from "./projectCodeConfig"
import { Card, CardContent } from "@/components/ui/card"
import ParticlesBackground from "@/components/backgrounds/ParticlesBackground"

export default function ArcProject() {
    const cfg = PROJECT_CODE.arc

    return (
        <div className="min-h-screen">
            {/* particles background behind the top area only */}
            <section className="relative overflow-hidden">
                <ParticlesBackground height="320px" />
                <div className="relative z-[1] mx-auto max-w-6xl px-4 pt-10 pb-6">
                    <h1 className="text-3xl sm:text-4xl font-semibold">ARC</h1>
                    <p className="mt-2 text-white/70">
                        Code + screenshots
                    </p>
                </div>
            </section>

            {/* main grid like your drawing */}
            <section className="mx-auto max-w-7xl px-4 pb-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* LEFT: code (wider) */}
                    <div className="lg:col-span-5">
                        <CodeViewer
                            title={cfg.title}
                            github={cfg.github}
                            files={{ "my-highlights/what-i-changed.ts": `// paste your edits here` }}
                            height={620}
                        />
                    </div>

                    {/* RIGHT: 2 stacked image cards */}
                    <div className="lg:col-span-2 grid grid-rows-2 gap-8">
                        <Card className="border-white/10 bg-white/5 rounded-2xl overflow-hidden">
                            <CardContent className="p-0">
                                <div className="h-[260px] w-full bg-white/10 flex items-center justify-center text-white/50">
                                    Image 1
                                    {/* later: <img src="/images/arc-1.png" className="h-full w-full object-cover" /> */}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-white/10 bg-white/5 rounded-2xl overflow-hidden">
                            <CardContent className="p-0">
                                <div className="h-[260px] w-full bg-white/10 flex items-center justify-center text-white/50">
                                    Image 2
                                    {/* later: <img src="/images/arc-2.png" className="h-full w-full object-cover" /> */}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    )
}
