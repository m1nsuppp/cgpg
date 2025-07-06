import type { JSX } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';

export function App(): JSX.Element {
  return (
    <div className="w-screen h-svh flex justify-center items-center bg-gradient-to-b from-[#d9afd9] to-[#97d9e1]">
      <Canvas
        shadows
        camera={{ position: [5, 5, 5] }}
      >
        <Stage adjustCamera={5}>
          <mesh castShadow>
            <meshNormalMaterial />
            <boxGeometry />
          </mesh>
        </Stage>
        <OrbitControls
          makeDefault
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}
