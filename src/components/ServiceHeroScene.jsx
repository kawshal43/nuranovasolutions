import { Canvas, useFrame } from "@react-three/fiber";
import { Float, RoundedBox } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function LensStructure({ primary, secondary, glow }) {
  const groupRef = useRef(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    groupRef.current.rotation.y += delta * 0.18;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.55) * 0.08;
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.9) * 0.08;
  });

  return (
    <group ref={groupRef}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.95, 1.12, 1.4, 48, 1, true]} />
        <meshPhysicalMaterial
          color="#f8fbff"
          metalness={0.22}
          roughness={0.18}
          transmission={0.82}
          thickness={1.8}
          clearcoat={1}
          clearcoatRoughness={0.05}
          transparent
          opacity={0.96}
        />
      </mesh>

      {[0.52, 0.16, -0.22].map((z, index) => (
        <mesh key={z} position={[0, 0, z]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.08 + index * 0.13, 0.08, 24, 64]} />
          <meshPhysicalMaterial
            color={index === 1 ? secondary : primary}
            emissive={index === 1 ? secondary : glow}
            emissiveIntensity={0.58}
            metalness={0.35}
            roughness={0.08}
            transmission={0.28}
            clearcoat={1}
          />
        </mesh>
      ))}

      <mesh position={[0, 0, 0.18]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.62, 48]} />
        <meshPhysicalMaterial
          color="#0f172a"
          emissive={glow}
          emissiveIntensity={0.42}
          metalness={0.12}
          roughness={0.28}
        />
      </mesh>

      <mesh position={[0, 0, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.34, 48]} />
        <meshBasicMaterial color="#f8fbff" transparent opacity={0.88} />
      </mesh>
    </group>
  );
}

function FloatingFrame({ primary, secondary, position, rotation, scale = 1 }) {
  return (
    <Float speed={1.5} rotationIntensity={0.42} floatIntensity={0.8}>
      <group position={position} rotation={rotation} scale={scale}>
        <RoundedBox args={[1.4, 0.9, 0.08]} radius={0.12} smoothness={4}>
          <meshPhysicalMaterial
            color="#ffffff"
            transparent
            opacity={0.5}
            transmission={0.9}
            roughness={0.05}
            metalness={0.12}
          />
        </RoundedBox>
        <mesh position={[0, 0, 0.05]}>
          <planeGeometry args={[1.05, 0.12]} />
          <meshBasicMaterial color={primary} transparent opacity={0.9} />
        </mesh>
        <mesh position={[0, -0.2, 0.05]}>
          <planeGeometry args={[0.72, 0.08]} />
          <meshBasicMaterial color={secondary} transparent opacity={0.66} />
        </mesh>
      </group>
    </Float>
  );
}

function BackgroundOrbs({ primary, secondary, glow }) {
  const orbMaterial = useMemo(
    () => ({
      primary: new THREE.Color(primary),
      secondary: new THREE.Color(secondary),
      glow: new THREE.Color(glow),
    }),
    [glow, primary, secondary]
  );

  return (
    <>
      <Float speed={1.1} floatIntensity={1.6}>
        <mesh position={[-2.4, 1.3, -0.8]}>
          <sphereGeometry args={[0.38, 32, 32]} />
          <meshBasicMaterial color={orbMaterial.primary} transparent opacity={0.2} />
        </mesh>
      </Float>
      <Float speed={1.35} floatIntensity={1.8}>
        <mesh position={[2.2, -1.35, -1.1]}>
          <sphereGeometry args={[0.46, 32, 32]} />
          <meshBasicMaterial color={orbMaterial.secondary} transparent opacity={0.16} />
        </mesh>
      </Float>
      <Float speed={0.9} floatIntensity={1.2}>
        <mesh position={[0.3, 1.8, -1.7]}>
          <sphereGeometry args={[0.26, 32, 32]} />
          <meshBasicMaterial color={orbMaterial.glow} transparent opacity={0.18} />
        </mesh>
      </Float>
    </>
  );
}

export default function ServiceHeroScene({ accent }) {
  const primary = accent?.primary ?? "#60a5fa";
  const secondary = accent?.secondary ?? "#a78bfa";
  const glow = accent?.glow ?? "#93c5fd";

  return (
    <Canvas
      dpr={[1, 1.8]}
      camera={{ position: [0, 0.2, 5.6], fov: 34 }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={1.15} />
      <directionalLight position={[3.5, 4.5, 3]} intensity={1.8} color={primary} />
      <directionalLight position={[-3, 2.2, 2]} intensity={1.25} color={secondary} />
      <pointLight position={[0, 0, 4]} intensity={18} color={glow} distance={9} />
      <pointLight position={[0, -1.4, 2.8]} intensity={10} color={secondary} distance={6} />

      <BackgroundOrbs primary={primary} secondary={secondary} glow={glow} />

      <Float speed={1.4} floatIntensity={0.65} rotationIntensity={0.18}>
        <group scale={1.14}>
          <LensStructure primary={primary} secondary={secondary} glow={glow} />
        </group>
      </Float>

      <FloatingFrame
        primary={primary}
        secondary={secondary}
        position={[-1.9, -0.45, 0.6]}
        rotation={[0.1, 0.55, -0.18]}
        scale={0.95}
      />
      <FloatingFrame
        primary={secondary}
        secondary={glow}
        position={[1.95, 0.8, -0.2]}
        rotation={[-0.14, -0.55, 0.18]}
        scale={0.78}
      />
    </Canvas>
  );
}
