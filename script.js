import * as THREE from "three";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// Loaders
const textureLoader = new THREE.TextureLoader();
const islandURL = "Iles/Grand Ile.glb"; // Cambia por la ruta correcta

const loader = new GLTFLoader();
// Cargar el modelo de la isla

loader.load(
  islandURL,
  (gltf) => {
    const island = gltf.scene;
    island.scale.set(3, 3, 3);
    island.position.set(0, -1, 0);
    scene.add(island);
    window.island = island; // Declara una variable global para la isla
  },

  undefined,
  (error) => {
    console.error("Error al cargar la isla:", error);
  }
);

// Textures
const sciFiWallColor = textureLoader.load(
  "/Texture/Tiles_Dutch_001_basecolor.png"
);
sciFiWallColor.colorSpace = THREE.SRGBColorSpace;

// Scene
const scene = new THREE.Scene();

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

renderer.setSize(sizes.width, sizes.height);

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 7;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight("#bb6800", 0.9);
scene.add(directionalLight);

// Models
// Load GLTF Model
const raycaster = new THREE.Raycaster();
const down = new THREE.Vector3(0, -1, 0);

let cameraMode = 0;
let mouseDeltaX = 0;
let mouseDeltaY = 0;
let pitch = 0;
let isViewOnly = false; // Nueva variable para controlar el modo de visualización

loader.load(
  "Astronauta/Astronauta.glb",
  (gltf) => {
    const model = gltf.scene;
    model.position.set(0, 0, 0);
    model.scale.set(0.5, 0.5, 0.5);

    scene.add(model);
    window.astronaut = model;
    model.rotation.y = 0;

    let angle = 0;
    let speed = 0.4;
    let sensitivity = 0.002;

    // Event Listener for Pointer Lock
    canvas.addEventListener("click", () => {
      canvas.requestPointerLock();
    });

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
          break;
        }
        case "ArrowRight": {
          const strafeX = speed * Math.cos(angle);
          const strafeZ = speed * Math.sin(angle);
          window.astronaut.position.x += strafeX;
          window.astronaut.position.z += strafeZ;
          break;
        }
        case "ArrowUp":
          window.astronaut.position.x += speed * Math.cos(Math.PI / 2 + angle);
          window.astronaut.position.z -= speed * Math.sin(Math.PI / 2 + angle);
          break;
        case "ArrowDown":
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
      updateAstronautTerrain();
    });

    // Animation Loop
    const tick = () => {
      if (isViewOnly) controls.update();

      if (!isViewOnly) {
        // Lógica de astronauta y cámara
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
          // Primera persona
          camera.position.copy(window.astronaut.position).add(headOffset);
          camera.lookAt(camera.position.clone().add(lookDirection));
        } else if (cameraMode === 1) {
          // Tercera persona cercana
          const offset = new THREE.Vector3(0, 2, -3).applyAxisAngle(
            new THREE.Vector3(0, 1, 0),
            angle
          );
          camera.position.copy(window.astronaut.position).add(offset);
          camera.lookAt(window.astronaut.position);
        } else {
          // Tercera persona lejana
          const offset = new THREE.Vector3(0, 4, -8).applyAxisAngle(
            new THREE.Vector3(0, 1, 0),
            angle
          );
          camera.position.copy(window.astronaut.position).add(offset);
          camera.lookAt(window.astronaut.position);
        }
      }

      renderer.render(scene, camera);
      window.requestAnimationFrame(tick);
    };

    tick();
  },
  undefined,
  (error) => {
    console.error("Error al cargar el modelo:", error);
  }
);

// Helpers
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

document.addEventListener("pointerlockchange", () => {
  canvas.style.cursor = isViewOnly ? "crosshair" : "none";
});
