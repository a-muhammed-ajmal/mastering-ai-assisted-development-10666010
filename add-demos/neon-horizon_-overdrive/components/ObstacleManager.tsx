import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { InstancedMesh, Object3D, Color, Quaternion, Euler } from 'three';
import { useGameStore } from '../store';

const ROAD_WIDTH = 10;
const SPAWN_DISTANCE = -200; // Further spawn
const REMOVE_DISTANCE = 20;
const MAX_OBSTACLES = 40;

interface ObstacleManagerProps {
    playerX: number;
}

export const ObstacleManager: React.FC<ObstacleManagerProps> = ({ playerX }) => {
    const { speed, status, endGame, increaseScore } = useGameStore();
    const meshRef = useRef<InstancedMesh>(null);
    const dummy = useMemo(() => new Object3D(), []);
    
    // [x, z, active (0/1), type (0-2), rotationOffset, scale]
    const [obstacles] = useState<Float32Array>(new Float32Array(MAX_OBSTACLES * 6));
    
    const lastSpawnTime = useRef(0);
    const passedObstacles = useRef<Set<number>>(new Set());

    useFrame((state, delta) => {
        if (status !== 'PLAYING') return;

        const time = state.clock.getElapsedTime();
        const obstacleData = obstacles;
        
        // Spawn Logic
        const spawnRate = Math.max(0.4, 1.5 - (speed * 0.03));
        
        if (time - lastSpawnTime.current > spawnRate) {
            for (let i = 0; i < MAX_OBSTACLES; i++) {
                if (obstacleData[i * 6 + 2] === 0) {
                    obstacleData[i * 6 + 0] = (Math.random() - 0.5) * (ROAD_WIDTH - 2); // Random X
                    obstacleData[i * 6 + 1] = SPAWN_DISTANCE; // Start Z
                    obstacleData[i * 6 + 2] = 1; // Active
                    obstacleData[i * 6 + 3] = Math.floor(Math.random() * 3); // Type
                    obstacleData[i * 6 + 4] = Math.random() * Math.PI; // Rot Offset
                    obstacleData[i * 6 + 5] = 0.8 + Math.random() * 0.5; // Scale
                    lastSpawnTime.current = time;
                    break;
                }
            }
        }

        // Update Positions & Collision
        if (meshRef.current) {
            for (let i = 0; i < MAX_OBSTACLES; i++) {
                if (obstacleData[i * 6 + 2] === 1) {
                    obstacleData[i * 6 + 1] += speed * delta;
                    
                    const x = obstacleData[i * 6 + 0];
                    const z = obstacleData[i * 6 + 1];
                    const rotOffset = obstacleData[i * 6 + 4];
                    const scale = obstacleData[i * 6 + 5];

                    // Collision Check
                    if (z > -2.5 && z < 2.5) {
                        // Tighter collision box for crystals
                        if (Math.abs(x - playerX) < 1.5) {
                            endGame();
                        }
                    }
                    
                    // Scoring
                    if (z > 3 && !passedObstacles.current.has(i)) {
                        increaseScore(100);
                        passedObstacles.current.add(i);
                    }

                    // Despawn
                    if (z > REMOVE_DISTANCE) {
                        obstacleData[i * 6 + 2] = 0;
                        passedObstacles.current.delete(i);
                    }

                    // Animate: Spin the crystal
                    dummy.position.set(x, 1.0, z);
                    
                    // Complex Rotation
                    dummy.rotation.set(
                        time * 2 + rotOffset, 
                        time * 3 + rotOffset, 
                        0
                    );
                    
                    dummy.scale.setScalar(scale);
                    dummy.updateMatrix();
                    meshRef.current.setMatrixAt(i, dummy.matrix);
                    
                    // Color cycling (requires instanceColor update if we want variation, but static neon is fine)
                    // meshRef.current.setColorAt(i, new Color().setHSL((time * 0.5 + i * 0.1) % 1, 1, 0.5));
                } else {
                    dummy.position.set(0, -100, 0);
                    dummy.updateMatrix();
                    meshRef.current.setMatrixAt(i, dummy.matrix);
                }
            }
            meshRef.current.instanceMatrix.needsUpdate = true;
        }
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, MAX_OBSTACLES]}>
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial 
                color="#ff0033" 
                emissive="#ff0033" 
                emissiveIntensity={3}
                roughness={0}
                metalness={1}
                toneMapped={false}
            />
        </instancedMesh>
    );
};