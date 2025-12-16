import { useEffect, useMemo, useRef } from "react"

function clamp(n, a, b) {
    return Math.max(a, Math.min(b, n))
}

function rand(min, max) {
    return Math.random() * (max - min) + min
}

export default function ParticlesBackground({
    className = "",
    // your screenshot settings
    color = true,
    count = 600,
    spread = 10,
    speed = 0.2,
    baseSize = 100,
    mouseInteraction = true,
    particleTransparency = false,
    disableRotation = false,
    pixelRatio = 2,
}) {
    const canvasRef = useRef(null)
    const mouseRef = useRef({ x: -9999, y: -9999, active: false })
    const rafRef = useRef(null)

    const settings = useMemo(() => {
        return {
            color: !!color,
            count: clamp(count, 50, 2500),
            spread: clamp(spread, 1, 60),
            speed: clamp(speed, 0, 2),
            baseSize: clamp(baseSize, 10, 220),
            mouseInteraction: !!mouseInteraction,
            particleTransparency: !!particleTransparency,
            disableRotation: !!disableRotation,
            pixelRatio: clamp(pixelRatio, 1, 3),
        }
    }, [color, count, spread, speed, baseSize, mouseInteraction, particleTransparency, disableRotation, pixelRatio])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d", { alpha: true })
        if (!ctx) return

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, settings.pixelRatio)
            const rect = canvas.getBoundingClientRect()
            canvas.width = Math.floor(rect.width * dpr)
            canvas.height = Math.floor(rect.height * dpr)
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        }

        resize()
        window.addEventListener("resize", resize)

        const onMove = (e) => {
            const rect = canvas.getBoundingClientRect()
            mouseRef.current.x = e.clientX - rect.left
            mouseRef.current.y = e.clientY - rect.top
            mouseRef.current.active = true
        }
        const onLeave = () => {
            mouseRef.current.active = false
            mouseRef.current.x = -9999
            mouseRef.current.y = -9999
        }

        if (settings.mouseInteraction) {
            window.addEventListener("mousemove", onMove)
            window.addEventListener("mouseleave", onLeave)
        }

        const rect = canvas.getBoundingClientRect()
        const center = { x: rect.width / 2, y: rect.height / 2 }

        const particles = []
        const ring = Math.min(rect.width, rect.height) * 0.48

        for (let i = 0; i < settings.count; i++) {
            // spread controls how “tight” the cluster is (lower = tighter)
            const s = settings.spread
            const r = Math.pow(Math.random(), 0.7) * ring * (1 + s / 60)
            const a = rand(0, Math.PI * 2)
            particles.push({
                x: center.x + Math.cos(a) * r,
                y: center.y + Math.sin(a) * r,
                vx: rand(-1, 1) * settings.speed,
                vy: rand(-1, 1) * settings.speed,
                size: rand(0.6, 1.6) * (settings.baseSize / 100),
                hue: rand(160, 220),
                ph: rand(0, Math.PI * 2),
            })
        }

        let t0 = performance.now()
        const loop = (t) => {
            const dt = Math.min(32, t - t0)
            t0 = t

            const { width, height } = canvas.getBoundingClientRect()
            center.x = width / 2
            center.y = height / 2

            ctx.clearRect(0, 0, width, height)

            const time = t * 0.001

            // optional rotation
            const rot = settings.disableRotation ? 0 : 0.06
            const cosR = Math.cos(rot)
            const sinR = Math.sin(rot)

            const mx = mouseRef.current.x
            const my = mouseRef.current.y
            const mActive = mouseRef.current.active && settings.mouseInteraction

            for (const p of particles) {
                // subtle drift
                p.x += p.vx * (dt * 0.06)
                p.y += p.vy * (dt * 0.06)

                // rotate around center (unless disabled)
                if (!settings.disableRotation) {
                    const dx = p.x - center.x
                    const dy = p.y - center.y
                    p.x = center.x + dx * cosR - dy * sinR
                    p.y = center.y + dx * sinR + dy * cosR
                }

                // mouse repulsion
                if (mActive) {
                    const dx = p.x - mx
                    const dy = p.y - my
                    const d = Math.hypot(dx, dy)
                    const radius = 140
                    if (d < radius && d > 0.001) {
                        const push = ((radius - d) / radius) * 3.5
                        p.x += (dx / d) * push
                        p.y += (dy / d) * push
                    }
                }

                // wrap
                if (p.x < -50) p.x = width + 50
                if (p.x > width + 50) p.x = -50
                if (p.y < -50) p.y = height + 50
                if (p.y > height + 50) p.y = -50

                const alphaBase = settings.particleTransparency ? 0.18 : 0.35
                const tw = 0.75 + Math.sin(time * 1.3 + p.ph) * 0.25
                const alpha = alphaBase * tw

                const fill = settings.color
                    ? `hsla(${p.hue}, 80%, 70%, ${alpha})`
                    : `rgba(255,255,255,${alpha})`

                ctx.beginPath()
                ctx.fillStyle = fill
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
                ctx.fill()
            }

            rafRef.current = requestAnimationFrame(loop)
        }

        rafRef.current = requestAnimationFrame(loop)

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
            window.removeEventListener("resize", resize)
            if (settings.mouseInteraction) {
                window.removeEventListener("mousemove", onMove)
                window.removeEventListener("mouseleave", onLeave)
            }
        }
    }, [settings])

    return (
        <canvas
            ref={canvasRef}
            className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
            aria-hidden="true"
        />
    )
}
