import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function createTableConfigurator(): {
  run: () => Promise<void>;
} {
  return {
    run: async () => {
      const root = document.getElementById('root');
      if (root === null) {
        throw new Error('root element not found');
      }

      const scene = new THREE.Scene();
      scene.background = new THREE.Color('white');

      const loader = new GLTFLoader();
      const loadTablePromise = loader.loadAsync('./table.gltf');

      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000,
      );
      camera.position.set(0, 1, 5);

      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      root.appendChild(renderer.domElement);

      const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(5, 10, 7.5);
      scene.add(directionalLight);

      const { scene: table } = await loadTablePromise;
      table.position.set(0, 1, 0);
      scene.add(table);

      table.traverse((child) => {
        if (
          isMatEditableMesh(child) &&
          (child.name === 'Legs02Right' ||
            child.name === 'Legs03Right' ||
            child.name === 'Legs02Left' ||
            child.name === 'Legs03Left')
        ) {
          child.visible = false;
        }
      });

      table.children
        .filter((child) => child.visible)
        .forEach((child) => {
          if (
            isMatEditableMesh(child) &&
            (child.name === 'Legs01Right' || child.name === 'Legs01Left')
          ) {
            child.material.color.set('#00FF00');
            child.material.metalness = 0.5;
            // child.material.emissive.set('#003300');
            // console.log(child.material);
          }
        });

      const animate = (): void => {
        requestAnimationFrame(animate);
        table.rotation.y += 0.001;
        renderer.render(scene, camera);
      };
      animate();
    },
  };
}

const isMatEditableMesh = (
  obj: THREE.Object3D,
): obj is
  | THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial>
  | THREE.InstancedMesh<
      THREE.BufferGeometry,
      THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial
    > =>
  obj instanceof THREE.Mesh ||
  (obj instanceof THREE.InstancedMesh &&
    (obj.material instanceof THREE.MeshStandardMaterial ||
      obj.material instanceof THREE.MeshPhysicalMaterial));
