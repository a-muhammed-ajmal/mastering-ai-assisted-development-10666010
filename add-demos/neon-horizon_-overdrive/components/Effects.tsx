import React from 'react';
import { EffectComposer, Bloom, ChromaticAberration, Noise, Vignette } from '@react-three/postprocessing';
import { BlendFunction, Vector2 } from 'three';

export const Effects: React.FC = () => {
  return (
    <EffectComposer disableNormalPass>
      <Bloom 
        luminanceThreshold={0.6} 
        luminanceSmoothing={0.9} 
        intensity={2.0} 
        mipmapBlur 
      />
      <ChromaticAberration 
         offset={new Vector2(0.002, 0.002)} 
         radialModulation={false} 
         modulationOffset={0} 
      />
      <Noise opacity={0.05} />
      <Vignette eskil={false} offset={0.1} darkness={1.1} />
    </EffectComposer>
  );
};