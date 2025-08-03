import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

export function helloWorld(): void {
  const scene = new THREE.Scene();
  const camera1 = new THREE.PerspectiveCamera(80, 1 / 2, 0.1, 10);
  const camera2 = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
  const camera3 = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
  const camera4 = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);

  const canvas1 = document.createElement('canvas');
  const canvas2 = document.createElement('canvas');
  const canvas3 = document.createElement('canvas');
  const canvas4 = document.createElement('canvas');

  const renderer1 = new THREE.WebGLRenderer({ canvas: canvas1 });
  renderer1.setSize(256, 256);

  const renderer2 = new THREE.WebGLRenderer({ canvas: canvas2 });
  renderer2.setSize(256, 256);

  const renderer3 = new THREE.WebGLRenderer({ canvas: canvas3 });
  renderer3.setSize(256, 256);

  const renderer4 = new THREE.WebGLRenderer({ canvas: canvas4 });
  renderer4.setSize(256, 256);

  const controls = new OrbitControls(camera1, renderer1.domElement);

  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({ color: 'green', wireframe: true });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  camera1.position.z = 10;
  camera2.position.y = 2;
  camera2.lookAt(new THREE.Vector3(0, 0, 0));
  camera3.position.z = -0.05;
  camera4.position.x = 2;
  camera4.lookAt(new THREE.Vector3(0, 0, 0));

  const root = document.getElementById('root');
  if (root === null) {
    throw new Error('root element not found');
  }

  root.appendChild(canvas1);
  root.appendChild(canvas2);
  root.appendChild(canvas3);
  root.appendChild(canvas4);

  const animate = (): void => {
    requestAnimationFrame(animate);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    controls.update();

    renderer1.render(scene, camera1);
    renderer2.render(scene, camera2);
    renderer3.render(scene, camera3);
    renderer4.render(scene, camera4);
  };

  animate();
}
