import CodeViewer from "@/components/CodeViewer"
import ParticlesBackground from "@/components/backgrounds/ParticlesBackground"
import { Card, CardContent } from "@/components/ui/card"
import MushroomPVP from "@/assets/images/Mushroom_PVP.jpg"


export default function PocketProject() {
    return (
        <div className="relative z-10 w-full px-6 pt-10 pb-16">
            <section className="relative overflow-hidden">
                <ParticlesBackground height="420px" />
                <div className="relative z-[1] w-full px-6 pt-14 pb-10">
                    <h1 className="text-4xl font-semibold">Pocket</h1>
                    <p className="mt-2 text-white/70">Full repo browser + screenshots.</p>
                </div>
            </section>

            <section className="w-full px-6 pb-16">
                <div className="mt-8 grid grid-cols-1 2xl:grid-cols-12 gap-10 items-start">
                    {/* CodeViewer */}
                    <div className="2xl:col-span-7">
                        <CodeViewer
                            title="DrPinguJr/Pocket"
                            github={{ repo: "DrPinguJr/Pocket", showAll: true, prefix: "github/" }}
                            height={900}
                        />
                    </div>

                    {/* Images */}
                    <div className="2xl:col-span-5 grid gap-10">
                        <Card className="border-white/10 bg-white/5 rounded-2xl overflow-hidden">
                            <CardContent className="p-0">
                                <img
                                    src={MushroomPVP}
                                    alt="Mushroom PVP"
                                    className="h-[420px] w-full object-cover"
                                    loading="lazy"
                                />
                            </CardContent>
                        </Card>

                        {/* <Card className="border-white/10 bg-white/5 rounded-2xl overflow-hidden">
                            <CardContent className="p-0">
                                <div className="h-[420px] w-full bg-white/10 flex items-center justify-center text-white/60">
                                    Image 2
                                </div>
                            </CardContent>
                        </Card> */}
                    </div>
                </div>
            </section >
        </div >
    )
}
