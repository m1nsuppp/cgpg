import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

(() => {
  const root = document.getElementById('root');
  if (root === null) {
    throw new Error('root element not found');
  }

  const scene = new THREE.Scene();
  const fov = 75;
  const aspectRatio = window.innerWidth / window.innerHeight;
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far);
  camera.position.set(1, 1, 5);

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  root.appendChild(renderer.domElement);

  const createTextTexture = (text: string): THREE.CanvasTexture => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (context === null) {
      throw new Error('Failed to get 2d context');
    }
    canvas.width = 256;
    canvas.height = 512; // for 1:2 ratio rectangle
    context.fillStyle = '#d3d3d3'; // Light gray background
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.font = 'bold 40px Arial';
    context.fillStyle = 'black';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canvas.width / 2, canvas.height / 2);
    return new THREE.CanvasTexture(canvas);
  };

  const cubeGeometry = new THREE.BoxGeometry(1, 2, 3);
  const faceLabels = ['오른쪽', '왼쪽', '위', '아래', '앞', '뒤'];
  const materials = faceLabels.map(
    (label) =>
      new THREE.MeshPhongMaterial({
        map: createTextTexture(label),
      }),
  );
  const cube = new THREE.Mesh(cubeGeometry, materials);
  scene.add(cube);
  const cubeAxesHelper = new THREE.AxesHelper(5);
  scene.add(cubeAxesHelper);

  // const light = new THREE.PointLight(0xffffff, 30);
  // light.position.set(2, 2, 2);
  // scene.add(light);
  const ambientLight = new THREE.AmbientLight(0x404040, 30);
  scene.add(ambientLight);

  // camera.up.set(0, 0, 1);
  // camera.up.set(1, 0, 0);
  // camera.up.set(0, 1, 0);

  camera.up.set(0, 0, -1);
  // camera.up.set(0, -1, 0);
  // camera.up.set(-1, 0, 0);
  camera.lookAt(cube.position);

  const controls = new OrbitControls(camera, renderer.domElement);

  const animate = (callback: () => void): void => {
    requestAnimationFrame(() => {
      callback();
      animate(callback);
    });
  };

  animate(() => {
    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;
    controls.update();
    renderer.render(scene, camera);
  });
})();
