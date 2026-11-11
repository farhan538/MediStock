
import { Float } from "@react-three/drei";

export default function MedicineBottle() {
  return (
    <Float
      speed={2}
      rotationIntensity={0.2}
      floatIntensity={0.5}
    >
      <group position={[0, 0, 0]}>

        {/* Bottle Body */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.85, 0.85, 2.1, 64]} />
          <meshPhysicalMaterial
            color="#d9fff1"
            roughness={0.2}
            metalness={0.1}
            transmission={0.2}
            thickness={0.5}
          />
        </mesh>

        {/* Bottle Neck */}
        <mesh position={[0, 1.2, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.4, 48]} />
          <meshStandardMaterial color="#a7e8d2" />
        </mesh>

        {/* Bottle Cap */}
        <mesh position={[0, 1.55, 0]}>
          <cylinderGeometry args={[0.48, 0.48, 0.35, 48]} />
          <meshStandardMaterial color="#087f5b" />
        </mesh>

        {/* Medicine Label */}
        <mesh position={[0, 0, 0.855]}>
          <boxGeometry args={[1.25, 0.85, 0.025]} />
          <meshStandardMaterial color="#087f5b" />
        </mesh>

      </group>
    </Float>
  );
}
