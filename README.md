# 🌌 The Odyssey of the Unknown

**The Odyssey of the Unknown** is an immersive 3D experience built with Three.js where you explore a mysterious world in space as an astronaut. You control the character, walk across a floating island, and discover the secrets of the universe, all set in an atmospheric environment with background music.

---

## 📁 Project Structure

```
/ (root)
│
├── index.html
├── style.css
├── script.js
├── /Texture/
│   ├── stars.jpg
│   └── Tiles_Dutch_001_basecolor.png
├── /audio/
│   └── music.mp3
├── /Astronauta/
│   └── Astronauta.glb
├── /Iles/
│   └── Grand Ile.glb
└── README.md
```

---

## 📦 Technologies & Libraries Used

- [Three.js](https://threejs.org/)
- GLTFLoader
- PointerLockControls
- OrbitControls
- LoadingManager
- HTML, CSS, and JavaScript

---

## 🚀 Installation & Usage

1. **Clone the repository:**

```bash
git clone https://github.com/your-username/the-odyssey-of-the-unknown.git
cd the-odyssey-of-the-unknown
```

2. **Start a local server:**

Recommended to ensure proper loading of models and textures.

```bash
npm install -g live-server
live-server
```

3. **Open in browser:**

Alternatively, you can open `index.html` directly, but some features may not work due to browser security restrictions.

---

## 🧠 Code Overview (`script.js`)

### Imports

```js
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
```

### Key Features

- **Camera**: First-person and free orbit modes toggle with `Tab`.
- **Movement**: Arrow keys to move, `Space` and `Shift` to go up/down.
- **Collision**: Raycaster keeps the astronaut aligned with the terrain.
- **Background Music**: Plays after first user click, toggleable with `M`.
- **Model Loading**:
  - Island: `Grand Ile.glb`
  - Astronaut: `Astronauta.glb`
- **Textures**: Starry sky and island surface.
- **Modals**: Show instructions, about, and "lost in space" warning.

---

## 🕹️ Controls

- `← ↑ ↓ →`: move the astronaut
- `Space`: move up
- `Shift`: move down
- `Tab`: switch camera modes
- `M`: mute/unmute music

---

## 🔊 Music

Music plays after the user's first click and can be muted or unmuted using the `M` key.

---

## 🧱 Credits

- Astronaut model: Open source (Sketchfab)
- Music: sonidos del espacio or by author EL ALMA)
- Developed by: Cristian Mallama  Thuau Nicolas Bournique Raphael Ferreira Mathéo

