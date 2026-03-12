import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Scene } from './components/Scene';
import { Effects } from './components/Effects';
import { HUD } from './components/HUD';
import { Loader } from '@react-three/drei';

const App: React.FC = () => {
  return (
    <div className="w-full h-full relative bg-black">
      <HUD />
      <Canvas shadows dpr={[1, 2]}>
        <Suspense fallback={null}>
          <Scene />
          <Effects />
        </Suspense>
      </Canvas>
      <Loader 
        containerStyles={{ backgroundColor: '#050011' }}
        innerStyles={{ width: '50%' }}
        barStyles={{ backgroundColor: '#00f3ff', height: '5px' }}
        dataStyles={{ fontSize: '1.5rem', fontFamily: 'Orbitron', color: '#00f3ff' }}
        dataInterpolation={(p) => `Loading System ${p.toFixed(0)}%`}
      />
    </div>
  );
};

export default App;