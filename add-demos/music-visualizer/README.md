# Sonic Vision - Retro-Futuristic Music Visualizer

A highly beautiful, WebGL-powered music visualizer built with Three.js. It features multiple reactive shaders inspired by 90s/2000s Winamp visualizers and the Demoscene.

## Features

- **5 Unique Visualizers**:
  - Neon Tunnel
  - Kaleidoscopic Realm
  - Retro Grid
  - Spectral Circular
  - Plasma Flow
- **Audio Reactivity**: Shaders react to Bass, Mid, and Treble frequencies in real-time.
- **Custom Music Support**: Drag & Drop any audio file or use the file picker.
- **Pre-loaded Tracks**: Includes 3 demo tracks.
- **Retro UI**: Cyberpunk/Sci-fi interface with glassmorphism.

## How to Run

Since this project uses ES Modules and loads local audio files, you need to run it via a local server to avoid CORS issues.

### Using Python (Pre-installed on macOS/Linux)
Run this command in the project directory:
```bash
python3 -m http.server
```
Then open `http://localhost:8000` in your browser.

### Using Node.js
If you have `serve` installed:
```bash
npx serve
```

## Controls

- **Space**: Play/Pause
- **Mouse**: Click progress bar to seek
- **Drag & Drop**: Drop any audio file onto the window to play it.
