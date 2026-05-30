'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface AIBrainProps {
  className?: string;
}

function fibonacciSphere(samples: number, radius: number): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  const phi = Math.PI * (Math.sqrt(5) - 1);

  for (let i = 0; i < samples; i++) {
    const y = 1 - (i / (samples - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = phi * i;

    points.push(new THREE.Vector3(
      Math.cos(theta) * r * radius,
      y * radius,
      Math.sin(theta) * r * radius
    ));
  }

  return points;
}

function NeuralNodes({ positions }: { positions: THREE.Vector3[] }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();

    positions.forEach((pos, i) => {
      const pulse = 1 + Math.sin(time * 2 + i * 0.5) * 0.3;
      dummy.position.copy(pos);
      dummy.scale.setScalar(pulse);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, positions.length]}>
      <sphereGeometry args={[0.04, 8, 8]} />
      <meshStandardMaterial
        color="#00f5ff"
        emissive="#00f5ff"
        emissiveIntensity={2}
        toneMapped={false}
      />
    </instancedMesh>
  );
}

function NeuralConnections({ positions }: { positions: THREE.Vector3[] }) {
  const lineRef = useRef<THREE.LineSegments>(null);

  const geometry = useMemo(() => {
    const linePositions: number[] = [];
    const colors: number[] = [];
    const connectionDistance = 0.8;

    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const dist = positions[i].distanceTo(positions[j]);
        if (dist < connectionDistance) {
          linePositions.push(
            positions[i].x, positions[i].y, positions[i].z,
            positions[j].x, positions[j].y, positions[j].z
          );
          const t = i / positions.length;
          colors.push(
            0 * (1 - t) + 0.42 * t,
            0.96 * (1 - t) + 0.39 * t,
            1 * (1 - t) + 1 * t,
            0 * (1 - t) + 0.42 * t,
            0.96 * (1 - t) + 0.39 * t,
            1 * (1 - t) + 1 * t
          );
        }
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    return geo;
  }, [positions]);

  return (
    <lineSegments ref={lineRef} geometry={geometry}>
      <lineBasicMaterial
        vertexColors
        transparent
        opacity={0.3}
      />
    </lineSegments>
  );
}

function BrainSphere({ nodeCount }: { nodeCount: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const nodePositions = useMemo(() => fibonacciSphere(nodeCount, 1.5), [nodeCount]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    groupRef.current.rotation.y = time * 0.1;
    groupRef.current.rotation.x = Math.sin(time * 0.05) * 0.1;
    const scale = 1 + Math.sin(time * 0.8) * 0.03;
    groupRef.current.scale.setScalar(scale);
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[1.5, 24, 24]} />
        <meshStandardMaterial
          color="#6c63ff"
          wireframe
          transparent
          opacity={0.08}
          emissive="#6c63ff"
          emissiveIntensity={0.3}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.48, 32, 32]} />
        <meshStandardMaterial
          color="#0a0a2e"
          transparent
          opacity={0.5}
        />
      </mesh>
      <NeuralNodes positions={nodePositions} />
      <NeuralConnections positions={nodePositions} />
    </group>
  );
}

function BrainScene({ nodeCount }: { nodeCount: number }) {
  return (
    <>
      <ambientLight intensity={0.2} color="#1a1a3e" />
      <pointLight position={[5, 5, 5]} intensity={1} color="#00f5ff" distance={15} />
      <pointLight position={[-5, -3, 3]} intensity={0.6} color="#6c63ff" distance={12} />
      <pointLight position={[0, -5, -5]} intensity={0.4} color="#00f5ff" distance={10} />
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5} floatingRange={[-0.1, 0.1]}>
        <BrainSphere nodeCount={nodeCount} />
      </Float>
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={false}
        maxPolarAngle={Math.PI * 0.7}
        minPolarAngle={Math.PI * 0.3}
      />
    </>
  );
}

// 2D fallback for mobile devices that can't handle WebGL well
function BrainFallback2D() {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="relative">
        {/* Pulsing core */}
        <div
          className="w-24 h-24 sm:w-32 sm:h-32 rounded-full animate-ai-pulse"
          style={{
            background: 'radial-gradient(circle at 35% 35%, rgba(0, 245, 255, 0.3) 0%, rgba(108, 99, 255, 0.15) 50%, rgba(10, 10, 26, 0.5) 100%)',
            border: '1px solid rgba(0, 245, 255, 0.2)',
          }}
        />
        {/* Orbiting rings */}
        <div className="absolute inset-[-20%] rounded-full border border-cyan-400/10 animate-orbit" />
        <div className="absolute inset-[-35%] rounded-full border border-violet-400/10 animate-orbit-reverse" />
      </div>
    </div>
  );
}

export default function AIBrain({ className = '' }: AIBrainProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const init = () => {
      setMounted(true);
      setIsMobile(window.innerWidth < 768);
    };
    init();
    window.addEventListener('resize', () => setIsMobile(window.innerWidth < 768));
    return () => window.removeEventListener('resize', () => setIsMobile(window.innerWidth < 768));
  }, []);

  if (!mounted) {
    return <div className={`h-full w-full ${className}`} />;
  }

  // On mobile screens, use 2D fallback for better performance
  if (isMobile) {
    return (
      <div className={`h-full w-full ${className}`}>
        <BrainFallback2D />
      </div>
    );
  }

  return (
    <div className={`h-full w-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
      >
        <BrainScene nodeCount={60} />
      </Canvas>
    </div>
  );
}
