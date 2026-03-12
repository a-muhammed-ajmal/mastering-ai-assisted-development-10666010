import React, { useState, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Stars, Environment } from '@react-three/drei';
import { PlayerCar } from './PlayerCar';
import { Track } from './Track';
import { ObstacleManager } from './ObstacleManager';
import { useGameStore } from '../store';
import { Vector3, MathUtils, SpotLight } from 'three';
import * as THREE from 'three';

export const Scene: React.FC = () => {
  const { status, speed, setSpeed } = useGameStore();
  const [playerX, setPlayerX] = useState(0);
  const [tilt, setTilt] = useState(0);
  
  // Input Handling
  const keys = useRef<{ [key: string]: boolean }>({});
  
  useEffect(() => {
      const onKeyDown = (e: KeyboardEvent) => keys.current[e.code] = true;
      const onKeyUp = (e: KeyboardEvent) => keys.current[e.code] = false;
      window.addEventListener('keydown', onKeyDown);
      window.addEventListener('keyup', onKeyUp);
      return () => {
          window.removeEventListener('keydown', onKeyDown);
          window.removeEventListener('keyup', onKeyUp);
      }
  }, []);

  // Camera Logic
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  useFrame((state, delta) => {
    if (status === 'PLAYING') {
        // Speed scaling (Acceleration)
        if (speed < 120) { // Higher top speed
            setSpeed(speed + delta * 3); 
        }

        // Horizontal Movement
        let move = 0;
        if (keys.current['ArrowLeft'] || keys.current['KeyA']) move -= 1;
        if (keys.current['ArrowRight'] || keys.current['KeyD']) move += 1;

        const newX = playerX + move * delta * 20; // Faster steering
        const clampedX = MathUtils.clamp(newX, -4.5, 4.5);
        setPlayerX(clampedX);

        // Calculate Tilt
        const targetTilt = move * 0.6;
        setTilt(MathUtils.lerp(tilt, targetTilt, 0.1));
    }

    // Dynamic Camera
    if (cameraRef.current) {
        // Camera lags slightly behind car for weight
        const targetX = playerX * 0.5;
        // Camera moves lower and closer as speed increases for intensity
        const speedFactor = Math.min(speed / 100, 1);
        const targetY = 3.5 - speedFactor * 1.0; 
        const targetZ = 7 + speedFactor * 2;
        
        // Shake
        const shakeIntensity = speed * 0.0005;
        const shakeX = (Math.random() - 0.5) * shakeIntensity;
        const shakeY = (Math.random() - 0.5) * shakeIntensity;
        
        cameraRef.current.position.lerp(new Vector3(targetX, targetY, targetZ), 0.1);
        cameraRef.current.position.x += shakeX;
        cameraRef.current.position.y += shakeY;

        // Look at car with slight offset ahead
        cameraRef.current.lookAt(playerX * 0.3, 0, -10);
        
        // FOV warp
        const targetFOV = 70 + (speed * 0.3);
        cameraRef.current.fov = MathUtils.lerp(cameraRef.current.fov, targetFOV, 0.05);
        cameraRef.current.updateProjectionMatrix();
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault ref={cameraRef} position={[0, 4, 8]} fov={75} />
      
      {/* Dynamic Environment for Metallic Reflections */}
      {/* We use a city preset to give interesting reflections on the car body */}
      <Environment preset="city" /> 

      {/* Lighting */}
      <ambientLight intensity={0.1} color="#4400ff" />
      
      {/* Neon Fill Lights */}
      <pointLight position={[20, 10, 5]} intensity={2} color="#ff00d4" distance={50} />
      <pointLight position={[-20, 10, 5]} intensity={2} color="#00f3ff" distance={50} />
      
      {/* Fog - Exponential for smooth fade */}
      <color attach="background" args={['#050011']} />
      <fogExp2 attach="fog" args={['#050011', 0.015]} /> 
      
      <Stars radius={200} depth={100} count={8000} factor={6} saturation={0} fade speed={3} />

      {/* Game Objects */}
      <PlayerCar position={[playerX, 0, 0]} tilt={tilt} />
      <Track />
      <ObstacleManager playerX={playerX} />
    </>
  );
};