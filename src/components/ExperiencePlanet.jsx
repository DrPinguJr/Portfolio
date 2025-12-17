import * as React from "react"
import * as THREE from "three"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Html } from "@react-three/drei"
import { cn } from "@/lib/utils"
import { useThree } from "@react-three/fiber"


/** Magma shader (very cheap). Set ANIMATE=false for max performance. */
const ANIMATE = false

function TransparentCanvasSetup() {
    const { gl } = useThree()
    React.useEffect(() => {
        // transparent clear
        gl.setClearColor(0x000000, 0)
    }, [gl])
    return null
}

const MagmaMat = {
    uniforms: {
        uTime: { value: 0 },
        uCore: { value: new THREE.Color("#ffd07a") },
        uHot: { value: new THREE.Color("#ff6a2b") },
        uDark: { value: new THREE.Color("#7a2a12") },
    },
    vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    fragmentShader: /* glsl */ `
    varying vec2 vUv;
    uniform float uTime;
    uniform vec3 uCore;
    uniform vec3 uHot;
    uniform vec3 uDark;

    float hash(vec2 p){
      p = fract(p*vec2(123.34,456.21));
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
      float v=0., a=0.5;
      for(int i=0;i<4;i++){
        v += a*noise(p);
        p *= 2.;
        a *= 0.5;
      }
      return v;
    }

    void main(){
      vec2 uv = vUv*2.0 - 1.0;
      float r = length(uv);

      // subtle flow (static if uTime=0)
      float t = uTime * 0.15;
      vec2 p = uv*3.2 + vec2(t, -t);

      float n = fbm(p);
      float veins = fbm(p*1.8 + vec2(-t*0.7, t*0.9));

      // magma cracks
      float crack = smoothstep(0.55, 0.95, veins);
      float glow  = smoothstep(0.25, 0.85, n) * (1.0 - r);

      vec3 col = mix(uDark, uHot, crack);
      col = mix(col, uCore, glow*0.55);

      // hotter edge
      float edge = smoothstep(0.55, 0.95, r);
      col += uHot * edge * 0.25;

      gl_FragColor = vec4(col, 1.0);
    }
  `,
}

function Sun() {
    const matRef = React.useRef(null)

    // If you ever want animation, flip ANIMATE=true (note: frameloop would need to be "always")
    React.useEffect(() => {
        if (!matRef.current) return
        matRef.current.uniforms.uTime.value = 0
    }, [])

    return (
        <group>
// magma sphere (brighter)
            <mesh>
                <sphereGeometry args={[2.35, 64, 64]} />
                <shaderMaterial ref={matRef} args={[MagmaMat]} />
            </mesh>

// glow shells (stronger)
            <mesh scale={1.16}>
                <sphereGeometry args={[2.35, 48, 48]} />
                <meshBasicMaterial
                    color={"#ffd6a6"}
                    transparent
                    opacity={0.16}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </mesh>

            <mesh scale={1.36}>
                <sphereGeometry args={[2.35, 48, 48]} />
                <meshBasicMaterial
                    color={"#ff7a2f"}
                    transparent
                    opacity={0.10}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </mesh>

            <mesh scale={1.62}>
                <sphereGeometry args={[2.35, 48, 48]} />
                <meshBasicMaterial
                    color={"#ff3b1a"}
                    transparent
                    opacity={0.06}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </mesh>
        </group>
    )
}

function Planet({ item, selected, onClick, position }) {
    const size = item.planetSize ?? 0.18
    const color = item.planetColor ?? "#cfd8ff"
    const label = item.label || item.company

    return (
        <group position={position}>
            <mesh
                onClick={(e) => {
                    e.stopPropagation()
                    onClick?.()
                }}
            >
                <sphereGeometry args={[size, 24, 24]} />
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={selected ? 0.5 : 0.24}
                    roughness={0.6}
                    metalness={0.05}
                />
            </mesh>

            <Html
                position={[0, size + 0.16, 0]}
                center
                distanceFactor={10}
                style={{ pointerEvents: "none" }}
            >
                <div
                    className={cn(
                        "rounded-full border border-white/10 bg-black/60 px-3 py-1",
                        "text-xs text-white/80 backdrop-blur",
                        selected && "border-white/30 bg-black/70 text-white"
                    )}
                >
                    {label}
                </div>
            </Html>
        </group>
    )
}

function Scene({ items, selectedId, onSelect }) {
    // ✅ planets in a line “in front of the sun”
    const count = items.length
    const spacing = 1.55
    const zFront = 4.2
    const centerOffset = (count - 1) / 2

    return (
        <>
            <ambientLight intensity={0.75} />
            <pointLight position={[7, 5, 6]} intensity={2.0} color="#ffffff" />
            <pointLight position={[-7, -5, -6]} intensity={0.7} color="#88aaff" />

            {/* extra heat light */}
            <pointLight position={[0, 0, 0]} intensity={2.6} color="#ff7a2f" />

            <Sun />

            {items.map((it, i) => {
                const x = (i - centerOffset) * spacing
                const position = [x, 0, zFront]
                return (
                    <Planet
                        key={it.id}
                        item={it}
                        selected={it.id === selectedId}
                        onClick={() => onSelect?.(it.id)}
                        position={position}
                    />
                )
            })}

            <OrbitControls
                enablePan={false}
                enableZoom
                minDistance={5}
                maxDistance={40}
                rotateSpeed={0.55}
                enableDamping={false}
            />
        </>
    )
}

export default function ExperiencePlanet({ items = [], selectedId = null, onSelect, onDeselect }) {
    return (
        <div className="w-full">
            <div className="h-[720px] sm:h-[900px] w-full">
                <Canvas
                    frameloop="demand"
                    dpr={[1, 1.25]}
                    gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
                    camera={{ position: [0, 0, 12], fov: 45 }}
                    style={{ background: "transparent" }}
                    // ✅ only deselect when clicking empty space (not a planet)
                    onPointerMissed={() => onDeselect?.()}
                >
                    <TransparentCanvasSetup />
                    <Scene items={items} selectedId={selectedId} onSelect={onSelect} />
                </Canvas>
            </div>
        </div>
    )
}


