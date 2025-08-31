import * as THREE from 'three';

const DPR_CAP = 2;
const BACKGROUND_COLOR = 0x111111;
const FOV = 70;
const NEAR = 0.1;
const FAR = 100;
const CAM_POS = { x: 4, y: 3, z: 6 } as const;
const AMBIENT_INTENSITY = 0.6;
const DIR_INTENSITY = 0.8;
const DIR_POS = { x: 5, y: 10, z: 7 } as const;
const GRID_SIZE = 50;
const GRID_DIVISIONS = 50;
const GRID_COLOR1 = 0x333333;
const GRID_COLOR2 = 0x222222;
const BOX_SIZE = 1;
const BOX_COLOR = 0x2ecc71;
const SPEED_UNITS_PER_SEC = 4;
const AMBIENT_COLOR = 0xffffff;
const DIRECTIONAL_COLOR = 0xffffff;
const PLANE_SIZE = 100;
const GROUND_COLOR = 0x222222;
const HALF_PI = Math.PI / 2;
const GRAVITY = -9.81; // m/s^2-like
const CAMERA_FOLLOW_LERP = 0.12; // [0..1]
const CAMERA_OFFSET = { x: CAM_POS.x, y: CAM_POS.y, z: CAM_POS.z } as const;

export function runMovableBox(): void {
  const root = document.getElementById('root');
  if (root === null) {
    throw new Error('root element not found');
  }

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, DPR_CAP));
  renderer.setSize(window.innerWidth, window.innerHeight);
  root.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(BACKGROUND_COLOR);

  const camera = new THREE.PerspectiveCamera(
    FOV,
    window.innerWidth / window.innerHeight,
    NEAR,
    FAR,
  );
  camera.position.set(CAM_POS.x, CAM_POS.y, CAM_POS.z);
  camera.lookAt(0, 0, 0);

  const ambient = new THREE.AmbientLight(AMBIENT_COLOR, AMBIENT_INTENSITY);
  scene.add(ambient);
  const dir = new THREE.DirectionalLight(DIRECTIONAL_COLOR, DIR_INTENSITY);
  dir.position.set(DIR_POS.x, DIR_POS.y, DIR_POS.z);
  scene.add(dir);

  const grid = new THREE.GridHelper(GRID_SIZE, GRID_DIVISIONS, GRID_COLOR1, GRID_COLOR2);
  scene.add(grid);

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(PLANE_SIZE, PLANE_SIZE),
    new THREE.MeshStandardMaterial({ color: GROUND_COLOR }),
  );
  ground.rotation.x = -HALF_PI;
  ground.position.y = 0;
  scene.add(ground);

  const box = new THREE.Mesh(
    new THREE.BoxGeometry(BOX_SIZE, BOX_SIZE, BOX_SIZE),
    new THREE.MeshStandardMaterial({ color: BOX_COLOR }),
  );
  scene.add(box);
  box.position.y = BOX_SIZE / 2;

  const pressed = new Set<string>();
  const onDown = (e: KeyboardEvent): void => {
    pressed.add(e.key.toLowerCase());
  };
  const onUp = (e: KeyboardEvent): void => {
    pressed.delete(e.key.toLowerCase());
  };
  window.addEventListener('keydown', onDown);
  window.addEventListener('keyup', onUp);

  const onResize = (): void => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener('resize', onResize);

  const clock = new THREE.Clock();
  let velY = 0;

  const animate = (): void => {
    const dt = clock.getDelta();

    let vx = 0;
    let vz = 0;
    if (pressed.has('w') || pressed.has('arrowup')) vz -= 1;
    if (pressed.has('s') || pressed.has('arrowdown')) vz += 1;
    if (pressed.has('a') || pressed.has('arrowleft')) vx -= 1;
    if (pressed.has('d') || pressed.has('arrowright')) vx += 1;

    if (vx !== 0 || vz !== 0) {
      const len = Math.hypot(vx, vz);
      vx /= len;
      vz /= len;
      box.position.x += vx * SPEED_UNITS_PER_SEC * dt;
      box.position.z += vz * SPEED_UNITS_PER_SEC * dt;
    }

    velY += GRAVITY * dt;
    box.position.y += velY * dt;
    const minY = BOX_SIZE / 2;
    if (box.position.y < minY) {
      box.position.y = minY;
      velY = 0;
    }

    const targetCamPos = new THREE.Vector3(
      box.position.x + CAMERA_OFFSET.x,
      box.position.y + CAMERA_OFFSET.y,
      box.position.z + CAMERA_OFFSET.z,
    );
    camera.position.lerp(targetCamPos, CAMERA_FOLLOW_LERP);
    camera.lookAt(box.position);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };

  animate();
}
