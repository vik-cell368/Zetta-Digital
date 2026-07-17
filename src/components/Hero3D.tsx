import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { Environment, Float, PresentationControls, ContactShadows, Text } from '@react-three/drei'

function Monolith() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const { mouse } = useThree()
  
  // High-density Icosahedron for the perfect geometric body
  const baseGeom = useMemo(() => new THREE.IcosahedronGeometry(2.5, 5), [])
  const count = baseGeom.attributes.position.count

  const dummy = useMemo(() => new THREE.Object3D(), [])
  const color = new THREE.Color()
  
  const lamellas = useMemo(() => {
    const temp = []
    const pos = baseGeom.attributes.position.array
    const norm = baseGeom.attributes.normal.array
    for (let i = 0; i < count; i++) {
      temp.push({
        position: new THREE.Vector3(pos[i*3], pos[i*3+1], pos[i*3+2]),
        normal: new THREE.Vector3(norm[i*3], norm[i*3+1], norm[i*3+2]),
        phase: Math.random() * Math.PI * 2,
        speed: 0.1 + Math.random() * 0.4 // Slow, organic breathing
      })
    }
    return temp
  }, [baseGeom, count])

  const targetMouse = useRef(new THREE.Vector2(0, 0))

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.getElapsedTime()
    
    targetMouse.current.lerp(mouse, 0.05)
    const mouse3D = new THREE.Vector3(targetMouse.current.x * 6, targetMouse.current.y * 6, 2)

    lamellas.forEach((data, i) => {
      dummy.position.copy(data.position)
      dummy.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), data.normal)
      
      // Organic breathing algorithm
      const breath = Math.sin(t * data.speed + data.phase) * 0.12
      dummy.position.addScaledVector(data.normal, breath)
      
      // Mouse interaction
      const dist = dummy.position.distanceTo(mouse3D)
      const influence = Math.max(0, 1 - dist / 3.5)
      
      // Movement of lamellas
      dummy.rotateX(influence * Math.sin(t * 2 + data.phase) * 1.5)
      dummy.rotateY(influence * Math.cos(t * 2 + data.phase) * 1.5)
      
      // Scale variation
      const s = 0.06 + breath * 0.03 + influence * 0.06
      dummy.scale.set(s, s, s)
      
      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)
      
      // Obsidian to deep Zetta Blue/Violet flashes
      const isZettaColor = Math.sin(t * 1.2 + data.phase * 3) > 0.96
      if (isZettaColor || influence > 0.3) {
        color.set('#0044ff').lerp(new THREE.Color('#8a2be2'), Math.random())
      } else {
        color.set('#050505')
      }
      meshRef.current!.setColorAt(i, color)
    })
    
    meshRef.current.instanceMatrix.needsUpdate = true
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true
    
    // Slow, sovereign rotation of the entire monolith
    meshRef.current.rotation.y = t * 0.08
    meshRef.current.rotation.x = Math.sin(t * 0.1) * 0.15
  })

  return (
    <group>
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        <sphereGeometry args={[1, 16, 16]} /> {/* Smooth spherical particles */}
        <meshPhysicalMaterial 
          color="#050505"
          metalness={0.95}
          roughness={0.05}
          clearcoat={1}
          clearcoatRoughness={0.1}
          iridescence={1}
          iridescenceIOR={1.6}
          iridescenceThicknessRange={[100, 400]}
        />
      </instancedMesh>
      
      {/* Mathematical Constant Zetta (Zeta) inside */}
      <Text
        position={[0, 0, 0]}
        fontSize={2.5}
        color="#0044ff"
        fillOpacity={0.8}
      >
        ζ
        <meshBasicMaterial color="#8a2be2" transparent opacity={0.6} blending={THREE.AdditiveBlending} />
      </Text>
    </group>
  )
}

export default function Hero3D() {
  return (
    <div className="absolute inset-0 z-0 opacity-100">
      <Canvas camera={{ position: [0, 0, 9], fov: 45 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 15, 10]} angle={0.4} penumbra={1} intensity={2} color="#ffffff" />
        <spotLight position={[-10, -15, -10]} angle={0.4} penumbra={1} intensity={1} color="#8a2be2" />
        <spotLight position={[0, 0, 10]} angle={0.2} penumbra={1} intensity={1} color="#00ccff" />
        
        <PresentationControls 
          global 
          rotation={[0, 0, 0]} 
          polar={[-0.1, 0.1]} 
          azimuth={[-0.3, 0.3]} 
        >
          <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.1}>
            <Monolith />
          </Float>
        </PresentationControls>
        
        <ContactShadows position={[0, -3.5, 0]} opacity={0.6} scale={12} blur={3} far={4} color="#000000" />
        <Environment preset="city" />
      </Canvas>
    </div>
  )
}
