
// Configuration
const N = 128;
const ITER = 4;
const SCALE = 4; // Scale of the grid relative to simulation calculation
let diffusion = 0.0001;
let viscosity = 0.0000001; // Low viscosity for swirly fluids

// Arrays
let size = (N + 2) * (N + 2);
let u = new Float32Array(size); // Velocity X
let v = new Float32Array(size); // Velocity Y
let u_prev = new Float32Array(size);
let v_prev = new Float32Array(size);
let dens = new Float32Array(size); // Density (smoke)
let dens_prev = new Float32Array(size);

let ctx;
let width, height;
let canvas;
let canvasScaleX, canvasScaleY;

// Color cycling
let currentHue = 0;

function IX(x, y) {
    return x + (N + 2) * y;
}

function add_source(x, s, dt) {
    for (let i = 0; i < size; i++) {
        x[i] += dt * s[i];
    }
}

function set_bnd(b, x) {
    for (let i = 1; i <= N; i++) {
        x[IX(0, i)] = b === 1 ? -x[IX(1, i)] : x[IX(1, i)];
        x[IX(N + 1, i)] = b === 1 ? -x[IX(N, i)] : x[IX(N, i)];
        x[IX(i, 0)] = b === 2 ? -x[IX(i, 1)] : x[IX(i, 1)];
        x[IX(i, N + 1)] = b === 2 ? -x[IX(i, N)] : x[IX(i, N)];
    }
    x[IX(0, 0)] = 0.5 * (x[IX(1, 0)] + x[IX(0, 1)]);
    x[IX(0, N + 1)] = 0.5 * (x[IX(1, N + 1)] + x[IX(0, N)]);
    x[IX(N + 1, 0)] = 0.5 * (x[IX(N, 0)] + x[IX(N + 1, 1)]);
    x[IX(N + 1, N + 1)] = 0.5 * (x[IX(N, N + 1)] + x[IX(N + 1, N)]);
}

function lin_solve(b, x, x0, a, c) {
    let cRecip = 1.0 / c;
    for (let k = 0; k < ITER; k++) {
        for (let j = 1; j <= N; j++) {
            for (let i = 1; i <= N; i++) {
                x[IX(i, j)] = (x0[IX(i, j)] + a * (x[IX(i + 1, j)] + x[IX(i - 1, j)] + x[IX(i, j + 1)] + x[IX(i, j - 1)])) * cRecip;
            }
        }
        set_bnd(b, x);
    }
}

function diffuse(b, x, x0, diff, dt) {
    let a = dt * diff * (N - 2) * (N - 2);
    lin_solve(b, x, x0, a, 1 + 6 * a); // Slightly higher divisor for stability? Standard is 1+4*a
    // Standard is 1+4a for 2D? Wait.
    // Neighbors: i+1, i-1, j+1, j-1. That's 4.
    // So 1 + 4*a.
    lin_solve(b, x, x0, a, 1 + 4 * a);
}

function project(u, v, p, div) {
    let h = 1.0 / N;
    for (let j = 1; j <= N; j++) {
        for (let i = 1; i <= N; i++) {
            div[IX(i, j)] = -0.5 * h * (u[IX(i + 1, j)] - u[IX(i - 1, j)] + v[IX(i, j + 1)] - v[IX(i, j - 1)]);
            p[IX(i, j)] = 0;
        }
    }
    set_bnd(0, div);
    set_bnd(0, p);
    lin_solve(0, p, div, 1, 4);

    for (let j = 1; j <= N; j++) {
        for (let i = 1; i <= N; i++) {
            u[IX(i, j)] -= 0.5 * (p[IX(i + 1, j)] - p[IX(i - 1, j)]) / h;
            v[IX(i, j)] -= 0.5 * (p[IX(i, j + 1)] - p[IX(i, j - 1)]) / h;
        }
    }
    set_bnd(1, u);
    set_bnd(2, v);
}

function advect(b, d, d0, u, v, dt) {
    let i0, j0, i1, j1;
    let x, y, s0, t0, s1, t1;
    let dt0 = dt * (N - 2);

    for (let j = 1; j <= N; j++) {
        for (let i = 1; i <= N; i++) {
            x = i - dt0 * u[IX(i, j)];
            y = j - dt0 * v[IX(i, j)];

            if (x < 0.5) x = 0.5;
            if (x > N + 0.5) x = N + 0.5;
            i0 = Math.floor(x);
            i1 = i0 + 1;

            if (y < 0.5) y = 0.5;
            if (y > N + 0.5) y = N + 0.5;
            j0 = Math.floor(y);
            j1 = j0 + 1;

            s1 = x - i0;
            s0 = 1.0 - s1;
            t1 = y - j0;
            t0 = 1.0 - t1;

            d[IX(i, j)] = s0 * (t0 * d0[IX(i0, j0)] + t1 * d0[IX(i0, j1)]) +
                          s1 * (t0 * d0[IX(i1, j0)] + t1 * d0[IX(i1, j1)]);
        }
    }
    set_bnd(b, d);
}

// Main Step
function fluidStep(dt) {
    // Velocity Step
    diffuse(1, u_prev, u, viscosity, dt);
    diffuse(2, v_prev, v, viscosity, dt);
    
    project(u_prev, v_prev, u, v);
    
    advect(1, u, u_prev, u_prev, v_prev, dt);
    advect(2, v, v_prev, u_prev, v_prev, dt);
    
    project(u, v, u_prev, v_prev);

    // Density Step
    diffuse(0, dens_prev, dens, diffusion, dt);
    advect(0, dens, dens_prev, u, v, dt);
    
    // Decay
    for (let i = 0; i < size; i++) {
        dens[i] *= 0.995; // Slow fade
        u[i] *= 0.99;
        v[i] *= 0.99;
    }
}

// Rendering
let offscreenCanvas = document.createElement('canvas');
offscreenCanvas.width = N;
offscreenCanvas.height = N;
let offCtx = offscreenCanvas.getContext('2d');
let imageData = offCtx.createImageData(N, N);

function draw() {
    let data = imageData.data;
    for (let j = 1; j <= N; j++) {
        for (let i = 1; i <= N; i++) {
            let idx = IX(i, j);
            let d = dens[idx];
            
            // Map 2D index to pixel index
            // Image data is row-major (y then x)
            // But our grid might be matching.
            // i is x (1..N), j is y (1..N)
            // Pixel coordinate (i-1, j-1)
            let pixelIdx = ((j - 1) * N + (i - 1)) * 4;
            
            // Simple visualization: Color based on density
            // To make it beautiful, let's use HSL based on something dynamic or constant hue
            
            // Let's create a color ramp or just usage the currentHue global
            // We can also vary hue by position or velocity for extra flair
            
            // Speed for color variance?
            // let speed = Math.sqrt(u[idx]*u[idx] + v[idx]*v[idx]);
            
            let r, g, b;
            
            // Convert HSV to RGB manually for performance or just set simple colors?
            // JS loop is slow if we do complex math per pixel.
            // Let's try simple white/cyan smoke first, or tint it.
            
            let val = Math.min(255, d * 255);
            
            // data[pixelIdx] = val;     // R
            // data[pixelIdx + 1] = val; // G
            // data[pixelIdx + 2] = val; // B
            // data[pixelIdx + 3] = 255; // Alpha
            
            // Nice Color Scheme: Blue/Purple/Pink
            // Base hue on currentHue
            
            // Simple HSL to RGB conversion approximation or lookup?
            // Let's just do a tint.
            
            // Use currentHue
            // HSL to RGB is expensive per pixel in JS.
            // Let's precompute a color or just do simple channel mixing.
            
            // Color based on density 'd' (0..1+)
            
            // Neon effect:
            // High density -> White
            // Medium -> Color
            // Low -> Black
            
            // Cycle hue
            let hue = currentHue % 360;
            // Crude HSV to RGB
            // const s = 1.0, v_ = 1.0;
            // Actually, let's just use a cached RGB value for the "ink" color
            // and fade it.
            
            // Better: Store r,g,b in the density? No, too much memory.
            // Just monochromatic colored smoke that changes color over time.
            
            // Get RGB from HSL(hue, 100%, 50%)
            // Let's update a global r,g,b for the ink color every frame.
            
            data[pixelIdx] = inkColor.r * val;
            data[pixelIdx + 1] = inkColor.g * val;
            data[pixelIdx + 2] = inkColor.b * val;
            data[pixelIdx + 3] = 255;
        }
    }
    
    offCtx.putImageData(imageData, 0, 0);
    
    // Draw scaled up
    ctx.clearRect(0, 0, width, height);
    ctx.imageSmoothingEnabled = true; // Key for the smoky look
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(offscreenCanvas, 0, 0, width, height);
}

let inkColor = {r: 1, g: 1, b: 1};

function updateInkColor() {
    currentHue += 0.5;
    let h = currentHue % 360;
    // HSL to RGB
    let s = 100;
    let l = 60; // Bright
    let c = (1 - Math.abs(2 * l / 100 - 1)) * s / 100;
    let x = c * (1 - Math.abs((h / 60) % 2 - 1));
    let m = l / 100 - c / 2;
    let r_ = 0, g_ = 0, b_ = 0;
    
    if (0 <= h && h < 60) { r_ = c; g_ = x; b_ = 0; }
    else if (60 <= h && h < 120) { r_ = x; g_ = c; b_ = 0; }
    else if (120 <= h && h < 180) { r_ = 0; g_ = c; b_ = x; }
    else if (180 <= h && h < 240) { r_ = 0; g_ = x; b_ = c; }
    else if (240 <= h && h < 300) { r_ = x; g_ = 0; b_ = c; }
    else if (300 <= h && h < 360) { r_ = c; g_ = 0; b_ = x; }
    
    inkColor.r = r_ + m;
    inkColor.g = g_ + m;
    inkColor.b = b_ + m;
}

// Interaction
let isDragging = false;
let lastX = 0, lastY = 0;

function handleInput(x, y, isDown) {
    if (!isDown) {
        lastX = x;
        lastY = y;
        return;
    }
    
    let gridX = Math.floor((x / width) * N) + 1;
    let gridY = Math.floor((y / height) * N) + 1;
    
    if (gridX < 1 || gridX > N || gridY < 1 || gridY > N) return;
    
    let forceX = (x - lastX) * 5;
    let forceY = (y - lastY) * 5;
    
    // Add density and force to a radius
    let r = 2; // Brush radius
    for (let j = -r; j <= r; j++) {
        for (let i = -r; i <= r; i++) {
            let cx = gridX + i;
            let cy = gridY + j;
            if (cx >= 1 && cx <= N && cy >= 1 && cy <= N) {
                let d2 = i*i + j*j;
                if (d2 <= r*r) {
                    let falloff = Math.exp(-d2);
                    let idx = IX(cx, cy);
                    dens[idx] += 100 * falloff;
                    u[idx] += forceX * falloff;
                    v[idx] += forceY * falloff;
                }
            }
        }
    }
    
    lastX = x;
    lastY = y;
}

// Setup
window.onload = function() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        // Keep grid size fixed (N=128), just scale rendering
    }
    window.addEventListener('resize', resize);
    resize();
    
    // Mouse Events
    canvas.addEventListener('mousedown', e => {
        isDragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
    });
    
    window.addEventListener('mouseup', () => isDragging = false);
    
    canvas.addEventListener('mousemove', e => {
        if (isDragging) {
            handleInput(e.clientX, e.clientY, true);
        }
    });

    // Touch Events
    canvas.addEventListener('touchstart', e => {
        e.preventDefault();
        isDragging = true;
        lastX = e.touches[0].clientX;
        lastY = e.touches[0].clientY;
    }, {passive: false});

    canvas.addEventListener('touchmove', e => {
        e.preventDefault();
        if (isDragging) {
            handleInput(e.touches[0].clientX, e.touches[0].clientY, true);
        }
    }, {passive: false});

    window.addEventListener('touchend', () => isDragging = false);

    loop();
};

let lastTime = Date.now();
function loop() {
    let now = Date.now();
    let dt = (now - lastTime) / 1000;
    lastTime = now;
    
    // Cap dt to avoid explosion if tab is backgrounded
    if (dt > 0.1) dt = 0.1;

    updateInkColor();
    fluidStep(0.1); // Use fixed time step for stability physics-wise? 
    // Actually, fluid sims are sensitive. Fixed step is often better.
    // Let's use 0.1 or similar.
    
    draw();
    requestAnimationFrame(loop);
}
