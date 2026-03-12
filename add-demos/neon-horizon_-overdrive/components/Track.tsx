import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color, Mesh, ShaderMaterial, Vector3, CatmullRomCurve3 } from 'three';
import { MeshReflectorMaterial, useTexture, Instances, Instance } from '@react-three/drei';
import { useGameStore } from '../store';
import * as THREE from 'three';

const ROAD_WIDTH = 10;
const ROAD_LENGTH = 300; // Longer draw distance

export const Track: React.FC = () => {
    return (
        <group>
            {/* The Reflective Road */}
            <RoadSurface />

            {/* Moving Wireframe Terrain */}
            <Terrain side="left" />
            <Terrain side="right" />

            {/* Guard Rails */}
            <NeonGuardRails />
            
            {/* Retro Sun */}
            <RetroSun />
            
            {/* Distant Grid fade */}
            <DistantGrid />
        </group>
    );
};

const RoadSurface: React.FC = () => {
    const { speed } = useGameStore();
    const textureRef = useRef<any>(null);
    const offset = useRef(0);

    // Create a grid texture for the roughness map/emissive map
    const gridTexture = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1024;
        const context = canvas.getContext('2d');
        if (context) {
            context.fillStyle = '#000000';
            context.fillRect(0, 0, 1024, 1024);
            
            // Draw Grid
            context.strokeStyle = '#555555';
            context.lineWidth = 4;
            
            // Vertical lines
            for(let i=0; i<=1024; i+=128) {
                 context.beginPath();
                 context.moveTo(i, 0);
                 context.lineTo(i, 1024);
                 context.stroke();
            }
            // Horizontal lines
            for(let i=0; i<=1024; i+=128) {
                 context.beginPath();
                 context.moveTo(0, i);
                 context.lineTo(1024, i);
                 context.stroke();
            }
        }
        const t = new THREE.CanvasTexture(canvas);
        t.wrapS = THREE.RepeatWrapping;
        t.wrapT = THREE.RepeatWrapping;
        t.repeat.set(10, 40);
        t.anisotropy = 16;
        return t;
    }, []);

    useFrame((state, delta) => {
        offset.current -= speed * delta * 0.05;
        if(gridTexture) {
            gridTexture.offset.y = offset.current;
        }
    });

    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -ROAD_LENGTH/2 + 20]}>
            <planeGeometry args={[ROAD_WIDTH, ROAD_LENGTH]} />
            <MeshReflectorMaterial
                blur={[400, 100]}
                resolution={1024}
                mixBlur={1}
                mixStrength={50} // Strength of the reflection
                roughness={0.4}
                depthScale={1.2}
                minDepthThreshold={0.4}
                maxDepthThreshold={1.4}
                color="#050505"
                metalness={0.8}
                roughnessMap={gridTexture}
            />
        </mesh>
    )
}

const Terrain: React.FC<{side: "left" | "right"}> = ({ side }) => {
    const { speed } = useGameStore();
    const meshRef = useRef<Mesh>(null);
    
    // Custom shader for moving terrain
    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uSpeed: { value: 0 },
        uColor: { value: new Color(side === 'left' ? '#ff00aa' : '#00ffff') }
    }), [side]);

    useFrame((state, delta) => {
        if (meshRef.current) {
            const material = meshRef.current.material as ShaderMaterial;
            material.uniforms.uTime.value += delta * speed * 0.2;
            material.uniforms.uSpeed.value = speed;
        }
    });

    const xPos = side === 'left' ? -35 : 35;

    return (
        <mesh 
            ref={meshRef} 
            rotation={[-Math.PI / 2, 0, 0]} 
            position={[xPos, -2, -100]}
        >
            <planeGeometry args={[60, 400, 40, 40]} />
            <shaderMaterial
                uniforms={uniforms}
                wireframe={true}
                transparent={true}
                vertexShader={`
                    uniform float uTime;
                    varying float vElevation;
                    varying vec2 vUv;
                    
                    // Simple noise function
                    float random (in vec2 st) {
                        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
                    }
                    float noise (in vec2 st) {
                        vec2 i = floor(st);
                        vec2 f = fract(st);
                        float a = random(i);
                        float b = random(i + vec2(1.0, 0.0));
                        float c = random(i + vec2(0.0, 1.0));
                        float d = random(i + vec2(1.0, 1.0));
                        vec2 u = f * f * (3.0 - 2.0 * f);
                        return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
                    }

                    void main() {
                        vUv = uv;
                        vec3 pos = position;
                        
                        // Scroll the noise map along Y (which is Z in world space due to rotation)
                        // uv.y is 0..1 along the 400 length.
                        float scroll = uTime;
                        
                        float n = noise(vec2(uv.x * 3.0, uv.y * 10.0 + scroll));
                        
                        // Elevation based on noise
                        pos.z += n * 15.0; // Height of mountains
                        
                        // Flatten near the road
                        if (uv.x < 0.1 || uv.x > 0.9) {
                           pos.z *= 0.2;
                        }

                        vElevation = pos.z;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                    }
                `}
                fragmentShader={`
                    uniform vec3 uColor;
                    varying float vElevation;
                    varying vec2 vUv;

                    void main() {
                        // Fade out in distance
                        float alpha = 1.0 - smoothstep(0.0, 0.9, vUv.y); // Fade at top (far away)
                        
                        // Brighter peaks
                        vec3 color = uColor + (vElevation * 0.05);
                        
                        gl_FragColor = vec4(color, alpha * 0.5);
                    }
                `}
            />
        </mesh>
    );
}

const NeonGuardRails: React.FC = () => {
    const { speed } = useGameStore();
    const refLeft = useRef<any>(null);
    const refRight = useRef<any>(null);
    
    // Animate texture offset to simulate motion
    useFrame((state, delta) => {
       if (refLeft.current) refLeft.current.offset.x -= speed * delta * 0.05;
       if (refRight.current) refRight.current.offset.x -= speed * delta * 0.05;
    });
    
    const texture = useMemo(() => {
        const c = document.createElement('canvas');
        c.width = 64; 
        c.height = 64;
        const ctx = c.getContext('2d');
        if(ctx){
            ctx.fillStyle = '#000000';
            ctx.fillRect(0,0,64,64);
            ctx.fillStyle = '#00f3ff';
            ctx.fillRect(0, 10, 32, 44); // Dashed pattern
        }
        const t = new THREE.CanvasTexture(c);
        t.wrapS = THREE.RepeatWrapping;
        t.wrapT = THREE.RepeatWrapping;
        t.repeat.set(40, 1);
        return t;
    }, []);

    return (
        <group>
             {/* Left Rail */}
             <mesh position={[-ROAD_WIDTH/2 - 0.5, 1, -ROAD_LENGTH/2 + 20]}>
                <boxGeometry args={[0.5, 1.5, ROAD_LENGTH]} />
                <meshStandardMaterial 
                    map={texture} 
                    color="#00f3ff" 
                    emissive="#00f3ff" 
                    emissiveMap={texture} 
                    emissiveIntensity={2} 
                >
                    {/* Access texture for animation */}
                    <primitive attach="map" object={texture} ref={refLeft} />
                </meshStandardMaterial>
             </mesh>

             {/* Right Rail */}
             <mesh position={[ROAD_WIDTH/2 + 0.5, 1, -ROAD_LENGTH/2 + 20]}>
                <boxGeometry args={[0.5, 1.5, ROAD_LENGTH]} />
                <meshStandardMaterial 
                    map={texture} 
                    color="#00f3ff" 
                    emissive="#00f3ff" 
                    emissiveMap={texture} 
                    emissiveIntensity={2}
                 >
                     <primitive attach="map" object={texture} ref={refRight} />
                 </meshStandardMaterial>
             </mesh>
        </group>
    )
}

const RetroSun: React.FC = () => {
    const sunRef = useRef<THREE.Mesh>(null);
    
    useFrame((state) => {
        if(sunRef.current) {
            sunRef.current.position.y = 30 + Math.sin(state.clock.elapsedTime * 0.2) * 2;
        }
    })

    return (
        <mesh position={[0, 30, -250]} ref={sunRef}>
            <circleGeometry args={[60, 64]} />
            <shaderMaterial
                transparent
                uniforms={{
                    uTime: { value: 0 },
                    color1: { value: new Color('#ffbd00') }, // Yellow top
                    color2: { value: new Color('#ff0055') }  // Pink bottom
                }}
                vertexShader={`
                    varying vec2 vUv;
                    void main() {
                        vUv = uv;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `}
                fragmentShader={`
                    uniform vec3 color1;
                    uniform vec3 color2;
                    varying vec2 vUv;
                    void main() {
                        vec3 color = mix(color2, color1, vUv.y);
                        
                        // Sun stripes
                        float stripe = fract((vUv.y - 0.05) * 12.0); // 12 stripes
                        float gap = smoothstep(0.4, 0.5, stripe) - smoothstep(0.8, 0.9, stripe);
                        
                        // Make cuts bigger at the bottom
                        float threshold = 0.5 + (1.0 - vUv.y) * 0.4; 
                        
                        if (vUv.y < 0.6 && mod(vUv.y * 20.0, 1.0) < (0.2 + (0.6 - vUv.y))) {
                           discard;
                        }
                        
                        gl_FragColor = vec4(color, 1.0);
                    }
                `}
            />
            {/* Glow behind sun */}
            <mesh position={[0,0,-1]}>
                 <circleGeometry args={[65, 32]} />
                 <meshBasicMaterial color="#ff0055" transparent opacity={0.5} />
            </mesh>
        </mesh>
    );
};

const DistantGrid: React.FC = () => {
    // A faded grid in the sky/background to simulate cyberspace
    return (
        <mesh position={[0, 50, -300]} rotation={[-Math.PI/4, 0, 0]}>
            <planeGeometry args={[500, 200]} />
            <meshBasicMaterial 
                color="#220033" 
                transparent 
                opacity={0.3} 
                side={THREE.DoubleSide}
                wireframe
             />
        </mesh>
    )
}