// src/components/sections/Certificate.jsx
import React, { Suspense, useMemo, useRef, useState } from "react"
import * as THREE from "three"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Billboard, Html, OrbitControls, Sparkles, useTexture } from "@react-three/drei"
import { createPortal } from "react-dom"

// ✅ your cert images
import C1 from "../../assets/images/C1.png"
import C2 from "../../assets/images/C2.png"
import C3 from "../../assets/images/C3.png"
import C4 from "../../assets/images/C4.png"
import C5 from "../../assets/images/C5.png"
import C6 from "../../assets/images/C6.png"

function TransparentCanvasSetup() {
    const { gl } = useThree()
    React.useEffect(() => {
        gl.setClearColor(0x000000, 0) // ✅ transparent
    }, [gl])
    return null
}

function OrbitRing({ speed = 0.22, children }) {
    const ref = useRef()
    useFrame((_, dt) => {
        if (!ref.current) return
        ref.current.rotation.y += dt * speed
    })
    return <group ref={ref}>{children}</group>
}

function CertOverlay({ open, img, title, onClose }) {
    if (!open) return null

    return createPortal(
        <div
            className="fixed inset-0 z-[99999] flex items-center justify-center"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <div
                className="relative z-[100000] max-w-[92vw] max-h-[88vh] rounded-2xl border border-white/15 bg-black/50 p-4 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between gap-3 pb-3">
                    <div className="text-sm font-semibold text-white">{title}</div>
                    <button
                        className="rounded-md border border-white/15 bg-white/5 px-3 py-1 text-xs text-white hover:bg-white/10"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>

                <img
                    src={img}
                    alt={title}
                    className="block max-h-[78vh] max-w-[88vw] rounded-xl object-contain"
                    draggable={false}
                />
            </div>
        </div>,
        document.body
    )
}

/** Black hole + accretion disk (cheap shader, looks “alive”) */
function RealisticBlackHole() {
    const diskRef = useRef()
    const glowRef = useRef()

    useFrame((_, dt) => {
        if (diskRef.current) {
            diskRef.current.material.uniforms.uTime.value += dt
            diskRef.current.rotation.z += dt * 0.18
        }
        if (glowRef.current) {
            glowRef.current.rotation.y += dt * 0.1
        }
    })

    const diskMat = useMemo(
        () => ({
            uniforms: {
                uTime: { value: 0 },
            },
            vertexShader: /* glsl */ `
        varying vec2 vUv;
        varying vec3 vPos;
        void main() {
          vUv = uv;
          vPos = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
            fragmentShader: /* glsl */ `
        varying vec2 vUv;
        uniform float uTime;

        // small helpers
        float hash(vec2 p){
          p = fract(p*vec2(123.34, 456.21));
          p += dot(p,p+45.32);
          return fract(p.x*p.y);
        }
        float noise(vec2 p){
          vec2 i=floor(p), f=fract(p);
          float a=hash(i);
          float b=hash(i+vec2(1.,0.));
          float c=hash(i+vec2(0.,1.));
          float d=hash(i+vec2(1.,1.));
          vec2 u=f*f*(3.-2.*f);
          return mix(a,b,u.x)+(c-a)*u.y*(1.-u.x)+(d-b)*u.x*u.y;
        }
        float fbm(vec2 p){
          float v=0., a=0.55;
          for(int i=0;i<5;i++){
            v += a*noise(p);
            p *= 2.0;
            a *= 0.5;
          }
          return v;
        }

        void main(){
          // convert uv into centered coords
          vec2 uv = vUv * 2.0 - 1.0;

          // disk tilt distortion (makes it feel 3D)
          uv.y *= 0.55;

          float r = length(uv);
          float ang = atan(uv.y, uv.x); // -pi..pi

          // disk radius band (thin-ish)
          float inner = 0.55;
          float outer = 1.00;

          float ring = smoothstep(inner, inner + 0.02, r) * (1.0 - smoothstep(outer - 0.02, outer, r));

          // turbulence / streaks
          float t = uTime * 0.25;
          float streak = fbm(vec2(ang * 3.2, r * 9.0) + vec2(t, -t));
          float filament = smoothstep(0.45, 0.90, streak);

          // doppler brightening: one side brighter
          // brighten near ang ~ 0 (right side), dim opposite
          float doppler = 0.55 + 0.65 * smoothstep(-0.9, 0.9, cos(ang - 0.2));

          // hotter near inner edge
          float heat = 1.0 - smoothstep(inner, outer, r);
          heat = pow(heat, 1.7);

          // colors (white-hot near inner, orange outer)
          vec3 hot = vec3(1.0, 0.98, 0.9);
          vec3 warm = vec3(1.0, 0.58, 0.18);
          vec3 cool = vec3(0.55, 0.82, 1.0);

          vec3 col = mix(warm, hot, heat);
          col = mix(col, cool, 0.12 * filament);

          // intensity
          float intensity = ring * (0.22 + 0.95 * filament) * doppler;
          intensity *= (0.55 + 1.1 * heat);

          // alpha + soft falloff
          float alpha = ring * (0.35 + 0.65 * filament);
          alpha *= (0.7 + 0.6 * doppler);

          // very subtle outer haze
          float haze = smoothstep(0.95, 1.15, r) * 0.06;

          // final
          gl_FragColor = vec4(col * intensity + warm * haze, alpha);
        }
      `,
        }),
        []
    )

    return (
        <group>
            // --- event horizon ---
            <mesh>
                <sphereGeometry args={[1.55, 64, 64]} />
                <meshBasicMaterial color="#000000" toneMapped={false} />
            </mesh>

            {/* ✅ big soft orange aura (so it’s visible on black bg) */}
            <mesh scale={1.22}>
                <sphereGeometry args={[1.55, 48, 48]} />
                <meshBasicMaterial
                    color="#ff9a3c"
                    transparent
                    opacity={0.10}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                    toneMapped={false}
                />
            </mesh>

            {/* ✅ tighter brighter orange rim */}
            <mesh scale={1.10}>
                <sphereGeometry args={[1.55, 48, 48]} />
                <meshBasicMaterial
                    color="#ffb36b"
                    transparent
                    opacity={0.14}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                    toneMapped={false}
                />
            </mesh>

            {/* photon ring glow (thin bright ring) */}
            <mesh ref={glowRef} rotation={[0, 0.35, 0]}>
                <torusGeometry args={[1.72, 0.07, 24, 140]} />
                <meshBasicMaterial
                    color="#ffd2a1"
                    transparent
                    opacity={0.22}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                    toneMapped={false}
                />
            </mesh>

            {/* extra warm ring spread */}
            <mesh rotation={[0, 0.35, 0]}>
                <torusGeometry args={[1.72, 0.18, 24, 140]} />
                <meshBasicMaterial
                    color="#ff8a2b"
                    transparent
                    opacity={0.06}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                    toneMapped={false}
                />
            </mesh>

            {/* accretion disk (smaller + more realistic shader) */}
            <mesh
                ref={diskRef}
                rotation={[Math.PI * 0.47, 0, 0]}
                position={[0, 0.05, 0]}
                scale={1.0}
            >
                <ringGeometry args={[1.95, 3.95, 160]} />
                <shaderMaterial
                    args={[diskMat]}
                    transparent
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                    toneMapped={false}
                />
            </mesh>

            {/* soft disk halo */}
            <mesh rotation={[Math.PI * 0.47, 0, 0]} position={[0, 0.05, 0]} scale={1.02}>
                <ringGeometry args={[2.05, 4.25, 160]} />
                <meshBasicMaterial
                    color="#ffb36b"
                    transparent
                    opacity={0.04}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                    toneMapped={false}
                />
            </mesh>
        </group>
    )
}

/** Cert card that stays readable (no lighting washout) */
function CertPlane({ url, title, position, onSelect, legendary = false, dim = false }) {
    const tex = useTexture(url)
    if (tex && "colorSpace" in tex) tex.colorSpace = THREE.SRGBColorSpace

    // auto aspect from image (works for vertical C6)
    const aspect = useMemo(() => {
        const img = tex?.image
        if (!img?.width || !img?.height) return 1.6
        return img.width / img.height
    }, [tex])

    // Make them BIG (height-based)
    const h = legendary ? 2.35 : 2.15
    const w = h * aspect

    return (
        <group position={position}>
            <Billboard follow>
                {/* dark backing plate for contrast */}
                <mesh position={[0, 0, -0.06]}>
                    <planeGeometry args={[w + 0.22, h + 0.18]} />
                    <meshBasicMaterial
                        color="#000000"
                        transparent
                        opacity={dim ? 0.55 : 0.42}
                        toneMapped={false}
                    />
                </mesh>

                {/* cert texture (render as-is) */}
                <mesh
                    onClick={(e) => {
                        e.stopPropagation()
                        onSelect?.()
                    }}
                    onPointerOver={(e) => {
                        e.stopPropagation()
                        document.body.style.cursor = "pointer"
                    }}
                    onPointerOut={() => (document.body.style.cursor = "default")}
                >
                    <planeGeometry args={[w, h]} />
                    <meshBasicMaterial
                        map={tex}
                        transparent
                        opacity={dim ? 0.9 : 1}
                        toneMapped={false}
                    />
                </mesh>

                {/* legendary glow */}
                {legendary ? (
                    <>
                        <mesh position={[0, 0, -0.11]}>
                            <planeGeometry args={[w + 0.6, h + 0.5]} />
                            <meshBasicMaterial
                                color="#b6fffb"
                                transparent
                                opacity={0.16}
                                blending={THREE.AdditiveBlending}
                                depthWrite={false}
                                toneMapped={false}
                            />
                        </mesh>
                        <Sparkles
                            count={140}
                            scale={[w + 1.2, h + 1.2, 3]}
                            size={3.0}
                            speed={0.9}
                            opacity={0.95}
                            position={[0, 0, 0.15]}
                        />
                    </>
                ) : null}

                <Html center position={[0, -h / 2 - 0.38, 0]} style={{ pointerEvents: "none" }}>
                    <div className="px-2 py-1 rounded-md text-[11px] tracking-wide bg-black/55 border border-white/10 text-white/90 backdrop-blur">
                        {title}
                    </div>
                </Html>
            </Billboard>
        </group>
    )
}

function Scene({ certs, selected, setSelected }) {
    const radius = 4.8
    const yAmp = 0.85

    const positions = useMemo(() => {
        const n = certs.length
        return certs.map((_, i) => {
            const a = (i / n) * Math.PI * 2
            return [Math.cos(a) * radius, Math.sin(a * 2) * yAmp, Math.sin(a) * radius]
        })
    }, [certs.length])

    return (
        <>
            <ambientLight intensity={0.35} />

            {/* center black hole */}
            <RealisticBlackHole />

            {/* orbiting certs */}
            <OrbitRing speed={0.24}>
                {certs.map((c, i) => {
                    // ✅ if overlay is open, hide the selected one from the orbit
                    if (selected?.id === c.id) return null

                    return (
                        <CertPlane
                            key={c.id}
                            url={c.img}
                            title={c.title}
                            position={positions[i]}
                            legendary={c.legendary}
                            dim={!!selected}
                            onSelect={() => setSelected(c)}
                        />
                    )
                })}
            </OrbitRing>

            <OrbitControls enablePan={false} enableZoom={false} rotateSpeed={0.55} />
        </>
    )
}

export default function CertificateSection() {
    const [selected, setSelected] = useState(null) // {id,title,img,...} or null

    const certs = useMemo(
        () => [
            { id: "C1", title: "NV STAR Compassion Award", img: C1 },
            { id: "C2", title: "NCC PDS IC EXCO Award", img: C2 },
            { id: "C3", title: "Istana Heritage Certification", img: C3 },
            { id: "C4", title: "NYP SU CAMP Certification", img: C4 },
            { id: "C5", title: "World Skills Certification", img: C5 },
            { id: "C6", title: "Director’s List Certification", img: C6, legendary: true },
        ],
        []
    )

    return (
        <section className="relative w-full">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-28 z-50 bg-gradient-to-t from-transparent to-black" />
            <div className="mx-auto max-w-6xl px-6 py-14">
                <div className="flex items-end justify-between gap-6">
                    <div>
                        <h2 className="text-3xl font-semibold text-white">Certificates</h2>
                        <p className="mt-2 text-white/70">Orbiting a black hole — click one to read it.</p>
                    </div>
                    <div className="hidden sm:block text-xs text-white/60">Tip: click a cert</div>
                </div>

                <div className="mt-8 h-[640px] w-full">
                    <Canvas
                        dpr={[1, 1.5]}
                        camera={{ position: [0, 1.6, 10.5], fov: 45 }}
                        gl={{ antialias: true, alpha: true }}
                        style={{ background: "transparent" }}
                        onPointerMissed={() => setSelected(null)}
                    >
                        <TransparentCanvasSetup />
                        <Suspense fallback={null}>
                            <Scene certs={certs} selected={selected} setSelected={setSelected} />
                        </Suspense>
                    </Canvas>

                    <CertOverlay
                        open={!!selected}
                        img={selected?.img}
                        title={selected?.title}
                        onClose={() => setSelected(null)}
                    />

                </div>
            </div>
        </section>
    )
}
