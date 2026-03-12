import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Mesh } from 'three';
import { RoundedBox, Trail } from '@react-three/drei';

interface PlayerCarProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  tilt: number;
}

export const PlayerCar: React.FC<PlayerCarProps> = ({ position, rotation = [0, 0, 0], tilt }) => {
  const groupRef = useRef<Group>(null);
  const wheelRotationRef = useRef(0);

  useFrame((state, delta) => {
    wheelRotationRef.current -= delta * 15; // Faster wheel spin visual
    if (groupRef.current) {
        groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 20) * 0.01;
        // Smooth Tilt
        groupRef.current.rotation.z = -tilt * 0.3;
        groupRef.current.rotation.x = -0.02; 
    }
  });

  const bodyColor = "#050505";
  const neonColor = "#00f3ff";
  const tailLightColor = "#ff0055";

  return (
    <group ref={groupRef} position={position} rotation={[rotation[0], rotation[1], rotation[2]]}>
      
      {/* Dynamic Underglow Light */}
      <pointLight position={[0, 0.5, 0]} distance={5} intensity={5} color="#00f3ff" />

      {/* Light Trails - The essence of Retrowave speed */}
      <Trail width={1.2} length={8} color="#ff0055" attenuation={(t) => t * t}>
         <mesh position={[0.6, 0.5, -1.9]} />
      </Trail>
      <Trail width={1.2} length={8} color="#ff0055" attenuation={(t) => t * t}>
         <mesh position={[-0.6, 0.5, -1.9]} />
      </Trail>

      {/* --- CHASSIS --- */}
      {/* Main Body - Sleeker */}
      <group position={[0, 0.4, 0]}>
        <RoundedBox args={[1.8, 0.5, 4.2]} radius={0.1} smoothness={4}>
            <meshStandardMaterial color={bodyColor} metalness={0.9} roughness={0.1} envMapIntensity={1.5} />
        </RoundedBox>
      </group>

      {/* Cabin / Windshield - Tapered */}
      <group position={[0, 0.8, -0.3]}>
         <RoundedBox args={[1.3, 0.5, 2.0]} radius={0.1} smoothness={4}>
            <meshStandardMaterial color="#000" metalness={1} roughness={0} />
         </RoundedBox>
      </group>
      
      {/* Neon Strips on Hood */}
      <mesh position={[0.4, 0.66, 1.2]} rotation={[0.05, 0, 0]}>
         <boxGeometry args={[0.1, 0.02, 1.2]} />
         <meshBasicMaterial color={neonColor} />
      </mesh>
      <mesh position={[-0.4, 0.66, 1.2]} rotation={[0.05, 0, 0]}>
         <boxGeometry args={[0.1, 0.02, 1.2]} />
         <meshBasicMaterial color={neonColor} />
      </mesh>

      {/* Rear Spoiler */}
      <group position={[0, 0.85, -2.0]}>
        <mesh position={[0, 0.1, 0]}>
            <boxGeometry args={[2.2, 0.05, 0.5]} />
            <meshStandardMaterial color={bodyColor} metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[-0.8, -0.2, 0]}>
            <boxGeometry args={[0.1, 0.4, 0.3]} />
            <meshStandardMaterial color={bodyColor} />
        </mesh>
        <mesh position={[0.8, -0.2, 0]}>
            <boxGeometry args={[0.1, 0.4, 0.3]} />
            <meshStandardMaterial color={bodyColor} />
        </mesh>
        {/* Spoiler Neon Edge */}
        <mesh position={[0, 0.13, -0.25]}>
            <boxGeometry args={[2.2, 0.02, 0.02]} />
            <meshBasicMaterial color={neonColor} />
        </mesh>
      </group>

      {/* --- LIGHTS --- */}
      {/* Headlights */}
      <mesh position={[-0.6, 0.45, 2.1]}>
        <boxGeometry args={[0.5, 0.15, 0.1]} />
        <meshStandardMaterial color={neonColor} emissive={neonColor} emissiveIntensity={5} toneMapped={false} />
      </mesh>
      <mesh position={[0.6, 0.45, 2.1]}>
        <boxGeometry args={[0.5, 0.15, 0.1]} />
        <meshStandardMaterial color={neonColor} emissive={neonColor} emissiveIntensity={5} toneMapped={false} />
      </mesh>
      
      {/* Rear Taillight Strip */}
      <mesh position={[0, 0.5, -2.11]}>
        <boxGeometry args={[1.7, 0.1, 0.05]} />
        <meshStandardMaterial color={tailLightColor} emissive={tailLightColor} emissiveIntensity={4} toneMapped={false} />
      </mesh>


      {/* --- WHEELS --- */}
      <Wheel x={0.9} z={1.3} rotation={wheelRotationRef} />
      <Wheel x={-0.9} z={1.3} rotation={wheelRotationRef} />
      <Wheel x={0.9} z={-1.3} rotation={wheelRotationRef} />
      <Wheel x={-0.9} z={-1.3} rotation={wheelRotationRef} />
    </group>
  );
};

const Wheel: React.FC<{ x: number; z: number; rotation: React.MutableRefObject<number> }> = ({ x, z, rotation }) => {
    const meshRef = useRef<Mesh>(null);
    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.rotation.x = rotation.current;
        }
    });

    return (
        <group position={[x, 0.35, z]}>
            <group ref={meshRef}>
                 {/* Tire */}
                <mesh rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.35, 0.35, 0.3, 32]} />
                    <meshStandardMaterial color="#111" roughness={0.8} />
                </mesh>
                {/* Neon Rim */}
                <mesh rotation={[0, 0, Math.PI / 2]}>
                    <torusGeometry args={[0.2, 0.02, 16, 32]} />
                    <meshStandardMaterial color="#00f3ff" emissive="#00f3ff" emissiveIntensity={2} toneMapped={false}/>
                </mesh>
                {/* Spokes */}
                <mesh rotation={[0, 0, Math.PI / 2]}>
                     <cylinderGeometry args={[0.22, 0.22, 0.05, 6]} />
                     <meshStandardMaterial color="#333" metalness={1} />
                </mesh>
            </group>
        </group>
    )
}