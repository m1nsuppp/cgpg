import * as THREE from 'three';

export function createCustomCamera(): { run: () => void } {
  const root = document.getElementById('root');
  if (root === null) {
    throw new Error('root element not found');
  }

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('white');

  const createRedCube = (): THREE.Mesh => {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 'red' });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, 0, 0);

    return cube;
  };

  const createCamera = (): THREE.PerspectiveCamera => {
    const near = 0.1;
    const far = 100;
    const fov = 75;
    const aspectRatio = window.innerWidth / window.innerHeight;

    return new THREE.PerspectiveCamera(fov, aspectRatio, near, far);
  };

  return {
    run: () => {
      const cube = createRedCube();
      scene.add(cube);

      const camera = createCamera();
      camera.position.set(0, 1, 5);
      const distance = cube.position.distanceTo(camera.position);

      camera.near = distance - 0.5;
      camera.updateProjectionMatrix();

      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      root.appendChild(renderer.domElement);

      renderer.render(scene, camera);

      const cursor: { x: number; y: number } = { x: 0, y: 0 };

      window.addEventListener('wheel', () => {
        camera.near = 0.1;
        camera.updateProjectionMatrix();
      });

      window.addEventListener('mousemove', (event: MouseEvent) => {
        cursor.x = event.clientX / window.innerWidth - 0.5;
        cursor.y = (event.clientY / window.innerHeight - 0.5) * -1;
      });

      const animate = (callback: () => void): void => {
        requestAnimationFrame(() => {
          callback();
          animate(callback);
        });
      };

      animate(() => {
        console.log(cursor);
        camera.position.x = cursor.x;
        camera.position.y = cursor.y;

        renderer.render(scene, camera);
      });
    },
  };
}
