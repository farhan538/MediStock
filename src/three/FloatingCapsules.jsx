
import { Float } from "@react-three/drei";

function Capsule({ position, color, rotation }) {
  return (
    <Float speed={2} floatIntensity={0.8}>
      <mesh position={position} rotation={rotation}>
        <capsuleGeometry args={[0.18, 0.55, 8, 16]} />
        <meshStandardMaterial
          color={color}
          roughness={0.25}
          metalness={0.15}
        />
      </mesh>
    </Float>
  );
}

export default function FloatingCapsules() {
  return (
    <>
      <Capsule
        position={[-2, 1.5, 0]}
        color="#13b981"
        rotation={[0.5, 0.3, 0.8]}
      />

      <Capsule
        position={[2, -0.8, 0.5]}
        color="#f5c46a"
        rotation={[0.4, 0.2, -0.6]}
      />

      <Capsule
        position={[1.8, 1.8, -1]}
        color="#ffffff"
        rotation={[0.8, 0.5, 0.3]}
      />
    </>
  );
}
