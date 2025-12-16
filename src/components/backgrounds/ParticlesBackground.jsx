import React from "react"
import Particles from "./Particles"

export default function ParticlesBackground({
    className = "",
    zIndex = 0,
    fullScreen = true, // ✅ NEW
    height = "600px",  // only used when fullScreen=false
    ...props
}) {
    return (
        <div
            aria-hidden="true"
            className={className}
            style={{
                position: fullScreen ? "fixed" : "absolute", // ✅ fixed background
                inset: 0,
                width: "100vw",
                height: fullScreen ? "100vh" : height,
                zIndex,
                pointerEvents: "none",
            }}
        >
            <Particles
                particleColors={["#ffffff", "#ffffff"]}
                particleCount={200}
                particleSpread={10}
                speed={0.1}
                particleBaseSize={100}
                moveParticlesOnHover={true}
                alphaParticles={false}
                disableRotation={false}
                pixelRatio={
                    typeof window !== "undefined"
                        ? Math.min(2, window.devicePixelRatio || 1)
                        : 1
                }
                {...props}
            />
        </div>
    )
}
