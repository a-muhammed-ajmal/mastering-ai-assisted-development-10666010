import * as THREE from 'three';
import { shaders, commonVertexShader } from './shaders.js';

class AudioVisualizer {
    constructor() {
        this.container = document.getElementById('visualizer-container');
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        
        // Audio components
        this.audioContext = null;
        this.analyser = null;
        this.source = null;
        this.audio = new Audio();
        this.audio.crossOrigin = "anonymous";
        this.isPlaying = false;
        
        // Analysis data
        this.frequencyData = new Uint8Array(0);
        this.bass = 0;
        this.mid = 0;
        this.treble = 0;
        
        // Three.js components
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.material = null;
        this.mesh = null;
        this.uniforms = {
            uTime: { value: 0 },
            uResolution: { value: new THREE.Vector2(this.width, this.height) },
            uBass: { value: 0.0 },
            uMid: { value: 0.0 },
            uTreble: { value: 0.0 }
        };
        
        // FPS
        this.frameCount = 0;
        this.lastFpsTime = performance.now();

        this.initThree();
        this.initUI();
        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
        
        // Initial setup
        this.populateShaderSelect();
        this.loadShader(0);
        this.loadSong(document.getElementById('song-select').value);
    }
    
    initThree() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        
        this.renderer = new THREE.WebGLRenderer({ alpha: false });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);
        
        const geometry = new THREE.PlaneGeometry(2, 2);
        this.material = new THREE.ShaderMaterial({
            vertexShader: commonVertexShader,
            fragmentShader: shaders[0].fragmentShader,
            uniforms: this.uniforms
        });
        
        this.mesh = new THREE.Mesh(geometry, this.material);
        this.scene.add(this.mesh);
        
        window.addEventListener('resize', () => this.onResize());
    }
    
    initAudio() {
        if (this.audioContext) return;
        
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new AudioContext();
        
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 1024;
        
        this.source = this.audioContext.createMediaElementSource(this.audio);
        this.source.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
        
        this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
    }
    
    initUI() {
        // Play/Pause
        const playBtn = document.getElementById('play-btn');
        playBtn.addEventListener('click', () => this.togglePlay());
        
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault(); // Prevent scrolling
                this.togglePlay();
            }
        });

        // Song Select
        const songSelect = document.getElementById('song-select');
        const fileInput = document.getElementById('file-input');
        
        songSelect.addEventListener('change', (e) => {
            if (e.target.value === 'custom') {
                fileInput.click();
            } else {
                this.loadSong(e.target.value);
            }
        });
        
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                const file = e.target.files[0];
                const url = URL.createObjectURL(file);
                this.loadSong(url);
                // Reset select to 'custom' visually just in case, though it already is
            } else {
                // User cancelled, revert to first option or handle gracefully?
                // For now, just keep previous song if cancelled
                songSelect.value = "music/flying.mp3"; 
            }
        });

        // Shader Select
        const shaderSelect = document.getElementById('shader-select');
        shaderSelect.addEventListener('change', (e) => {
            this.loadShader(parseInt(e.target.value));
        });

        // Volume
        const volumeSlider = document.getElementById('volume-slider');
        this.audio.volume = volumeSlider.value;
        volumeSlider.addEventListener('input', (e) => {
            this.audio.volume = e.target.value;
        });

        // Progress Bar
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        
        const progressContainer = document.querySelector('.progress-container');
        progressContainer.addEventListener('click', (e) => {
            const rect = progressContainer.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            if (this.audio.duration) {
                this.audio.currentTime = pos * this.audio.duration;
            }
        });
        
        // Drag and Drop
        document.body.addEventListener('dragover', (e) => e.preventDefault());
        document.body.addEventListener('drop', (e) => {
            e.preventDefault();
            if (e.dataTransfer.files.length > 0) {
                const file = e.dataTransfer.files[0];
                if (file.type.startsWith('audio/')) {
                    const url = URL.createObjectURL(file);
                    this.loadSong(url);
                    songSelect.value = 'custom';
                }
            }
        });
    }

    populateShaderSelect() {
        const select = document.getElementById('shader-select');
        shaders.forEach((shader, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = shader.name;
            select.appendChild(option);
        });
    }

    loadShader(index) {
        if (index >= 0 && index < shaders.length) {
            this.material.fragmentShader = shaders[index].fragmentShader;
            this.material.needsUpdate = true;
        }
    }

    loadSong(url) {
        const wasPlaying = this.isPlaying;
        this.audio.src = url;
        this.audio.load();
        
        if (wasPlaying) {
            this.togglePlay(true);
        } else {
            this.togglePlay(false); // Stop if not playing, but load new song
        }
    }

    async togglePlay(forcePlay = null) {
        // Ensure AudioContext is resumed (browser policy)
        if (this.audioContext && this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        } else if (!this.audioContext) {
            this.initAudio();
        }

        if (forcePlay === true) {
            this.audio.play();
            this.isPlaying = true;
        } else if (forcePlay === false) {
            this.audio.pause();
            this.isPlaying = false;
        } else {
            if (this.audio.paused) {
                this.audio.play();
                this.isPlaying = true;
            } else {
                this.audio.pause();
                this.isPlaying = false;
            }
        }
        
        this.updatePlayBtnIcon();
    }
    
    updatePlayBtnIcon() {
        const btn = document.getElementById('play-btn');
        if (this.isPlaying) {
            btn.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
        } else {
            btn.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
        }
    }
    
    updateProgress() {
        const current = this.audio.currentTime;
        const duration = this.audio.duration || 1;
        
        const progressBar = document.getElementById('progress-bar');
        progressBar.style.width = `${(current / duration) * 100}%`;
        
        document.getElementById('current-time').textContent = this.formatTime(current);
        document.getElementById('duration').textContent = this.formatTime(duration);
    }
    
    formatTime(seconds) {
        if (isNaN(seconds)) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    analyzeAudio() {
        if (!this.analyser) return;
        
        this.analyser.getByteFrequencyData(this.frequencyData);
        
        // Calculate average ranges
        // Bin size = SampleRate / FFTSize. 44100 / 1024 ~= 43Hz per bin.
        // Bass: 0-250Hz -> bins 0-6
        // Mid: 250-4000Hz -> bins 6-93
        // Treble: 4000-20000Hz -> bins 93-512
        
        const bassEnd = 10;
        const midEnd = 100;
        const trebleEnd = 512;
        
        let bassSum = 0;
        let midSum = 0;
        let trebleSum = 0;
        
        for (let i = 0; i < this.frequencyData.length; i++) {
            const val = this.frequencyData[i] / 255.0; // Normalize 0-1
            if (i < bassEnd) bassSum += val;
            else if (i < midEnd) midSum += val;
            else if (i < trebleEnd) trebleSum += val;
        }
        
        this.bass = bassSum / bassEnd;
        this.mid = midSum / (midEnd - bassEnd);
        this.treble = trebleSum / (trebleEnd - midEnd);
        
        // Boost values for visual impact
        this.bass = Math.pow(this.bass, 0.8) * 1.5; 
        this.mid = Math.pow(this.mid, 0.8) * 1.2;
        this.treble = Math.pow(this.treble, 0.8) * 1.5;
    }

    onResize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.renderer.setSize(this.width, this.height);
        this.uniforms.uResolution.value.set(this.width, this.height);
    }

    animate(time) {
        requestAnimationFrame(this.animate);
        
        this.analyzeAudio();
        
        // Smooth transitions for uniforms
        this.uniforms.uTime.value = time * 0.001;
        this.uniforms.uBass.value += (this.bass - this.uniforms.uBass.value) * 0.1;
        this.uniforms.uMid.value += (this.mid - this.uniforms.uMid.value) * 0.1;
        this.uniforms.uTreble.value += (this.treble - this.uniforms.uTreble.value) * 0.1;
        
        this.renderer.render(this.scene, this.camera);
        
        // FPS
        this.frameCount++;
        const now = performance.now();
        if (now - this.lastFpsTime > 1000) {
            document.getElementById('fps').textContent = this.frameCount;
            this.frameCount = 0;
            this.lastFpsTime = now;
        }
    }
}

// Start
new AudioVisualizer();
