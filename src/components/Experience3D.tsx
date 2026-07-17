import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { 
  Environment,
  PerspectiveCamera,
} from '@react-three/drei'
import { Bloom, EffectComposer } from '@react-three/postprocessing'

const PARTICLE_COUNT = 15000

// Helper to create the "Z" logo shape
const createZShape = () => {
  const shape = new THREE.Shape()
  shape.moveTo(-1, 2)
  shape.lineTo(1, 2)
  shape.lineTo(1, 1.5)
  shape.lineTo(-0.5, -1.5)
  shape.lineTo(1, -1.5)
  shape.lineTo(1, -2)
  shape.lineTo(-1, -2)
  shape.lineTo(-1, -1.5)
  shape.lineTo(0.5, 1.5)
  shape.lineTo(-1, 1.5)
  shape.lineTo(-1, 2)
  return shape
}

function Particles({ scroll }: { scroll: any }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  
  // Define particle target states
  const particles = useMemo(() => {
    const data = []
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Act 1: Initial (Random in depth)
      const act1 = new THREE.Vector3(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40,
        -100 - Math.random() * 200
      )
      
      // Act 1 Envelop: Around the Z
      // We'll map them roughly to a Z shape by randomly picking points on the Z shape
      const act1Env = new THREE.Vector3(
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 1
      )

      // Act 2: Sphere
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 25
      const act2 = new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      )

      // Act 3: Room walls
      const side = Math.floor(Math.random() * 6)
      const act3 = new THREE.Vector3()
      const size = 40
      if (side === 0) act3.set(-size, (Math.random() - 0.5) * size * 2, (Math.random() - 0.5) * size * 2)
      if (side === 1) act3.set(size, (Math.random() - 0.5) * size * 2, (Math.random() - 0.5) * size * 2)
      if (side === 2) act3.set((Math.random() - 0.5) * size * 2, -size, (Math.random() - 0.5) * size * 2)
      if (side === 3) act3.set((Math.random() - 0.5) * size * 2, size, (Math.random() - 0.5) * size * 2)
      if (side === 4) act3.set((Math.random() - 0.5) * size * 2, (Math.random() - 0.5) * size * 2, -size)
      if (side === 5) act3.set((Math.random() - 0.5) * size * 2, (Math.random() - 0.5) * size * 2, size)

      // Act 4: Button
      const act4 = new THREE.Vector3(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 4,
        -90 + (Math.random() - 0.5) * 5
      )

      data.push({ act1, act1Env, act2, act3, act4, speed: 0.1 + Math.random() * 0.5 })
    }
    return data
  }, [])

  useFrame((state) => {
    if (!meshRef.current) return
    const offset = scroll.offset
    const time = state.clock.getElapsedTime()

    particles.forEach((p, i) => {
      let target = new THREE.Vector3()
      
      if (offset < 0.1) {
        // Phase 1: Flying from depth to Z
        const t = offset * 10
        target.lerpVectors(p.act1, p.act1Env, THREE.MathUtils.smoothstep(t, 0, 1))
      } else if (offset < 0.3) {
        // Phase 2: Forming Sphere
        const t = (offset - 0.1) / 0.2
        target.lerpVectors(p.act1Env, p.act2, THREE.MathUtils.smoothstep(t, 0, 1))
      } else if (offset < 0.7) {
        // Phase 3: Inside the Room
        const t = (offset - 0.3) / 0.4
        target.lerpVectors(p.act2, p.act3, THREE.MathUtils.smoothstep(t, 0, 1))
      } else {
        // Phase 4: Button formation
        const t = (offset - 0.7) / 0.3
        target.lerpVectors(p.act3, p.act4, THREE.MathUtils.smoothstep(t, 0, 1))
      }

      // Add noise/fluid motion
      target.x += Math.sin(time * p.speed + i) * 0.1
      target.y += Math.cos(time * p.speed + i) * 0.1

      dummy.position.copy(target)
      dummy.scale.setScalar(offset > 0.8 ? 0.08 : 0.05)
      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial color="#00ffff" transparent opacity={0.6} />
    </instancedMesh>
  )
}

function ZLogo({ scroll }: { scroll: any }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const zShape = useMemo(() => createZShape(), [])
  
  useFrame((state) => {
    if (!meshRef.current) return
    const offset = scroll.offset
    const time = state.clock.getElapsedTime()
    
    if (offset < 0.4) {
      meshRef.current.visible = true
      const fade = THREE.MathUtils.smoothstep(offset, 0.25, 0.4)
      meshRef.current.scale.setScalar((1 - offset * 2) * (1 - fade)) 
      meshRef.current.rotation.y = time * 0.3
      meshRef.current.position.z = -offset * 40
    } else {
      meshRef.current.visible = false
    }
  })

  return (
    <mesh ref={meshRef}>
      <extrudeGeometry args={[zShape, { depth: 0.5, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.1 }]} />
      <meshPhysicalMaterial 
        color="#050505"
        metalness={0.95}
        roughness={0.05}
        clearcoat={1}
        clearcoatRoughness={0.1}
        reflectivity={1}
      />
    </mesh>
  )
}

function DataStructure({ scroll }: { scroll: any }) {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (!groupRef.current) return
    const offset = scroll.offset
    if (offset > 0.15 && offset < 0.85) {
      groupRef.current.visible = true
      groupRef.current.position.z = -30
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.1
      
      const fadeIn = THREE.MathUtils.smoothstep(offset, 0.15, 0.3)
      const fadeOut = 1 - THREE.MathUtils.smoothstep(offset, 0.7, 0.85)
      groupRef.current.scale.setScalar(fadeIn * fadeOut * 2.5)
    } else {
      groupRef.current.visible = false
    }
  })

  return (
    <group ref={groupRef}>
      <mesh>
        <icosahedronGeometry args={[5, 1]} />
        <meshBasicMaterial color="#00ffff" wireframe transparent opacity={0.1} />
      </mesh>
      {[...Array(15)].map((_, i) => (
        <mesh key={i} position={[Math.sin(i * 1.5) * 6, Math.cos(i * 1.5) * 6, Math.sin(i * 2.5) * 6]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshBasicMaterial color="#00ffff" />
        </mesh>
      ))}
    </group>
  )
}

function Scene({ offset }: { offset: number }) {
  useFrame((state) => {
    const targetZ = 15 - offset * 110
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.1)
    
    if (state.camera instanceof THREE.PerspectiveCamera) {
      state.camera.fov = 50 + Math.sin(offset * Math.PI) * 15
      state.camera.updateProjectionMatrix()
    }
    
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, state.mouse.x * 3, 0.05)
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, state.mouse.y * 3, 0.05)
    state.camera.lookAt(0, 0, -250)
  })

  return (
    <>
      <PerspectiveCamera makeDefault fov={50} position={[0, 0, 15]} />
      <Particles scroll={{ offset }} />
      <ZLogo scroll={{ offset }} />
      <DataStructure scroll={{ offset }} />
      
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 0]} intensity={3} color="#00ffff" />
      <Environment preset="night" />

      <EffectComposer>
        <Bloom luminanceThreshold={0.15} mipmapBlur intensity={2} radius={0.5} />
      </EffectComposer>
    </>
  )
}

export default function Experience3D({ offset = 0 }: { offset?: number }) {
  return (
    <div className="fixed inset-0 z-0 bg-black pointer-events-none" aria-hidden="true">
      <Canvas gl={{ antialias: false, powerPreference: 'high-performance' }} dpr={[1, 1.5]}>
        <Scene offset={offset} />
      </Canvas>
    </div>
  )
}
