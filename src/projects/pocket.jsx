import CodeViewer from "@/components/CodeViewer"
import ParticlesBackground from "@/components/backgrounds/ParticlesBackground"
import { Card, CardContent } from "@/components/ui/card"

export default function PocketProject() {
    return (
        <div className="min-h-screen w-full">
            <section className="relative overflow-hidden">
                <ParticlesBackground height="420px" />
                <div className="relative z-[1] w-full px-6 pt-14 pb-10">
                    <h1 className="text-4xl font-semibold">Pocket</h1>
                    <p className="mt-2 text-white/70">Full repo browser + screenshots.</p>
                </div>
            </section>

            <section className="w-full px-6 pb-16">
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                    <div className="xl:col-span-7">
                        <CodeViewer
                            title="DrPinguJr/Pocket"
                            github={{ repo: "DrPinguJr/Pocket", showAll: true, prefix: "github/" }}
                            height={900}
                        />
                    </div>

                    <div className="xl:col-span-5 grid grid-rows-2 gap-10">
                        <Card className="border-white/10 bg-white/5 rounded-2xl overflow-hidden">
                            <CardContent className="p-0">
                                <div className="h-[430px] w-full bg-white/10 flex items-center justify-center text-white/50">
                                    Image 1
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-white/10 bg-white/5 rounded-2xl overflow-hidden">
                            <CardContent className="p-0">
                                <div className="h-[430px] w-full bg-white/10 flex items-center justify-center text-white/50">
                                    Image 2
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    )
}
