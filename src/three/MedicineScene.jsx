
import { Canvas } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  OrbitControls,
} from "@react-three/drei";

import MedicineBottle from "./MedicineBottle";
import FloatingCapsules from "./FloatingCapsules";

export default function MedicineScene() {
  return (
    <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
      {/* Lighting */}
      <ambientLight intensity={1.5} />
      <directionalLight position={[4, 5, 5]} intensity={2} />

      {/* Environment */}
      <Environment preset="city" />

      {/* 3D Objects */}
      <MedicineBottle />
      <FloatingCapsules />

      {/* Shadows */}
      <ContactShadows
        position={[0, -2, 0]}
        opacity={0.35}
        scale={8}
        blur={2}
      />

      {/* Camera Controls */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </Canvas>
  );
}
