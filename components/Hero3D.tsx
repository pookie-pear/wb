'use client';

import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, ContactShadows } from '@react-three/drei';
import Link from 'next/link';

// Simple mannequin placeholder
const MannequinPlaceholder = () => {
  return (
    <group position={[0, -2, 0]}>
      <mesh castShadow position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.4, 0.3, 3, 32]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[1, 0.05, 1]} />
        <meshStandardMaterial color="#050505" />
      </mesh>
    </group>
  );
};

const JeansModel = ({ modelPath }: { modelPath: string }) => {
  const { scene } = useGLTF(modelPath);
  return <primitive object={scene} scale={2.2} position={[0, -2, 0]} />;
};

const CategoryCircle = ({ label, href }: { label: string, href: string }) => (
  <Link 
    href={href}
    className="group relative flex items-center justify-center transition-transform duration-700 hover:scale-110"
  >
    <div className="w-28 h-28 md:w-36 md:h-36 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-md bg-white/5 transition-all duration-700 group-hover:bg-white group-hover:border-white shadow-[0_0_30px_rgba(255,255,255,0.05)] group-hover:shadow-[0_0_50px_rgba(255,255,255,0.2)]">
      <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-white group-hover:text-black transition-colors duration-700">
        {label}
      </span>
    </div>
  </Link>
);

const Scene = () => {
  const controlsRef = useRef<any>(null);
  const [autoRotate, setAutoRotate] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetTimer = () => {
    setAutoRotate(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setAutoRotate(true);
    }, 5000);
  };

  useEffect(() => {
    // Initial timer setup after mount
    const timeoutId = setTimeout(() => {
      setAutoRotate(true);
    }, 5000);
    timerRef.current = timeoutId;

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <>
      <OrbitControls 
        ref={controlsRef}
        enablePan={false}
        enableZoom={false}
        enableDamping={true}
        dampingFactor={0.05}
        autoRotate={autoRotate}
        autoRotateSpeed={0.5}
        onStart={() => setAutoRotate(false)}
        onEnd={resetTimer}
        maxPolarAngle={Math.PI / 1.8}
        minPolarAngle={Math.PI / 2.2}
      />
      
      <Suspense fallback={<MannequinPlaceholder />}>
        <JeansModel modelPath="/assets/jeans_1model.glb" />
        <ContactShadows 
          position={[0, -2, 0]} 
          opacity={0.4} 
          scale={10} 
          blur={2.5} 
          far={10} 
          color="#000000"
          resolution={512}
        />
      </Suspense>

      <ambientLight intensity={0.5} />
      <spotLight position={[10, 20, 10]} angle={0.15} penumbra={1} intensity={2} color="#fff" castShadow shadow-map={undefined} />
      <pointLight position={[-10, 10, -10]} intensity={1} color="#fff" />
      <directionalLight position={[0, 5, 5]} intensity={1.5} color="#fff" />
    </>
  );
};

const Hero3D = () => {
  return (
    <div className="w-full h-screen relative bg-transparent overflow-hidden flex flex-col items-center justify-center">
      <div className="absolute inset-0 bg-transparent z-0"></div>
      
      <div className="absolute top-[15%] z-20 text-center w-full px-4">
        <h1 className="text-7xl md:text-[12rem] font-extralight tracking-[0.3em] text-white uppercase mb-6 opacity-90 leading-none">
          DENIM<span className="font-medium">HAZE</span>
        </h1>
        <p className="text-xs md:text-sm tracking-[1em] text-white/40 uppercase font-bold italic">
          FIND YOUR FIT
        </p>
      </div>

      <div className="absolute top-[55%] left-0 right-0 z-30 flex items-center justify-center px-4 pointer-events-none">
        <div className="flex space-x-4 md:space-x-12 pointer-events-auto">
          <CategoryCircle label="MEN'S" href="/?gender=men" />
          <CategoryCircle label="WOMEN" href="/?gender=women" />
          <CategoryCircle label="SALE" href="/?gender=sale" />
        </div>
      </div>

      <div className="w-full h-full absolute inset-0 z-10">
        <Canvas shadows camera={{ position: [0, 0, 8], fov: 35 }}>
          <Scene />
        </Canvas>
      </div>

      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: 'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)', backgroundSize: '200px 200px' }}>
      </div>
    </div>
  );
};

export default Hero3D;
