import * as THREE from 'three';

interface SolarSystem {
  run: () => void;
}

export function createSolarSystem(): SolarSystem {
  return {
    run: () => {
      const root = document.getElementById('root');
      if (root === null) {
        throw new Error('root element not found');
      }

      const objects: THREE.Object3D[] = [];

      const solarSystem = new THREE.Object3D();

      const scene = new THREE.Scene();
      scene.add(solarSystem);
      objects.push(solarSystem);
      const camera = new THREE.PerspectiveCamera(
        40,
        window.innerWidth / window.innerHeight,
        0.1,
        1000,
      );
      camera.position.set(0, 150, 0);
      camera.up.set(0, 0, 1);
      camera.lookAt(0, 0, 0);

      const light = new THREE.PointLight(0xffffff, 500);
      scene.add(light);

      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      root.appendChild(renderer.domElement);

      const radius = 1;
      const widthSegments = 6;
      const heightSegments = 6;

      const sphereGeometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
      const sunMaterial = new THREE.MeshPhongMaterial({ emissive: 0xffff00 });
      const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
      sunMesh.scale.set(5, 5, 5);
      solarSystem.add(sunMesh);
      objects.push(sunMesh);

      const earthOrbit = new THREE.Object3D();
      earthOrbit.position.x = 10;
      solarSystem.add(earthOrbit);
      objects.push(earthOrbit);

      const earthMaterial = new THREE.MeshPhongMaterial({ color: 0x2233ff, emissive: 0x112244 });
      const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
      earthOrbit.add(earthMesh);
      objects.push(earthMesh);

      const moonOrbit = new THREE.Object3D();
      moonOrbit.position.x = 2;
      earthOrbit.add(moonOrbit);

      const moonMaterial = new THREE.MeshPhongMaterial({ color: 0x888888, emissive: 0x222222 });
      const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
      moonMesh.scale.set(0.5, 0.5, 0.5);
      moonOrbit.add(moonMesh);
      objects.push(moonMesh);

      const render: FrameRequestCallback = (time) => {
        time *= 0.001;

        objects.forEach((obj) => {
          obj.rotation.y = time;
        });

        renderer.render(scene, camera);
        requestAnimationFrame(render);
      };

      requestAnimationFrame(render);
    },
  };
}
