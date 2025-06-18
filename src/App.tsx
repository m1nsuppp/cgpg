import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function Desk({ width = 1, depth = 0.6, height = 0.4 }) {
  const legThickness = 0.05;
  const tableTopThickness = 0.03;

  // 다리 위치 자동 계산
  const legPositions = [
    [width / 2 - legThickness, -height / 2, depth / 2 - legThickness], // 앞쪽 오른쪽
    [-width / 2 + legThickness, -height / 2, depth / 2 - legThickness], // 앞쪽 왼쪽
    [width / 2 - legThickness, -height / 2, -depth / 2 + legThickness], // 뒤쪽 오른쪽
    [-width / 2 + legThickness, -height / 2, -depth / 2 + legThickness], // 뒤쪽 왼쪽
  ];

  return (
    <group position={[0, height / 2, 0]}>
      {/* 책상 상판 */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[width, tableTopThickness, depth]} />
        <meshStandardMaterial color="#8B4513" roughness={0.8} metalness={0.2} />
      </mesh>

      {/* 다리 4개 */}
      {legPositions.map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <boxGeometry args={[legThickness, height, legThickness]} />
          <meshStandardMaterial
            color="#333333"
            roughness={0.8}
            metalness={0.2}
          />
        </mesh>
      ))}

      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
    </group>
  );
}

function App() {
  const [deskSize, setDeskSize] = useState({
    width: 1, // 1m
    depth: 0.6, // 60cm
    height: 0.4, // 40cm
  });

  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex" }}>
      {/* 사이드바 */}
      <div style={{ width: "250px", padding: "20px", background: "#f5f5f5" }}>
        <h3>책상 크기 조절</h3>
        <div style={{ marginBottom: "15px" }}>
          <label>가로: {deskSize.width.toFixed(2)}m</label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={deskSize.width}
            onChange={(e) =>
              setDeskSize({ ...deskSize, width: parseFloat(e.target.value) })
            }
            style={{ width: "100%" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>깊이: {deskSize.depth.toFixed(2)}m</label>
          <input
            type="range"
            min="0.3"
            max="1.5"
            step="0.1"
            value={deskSize.depth}
            onChange={(e) =>
              setDeskSize({ ...deskSize, depth: parseFloat(e.target.value) })
            }
            style={{ width: "100%" }}
          />
        </div>
        <div>
          <label>높이: {deskSize.height.toFixed(2)}m</label>
          <input
            type="range"
            min="0.2"
            max="1"
            step="0.05"
            value={deskSize.height}
            onChange={(e) =>
              setDeskSize({ ...deskSize, height: parseFloat(e.target.value) })
            }
            style={{ width: "100%" }}
          />
        </div>
      </div>

      {/* 3D 뷰 */}
      <div style={{ flex: 1 }}>
        <Canvas camera={{ position: [2, 2, 2], fov: 50 }}>
          <Desk {...deskSize} />
          <OrbitControls />
          <gridHelper args={[10, 10]} />
          <axesHelper args={[2]} />
        </Canvas>
      </div>
    </div>
  );
}

export default App;
