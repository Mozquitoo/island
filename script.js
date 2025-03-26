import * as THREE from "three";

// PROGRESS BAR SETUP
const loadingBar = document.createElement("div");
loadingBar.id = "loading-bar";
loadingBar.style.position = "fixed";
loadingBar.style.bottom = "40px";
loadingBar.style.left = "50%";
loadingBar.style.transform = "translateX(-50%)";
loadingBar.style.width = "0%";
loadingBar.style.height = "6px";
loadingBar.style.background = "#95FF00";
loadingBar.style.transition = "width 0.3s";
loadingBar.style.zIndex = "9999";
loadingBar.style.display = "none";
document.body.appendChild(loadingBar);

const percentText = document.createElement("div");
percentText.style.position = "fixed";
percentText.style.bottom = "50px";
percentText.style.left = "50%";
percentText.style.transform = "translateX(-50%)";
percentText.style.color = "#fff";
percentText.style.fontFamily = "Arial";
percentText.style.fontSize = "14px";
percentText.style.zIndex = "9999";
percentText.style.display = "none";
document.body.appendChild(percentText);

// LOADING MANAGER
const loadingManager = new THREE.LoadingManager();
loadingManager.onStart = () => {
  loadingBar.style.display = "block";
  percentText.style.display = "block";
};
loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
  const percent = Math.floor((itemsLoaded / itemsTotal) * 100);
  loadingBar.style.width = `${percent}%`;
  percentText.textContent = `Loading: ${percent}%`;
};
loadingManager.onLoad = () => {
  loadingBar.style.display = "none";
  percentText.style.display = "none";
};
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// Loaders
const textureLoader = new THREE.TextureLoader(loadingManager);
const islandURL = "Iles/Grand Ile.glb";

const loader = new GLTFLoader(loadingManager);

// Textures
const sciFiWallColor = textureLoader.load(
  "/Texture/Tiles_Dutch_001_basecolor.png"
);
sciFiWallColor.colorSpace = THREE.SRGBColorSpace;

// Scene
const scene = new THREE.Scene();
const spaceTexture = textureLoader.load("Texture/stars.jpg");
scene.background = spaceTexture;

// Sizes (Viewport)
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Renderer
const canvas = document.querySelector("canvas.webgl");

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

// Return to main menu on click
document.getElementById("exit-menu-button")?.addEventListener("click", () => {
  document.getElementById("menu").style.display = "flex";
  document.querySelector("canvas.webgl").style.display = "none";
  document.getElementById("exit-menu-button").style.display = "none";
});

// Display Controls modal
window.addEventListener("DOMContentLoaded", () => {
  const optionsBtn = document.getElementById("options-button");
  if (optionsBtn) {
    optionsBtn.addEventListener("click", () => {
      const controlsModal = document.getElementById("controls-modal");
      if (controlsModal) {
        controlsModal.style.display = "flex";
      }
    });
  }
});

// Display About Us modal
document.getElementById("about-button")?.addEventListener("click", () => {
  const aboutModal = document.getElementById("about-modal");
  if (aboutModal) {
    aboutModal.style.display = "flex";
  }
});

// Close modals on click or Esc key

document.getElementById("controls-modal")?.addEventListener("click", () => {
  document.getElementById("controls-modal").style.display = "none";
});
document.getElementById("about-modal")?.addEventListener("click", () => {
  document.getElementById("about-modal").style.display = "none";
});

// Enable audio playback on first user interaction
document.addEventListener(
  "click",
  () => {
    if (!isPlaying) {
      bgMusic.play();
      isPlaying = true;
    }
  },
  { once: true }
);

// MUSIC CONTROL
const bgMusic = new Audio("audio/music.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.5;

let isPlaying = false;

window.addEventListener("DOMContentLoaded", () => {
  const audioToggle = document.getElementById("audio-toggle");
  if (audioToggle) {
    audioToggle.classList.remove("muted");

    audioToggle.addEventListener("click", () => {
      if (isPlaying) {
        bgMusic.pause();
        audioToggle.classList.add("muted");
      } else {
        bgMusic.play();
        audioToggle.classList.remove("muted");
      }
      isPlaying = !isPlaying;
    });
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "m" || e.key === "M") {
    const audioToggle = document.getElementById("audio-toggle");
    if (isPlaying) {
      bgMusic.pause();
      audioToggle.classList.add("muted");
    } else {
      bgMusic.play();
      audioToggle.classList.remove("muted");
    }
    isPlaying = !isPlaying;
  }
});

window.addEventListener("DOMContentLoaded", () => {
  const playBtn = document.getElementById("play-button");
  if (playBtn) {
    playBtn.addEventListener("click", () => {
      document.getElementById("menu").style.display = "none";
      document.getElementById("intro-container").style.display = "flex";

      const skipBtn = document.getElementById("skip-button");
      if (skipBtn) {
        skipBtn.addEventListener("click", () => {
          document.getElementById("intro-container").style.display = "none";
          document.querySelector("canvas.webgl").style.display = "block";
          const exitBtn = document.getElementById("exit-menu-button");
          if (exitBtn) exitBtn.style.display = "block";
        });
      }
    });
  }
});
setInterval(() => {
  if (
    window.astronaut &&
    window.astronaut.position.y < -5 &&
    !document.getElementById("lost-message")
  ) {
    const message = document.createElement("div");
    message.id = "lost-message";
    message.innerHTML = `
      <div style="background: rgba(0,0,0,0.7); color: white; padding: 20px; border-radius: 10px; text-align: center;">
        <h2>You are lost in space</h2>
        <button id="respawn-button" style="padding: 10px 20px; margin-top: 10px;">Respawn</button>
      </div>
    `;
    message.style.position = "fixed";
    message.style.top = "50%";
    message.style.left = "50%";
    message.style.transform = "translate(-50%, -50%)";
    message.style.zIndex = "1000";
    document.body.appendChild(message);

    document.getElementById("respawn-button").addEventListener("click", () => {
      window.astronaut.position.set(0, 5, 0);
      verticalVelocity = 0;
      document.body.removeChild(message);
    });
  }
}, 500);

renderer.setSize(sizes.width, sizes.height);

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 7;
scene.add(camera);
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;
orbitControls.enabled = false;

// Controls
const controls = new PointerLockControls(camera, document.body);
scene.add(controls.getObject());

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const softAmbient = new THREE.AmbientLight(0x404040, 1);
scene.add(softAmbient);

const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
hemisphereLight.position.set(0, 20, 0);
scene.add(hemisphereLight);

// Models
// Load GLTF Model
const raycaster = new THREE.Raycaster();
const down = new THREE.Vector3(0, -1, 0);

let angle = 0;
let speed = 0.4;
let sensitivity = 0.002;
let cameraMode = 0;
let mouseDeltaX = 0;
let mouseDeltaY = 0;
let pitch = 0;
let verticalVelocity = 0;
let isViewOnly = false;

let previousY;
let lastRaycastTime = 0;
const raycastInterval = 100;

// -------------------------
// Load Island Model (GLTF)
// -------------------------
loader.load(
  islandURL,
  (gltf) => {
    const island = gltf.scene;
    island.scale.set(5, 5, 5);
    island.position.set(0, -1, 0);
    scene.add(island);
    window.island = island; // Assign island model to global variable

    // Load Astronaut model after island is loaded
    loader.load(
      "Astronauta/Astronauta.glb",
      (gltf) => {
        const model = gltf.scene;
        model.position.set(0, 0, 0);
        model.scale.set(0.5, 0.5, 0.5);

        scene.add(model);
        window.astronaut = model;
        model.rotation.y = 0;

        // Event Listener for Pointer Lock
        canvas.addEventListener("click", () => {
          canvas.requestPointerLock();
        });

        // Remaining logic continues after loading
        // (tick and other functions are already defined)
      },
      undefined,
      (error) => {
        console.error("Error al cargar el modelo:", error);
      }
    );
  },
  undefined,
  (error) => {
    console.error("Error al cargar la isla:", error);
  }
);
// Event Listener for Mouse Move
document.addEventListener("mousemove", (event) => {
  if (document.pointerLockElement === canvas && window.astronaut) {
    mouseDeltaX = event.movementX;
    mouseDeltaY = event.movementY;
  }
});

const updateAstronautTerrain = () => {
  if (window.island && window.astronaut) {
    const origin = window.astronaut.position.clone();
    origin.y += 10;
    raycaster.set(origin, down);
    const intersects = raycaster.intersectObject(window.island, true);

    if (intersects.length > 0) {
      const intersect = intersects[0];
      const groundY = intersect.point.y;
      window.astronaut.position.y = groundY + 0.3;

      const normalMatrix = new THREE.Matrix3().getNormalMatrix(
        intersect.object.matrixWorld
      );
      const worldNormal = intersect.face.normal
        .clone()
        .applyMatrix3(normalMatrix)
        .normalize();

      const up = new THREE.Vector3(0, 1, 0);
      const quaternion = new THREE.Quaternion().setFromUnitVectors(
        up,
        worldNormal
      );
      window.astronaut.quaternion.slerp(quaternion, 0.1);
    }
  }
};

// Event Listener for Keydown
window.addEventListener("keydown", (event) => {
  if (!window.astronaut) return;

  switch (event.key) {
    case "Tab": {
      isViewOnly = !isViewOnly;
      orbitControls.enabled = isViewOnly;
      event.preventDefault();
      const message = document.createElement("div");
      message.textContent = isViewOnly
        ? "Viewing mode enabled"
        : "Astronaut mode enabled";
      message.style.position = "fixed";
      message.style.top = "20px";
      message.style.left = "50%";
      message.style.transform = "translateX(-50%)";
      message.style.padding = "10px 20px";
      message.style.background = "rgba(0, 0, 0, 0.6)";
      message.style.color = "#fff";
      message.style.fontFamily = "Arial, sans-serif";
      message.style.fontSize = "16px";
      message.style.borderRadius = "5px";
      message.style.zIndex = "1000";
      document.body.appendChild(message);
      setTimeout(() => {
        document.body.removeChild(message);
      }, 2000);
      canvas.style.cursor = "crosshair";
      if (isViewOnly) {
        document.exitPointerLock();
      } else {
        canvas.requestPointerLock();
      }
      break;
    }
    case "ArrowLeft": {
      const strafeX = speed * Math.cos(angle);
      const strafeZ = speed * Math.sin(angle);
      window.astronaut.position.x -= strafeX;
      window.astronaut.position.z -= strafeZ;
      verticalVelocity = 0.05;
      break;
    }
    case "ArrowRight": {
      const strafeX = speed * Math.cos(angle);
      const strafeZ = speed * Math.sin(angle);
      window.astronaut.position.x += strafeX;
      window.astronaut.position.z += strafeZ;
      verticalVelocity = 0.05;
      break;
    }
    case "ArrowUp":
      verticalVelocity = 0.05;
      window.astronaut.position.x += speed * Math.cos(Math.PI / 2 + angle);
      window.astronaut.position.z -= speed * Math.sin(Math.PI / 2 + angle);
      break;
    case "ArrowDown":
      verticalVelocity = 0.05;
      window.astronaut.position.x -= speed * Math.cos(Math.PI / 2 + angle);
      window.astronaut.position.z += speed * Math.sin(Math.PI / 2 + angle);
      break;
    case " ":
      window.astronaut.position.y += speed;
      break;
    case "Shift":
      window.astronaut.position.y -= speed;
      break;
    case "f":
      cameraMode = (cameraMode + 1) % 3;
      break;
  }
  if (performance.now() - lastRaycastTime > raycastInterval) {
    updateAstronautTerrain();
    lastRaycastTime = performance.now();
  }
});

// Animation Loop
const tick = () => {
  let previousY = window.astronaut ? window.astronaut.position.y : 0;
  if (window.astronaut && window.island) {
    if (performance.now() - lastRaycastTime > raycastInterval) {
      const origin = window.astronaut.position.clone();
      origin.y += 10;
      raycaster.set(origin, down);
      const intersects = raycaster.intersectObject(window.island, true);

      verticalVelocity -= 0.02;
      window.astronaut.position.y += verticalVelocity;

      if (intersects.length > 0) {
        const groundY = intersects[0].point.y;
        const astronautY = window.astronaut.position.y;

        if (astronautY < groundY + 0.3) {
          window.astronaut.position.y = groundY + 0.3;
          verticalVelocity = 0;
        }
      }

      lastRaycastTime = performance.now();
    }

    if (
      window.astronaut.position.y < -20 &&
      !document.getElementById("lost-message")
    ) {
      const message = document.createElement("div");
      message.id = "lost-message";
      message.innerHTML = `
            <div style="background: rgba(0,0,0,0.7); color: white; padding: 20px; border-radius: 10px; text-align: center;">
              <h2>You are lost in space</h2>
              <button id="respawn-button" style="padding: 10px 20px; margin-top: 10px;">Respawn</button>
            </div>
          `;
      message.style.position = "fixed";
      message.style.top = "50%";
      message.style.left = "50%";
      message.style.transform = "translate(-50%, -50%)";
      message.style.zIndex = "1000";
      document.body.appendChild(message);

      document
        .getElementById("respawn-button")
        .addEventListener("click", () => {
          window.astronaut.position.set(0, 5, 0);
          verticalVelocity = 0;
          document.body.removeChild(message);
        });
    }
  }
  if (!isViewOnly && window.astronaut) {
    // Astronaut control and camera orientation
    angle -= mouseDeltaX * sensitivity;
    pitch -= mouseDeltaY * sensitivity;
    mouseDeltaX = 0;
    mouseDeltaY = 0;
    pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch));

    window.astronaut.rotation.y = angle + Math.PI;

    const headOffset = new THREE.Vector3(0, 1.5, 0);
    const lookDirection = new THREE.Vector3(
      Math.cos(angle + Math.PI / 2) * Math.cos(pitch),
      Math.sin(pitch),
      -Math.sin(angle + Math.PI / 2) * Math.cos(pitch)
    );

    if (cameraMode === 0) {
      // First-person view
      const cameraY = Math.max(previousY, window.astronaut.position.y);
      camera.position.set(
        window.astronaut.position.x,
        cameraY + 1.5,
        window.astronaut.position.z
      );
      camera.lookAt(camera.position.clone().add(lookDirection));
    } else if (cameraMode === 1) {
      // Third-person close view
      const offset = new THREE.Vector3(0, 2, -3).applyAxisAngle(
        new THREE.Vector3(0, 1, 0),
        angle
      );
      camera.position.copy(window.astronaut.position).add(offset);
      camera.lookAt(window.astronaut.position);
    } else {
      // Third-person far view
      const offset = new THREE.Vector3(0, 4, -8).applyAxisAngle(
        new THREE.Vector3(0, 1, 0),
        angle
      );
      camera.position.copy(window.astronaut.position).add(offset);
      camera.lookAt(window.astronaut.position);
    }
  }

  if (isViewOnly) {
    orbitControls.update();
  }

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();

undefined,
  (error) => {
    console.error("Error al cargar el modelo:", error);
  };

// Helpers

document.addEventListener("pointerlockchange", () => {
  const locked = document.pointerLockElement === canvas;

  if (!locked) {
    isViewOnly = true;
    orbitControls.enabled = true;
    canvas.style.cursor = "crosshair";

    const message = document.createElement("div");
    message.textContent = "Viewing mode enabled (Pointer Lock exited)";
    message.style.position = "fixed";
    message.style.top = "20px";
    message.style.left = "50%";
    message.style.transform = "translateX(-50%)";
    message.style.padding = "10px 20px";
    message.style.background = "rgba(0, 0, 0, 0.6)";
    message.style.color = "#fff";
    message.style.fontFamily = "Arial, sans-serif";
    message.style.fontSize = "16px";
    message.style.borderRadius = "5px";
    message.style.zIndex = "1000";
    document.body.appendChild(message);
    setTimeout(() => {
      document.body.removeChild(message);
    }, 2000);
  } else {
    isViewOnly = false;
    orbitControls.enabled = false;
    canvas.style.cursor = "none";
  }
});
