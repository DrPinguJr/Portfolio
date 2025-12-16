import CodeViewer from "@/components/CodeViewer"
import ParticlesBackground from "@/components/backgrounds/ParticlesBackground"
import { Card, CardContent } from "@/components/ui/card"

import Eco1 from "@/assets/images/Eco1.jpg"
import Eco2 from "@/assets/images/Eco2.jpg"
import Eco3 from "@/assets/images/Eco3.jpg"

export default function EcoVisionProject() {
    return (
        <div className="min-h-screen w-full relative">
            <ParticlesBackground fullScreen zIndex={0} particleCount={220} speed={0.12} />

            <div className="relative z-10 w-full px-6 pt-10 pb-16">
                <h1 className="text-4xl font-semibold">EcoVision</h1>
                <p className="mt-2 text-white/70">Website project — code + screenshots.</p>

                <div className="mt-8 grid grid-cols-1 2xl:grid-cols-12 gap-10 items-start">
                    <div className="2xl:col-span-7">
                        <CodeViewer
                            title="JacTBB/IT1166-EcoVision"
                            github={{ repo: "JacTBB/IT1166-EcoVision", showAll: true, prefix: "github/" }}
                            height={900}
                        />
                    </div>

                    <div className="2xl:col-span-5 grid gap-10">
                        <Card className="border-white/10 bg-white/5 rounded-2xl overflow-hidden">
                            <CardContent className="p-0">
                                <img src={Eco1} alt="EcoVision screenshot 1" className="h-[420px] w-full object-cover" />
                            </CardContent>
                        </Card>

                        <Card className="border-white/10 bg-white/5 rounded-2xl overflow-hidden">
                            <CardContent className="p-0">
                                <img src={Eco2} alt="EcoVision screenshot 2" className="h-[420px] w-full object-cover" />
                            </CardContent>
                        </Card>

                        <Card className="border-white/10 bg-white/5 rounded-2xl overflow-hidden">
                            <CardContent className="p-0">
                                <img src={Eco3} alt="EcoVision screenshot 3" className="h-[420px] w-full object-cover" />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
