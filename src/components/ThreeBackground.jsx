import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

// Floating particles component
function FloatingParticles() {
  const ref = useRef();
  const particleCount = 1000;

  // Generate random positions for particles
  const positions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return positions;
  }, []);

  // Animate particles
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.1;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#8b5cf6"
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  );
}

// Rotating geometric shapes
function GeometricShapes() {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = state.clock.elapsedTime * 0.1;
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Wireframe torus */}
      <mesh position={[-3, 2, -5]}>
        <torusGeometry args={[1, 0.3, 16, 100]} />
        <meshBasicMaterial color="#6366f1" wireframe />
      </mesh>

      {/* Wireframe octahedron */}
      <mesh position={[3, -2, -3]}>
        <octahedronGeometry args={[1]} />
        <meshBasicMaterial color="#8b5cf6" wireframe />
      </mesh>

      {/* Wireframe icosahedron */}
      <mesh position={[0, 3, -7]}>
        <icosahedronGeometry args={[0.8]} />
        <meshBasicMaterial color="#a855f7" wireframe />
      </mesh>
    </group>
  );
}

// Main Three.js background component
const ThreeBackground = () => {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: "transparent" }}
      >
        <FloatingParticles />
        <GeometricShapes />
      </Canvas>
    </div>
  );
};

export default ThreeBackground;
