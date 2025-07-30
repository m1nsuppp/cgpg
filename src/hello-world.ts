import * as THREE from 'three';

export function helloWorld(): void {
  const root = document.getElementById('root');
  if (root === null) {
    throw new Error('root element not found');
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  root.appendChild(renderer.domElement);

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  camera.position.z = 10;

  const light = new THREE.DirectionalLight(0xffffff, 3);
  light.position.set(-1, 2, 4);
  scene.add(light);

  const animate = (callback: () => void): void => {
    requestAnimationFrame(() => {
      callback();
      animate(callback);
    });
  };

  animate(() => {
    cube.rotation.z = (cube.rotation.z + 0.01) % (Math.PI * 2);
    cube.rotation.y = (cube.rotation.y + 0.01) % (Math.PI * 2);

    renderer.render(scene, camera);
  });
}
