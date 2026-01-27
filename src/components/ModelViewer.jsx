import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useLayoutEffect, useRef } from "react";

function FitModel({ url, fit = 2.6 }) {
  const { scene } = useGLTF(url);
  const ref = useRef();

  useLayoutEffect(() => {
    if (!ref.current) return;

    const box = new THREE.Box3().setFromObject(ref.current);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    ref.current.position.sub(center);

    const maxAxis = Math.max(size.x, size.y, size.z);
    const scale = fit / maxAxis;
    ref.current.scale.setScalar(scale);
  }, [fit]);

  return <primitive ref={ref} object={scene} />;
}

export default function ModelViewer({
  url = "/models/IphoneBlack.glb",
  height = 160,
  fit = 3,
}) {
  return (
    <div style={{ width: "100%", height }}>
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <directionalLight position={[-5, 2, -2]} intensity={0.6} />

        <FitModel url={url} fit={fit} />

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          autoRotate={true}
          autoRotateSpeed={0.2}
          enableDamping={true}
          dampingFactor={0.08}
        />
      </Canvas>
    </div>
  );
}
