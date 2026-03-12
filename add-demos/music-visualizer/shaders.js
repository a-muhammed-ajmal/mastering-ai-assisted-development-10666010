export const commonVertexShader = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

export const shaders = [
    {
        name: "Neon Tunnel",
        fragmentShader: `
            uniform float uTime;
            uniform vec2 uResolution;
            uniform float uBass;
            uniform float uMid;
            uniform float uTreble;

            varying vec2 vUv;

            void main() {
                vec2 uv = (vUv - 0.5) * 2.0;
                uv.x *= uResolution.x / uResolution.y;

                float r = length(uv);
                float a = atan(uv.y, uv.x);

                float time = uTime * 0.5;
                
                // Distort tunnel with bass
                float distortion = sin(a * 10.0 + time) * uBass * 0.1;
                
                // Tunnel effect
                vec2 p = vec2(0.5 / r + time + distortion, a / 3.14159);
                
                // Grid pattern
                float grid = sin(p.x * 20.0) * sin(p.y * 20.0);
                
                // Color mixing
                vec3 col = vec3(0.0);
                
                col += vec3(0.5, 0.0, 1.0) * abs(sin(p.x * 10.0 + time)) * uBass * 2.0; // Purple bass
                col += vec3(0.0, 1.0, 1.0) * abs(sin(p.y * 10.0 - time)) * uMid * 2.0;  // Cyan mids
                
                // Glow in center
                col += vec3(1.0, 1.0, 1.0) * (0.05 / r) * uTreble;

                // Scanlines
                col *= 0.8 + 0.2 * sin(vUv.y * uResolution.y * 0.5);

                gl_FragColor = vec4(col, 1.0);
            }
        `
    },
    {
        name: "Kaleidoscopic Realm",
        fragmentShader: `
            uniform float uTime;
            uniform vec2 uResolution;
            uniform float uBass;
            uniform float uMid;
            uniform float uTreble;

            varying vec2 vUv;

            vec3 palette( float t ) {
                vec3 a = vec3(0.5, 0.5, 0.5);
                vec3 b = vec3(0.5, 0.5, 0.5);
                vec3 c = vec3(1.0, 1.0, 1.0);
                vec3 d = vec3(0.263,0.416,0.557);
                return a + b*cos( 6.28318*(c*t+d) );
            }

            void main() {
                vec2 uv = (vUv - 0.5) * 2.0;
                uv.x *= uResolution.x / uResolution.y;
                vec2 uv0 = uv;
                vec3 finalColor = vec3(0.0);
                
                float dynamicBass = 1.0 + uBass * 0.5;

                for (float i = 0.0; i < 4.0; i++) {
                    uv = fract(uv * 1.5) - 0.5;
                    float d = length(uv) * exp(-length(uv0));
                    vec3 col = palette(length(uv0) + i*.4 + uTime*.4);
                    d = sin(d*8.0 + uTime)/8.0;
                    d = abs(d);
                    d = pow(0.01 / d, 1.2);
                    finalColor += col * d;
                }
                
                // Reactivity
                finalColor *= 0.5 + 0.5 * uMid;
                finalColor.r *= 1.0 + uBass;
                finalColor.b *= 1.0 + uTreble;

                gl_FragColor = vec4(finalColor, 1.0);
            }
        `
    },
    {
        name: "Retro Grid",
        fragmentShader: `
            uniform float uTime;
            uniform vec2 uResolution;
            uniform float uBass;
            uniform float uMid;
            uniform float uTreble;

            varying vec2 vUv;

            void main() {
                vec2 uv = (vUv - 0.5) * 2.0;
                uv.x *= uResolution.x / uResolution.y;

                // 3D Projection illusion
                float horizon = 0.0;
                float fov = 0.5;
                
                vec3 col = vec3(0.0);
                
                if (uv.y < horizon) {
                    // Ground
                    float z = fov / (horizon - uv.y);
                    float x = uv.x * z;
                    
                    float speed = uTime * 2.0;
                    float gridX = step(0.98, fract(x + sin(z * 0.5 + uTime) * uBass));
                    float gridZ = step(0.98, fract(z + speed));
                    
                    vec3 gridColor = vec3(1.0, 0.0, 1.0) * (uBass * 2.0 + 0.5);
                    col += (gridX + gridZ) * gridColor * z * 0.1;
                    
                    // Fade to horizon
                    col *= smoothstep(0.0, 0.5, abs(uv.y));
                } else {
                    // Sky
                    float star = step(0.995, fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453));
                    col += vec3(star) * uTreble;
                    
                    // Sun
                    float sunDist = length(uv - vec2(0.0, 0.3));
                    if (sunDist < 0.2) {
                         float sunStripes = step(0.1, abs(sin(uv.y * 50.0 + uTime)));
                         col += vec3(1.0, 0.5, 0.0) * (1.0 - sunDist * 2.0);
                         if (uv.y > 0.1 && uv.y < 0.5) col *= sunStripes;
                    }
                    
                    // Background glow
                    col += vec3(0.2, 0.0, 0.4) * (1.0 - uv.y);
                }

                gl_FragColor = vec4(col, 1.0);
            }
        `
    },
    {
        name: "Spectral Circular",
        fragmentShader: `
            uniform float uTime;
            uniform vec2 uResolution;
            uniform float uBass;
            uniform float uMid;
            uniform float uTreble;
            uniform sampler2D uAudioTexture; // We will pass FFT data here if possible, but fallback to simple vars

            varying vec2 vUv;

            #define PI 3.14159265359

            void main() {
                vec2 uv = (vUv - 0.5) * 2.0;
                uv.x *= uResolution.x / uResolution.y;
                
                float r = length(uv);
                float a = atan(uv.y, uv.x);
                float angle01 = (a + PI) / (2.0 * PI);
                
                // Simulate spectrum bars using noise/sin if texture not available or just for style
                float bars = sin(a * 50.0);
                float barHeight = 0.2 + 0.1 * sin(a * 10.0 + uTime) + uBass * 0.3;
                
                // Additional random height variation based on angle
                barHeight += sin(a * 20.0) * uMid * 0.2;
                
                vec3 col = vec3(0.0);
                
                // Circle line
                if (r < barHeight && r > 0.15) {
                    float intensity = smoothstep(barHeight - 0.02, barHeight, r);
                    col = mix(vec3(0.0, 0.5, 1.0), vec3(1.0, 0.0, 0.5), r * 2.0);
                    col *= 1.0 - intensity; // Fade out edges
                    
                    // Individual bar separation
                    col *= smoothstep(0.0, 0.2, abs(bars));
                }
                
                // Inner glow
                col += vec3(0.0, 1.0, 0.5) * (0.05 / r) * uBass;

                gl_FragColor = vec4(col, 1.0);
            }
        `
    }
];
