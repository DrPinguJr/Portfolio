import { Routes, Route, Outlet } from "react-router-dom"
import Navbar from "@/components/ui/navbar"
import Home from "@/pages/Home"
import ArcProject from "@/projects/arc"
import PocketProject from "@/projects/pocket"
import EcoVisionProject from "@/projects/ecovision"
import Aboutme from "@/pages/Aboutme"


function Layout() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-white/10 bg-black/60">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-white/70">
          Footer placeholder — LinkedIn / IG / GitHub later
        </div>
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/projects/arc" element={<ArcProject />} />
        <Route path="/projects/pocket" element={<PocketProject />} />
        <Route path="/projects/ecovision" element={<EcoVisionProject />} />
        <Route path="/about" element={<Aboutme />} />
      </Route>
    </Routes>
  )
}
