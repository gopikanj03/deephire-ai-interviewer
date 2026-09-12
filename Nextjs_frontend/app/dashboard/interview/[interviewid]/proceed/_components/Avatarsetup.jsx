"use client";
import { Canvas, useLoader } from "@react-three/fiber";
import React, { Suspense } from "react";
import { Environment, CameraControls, TransformControls, OrbitControls } from "@react-three/drei";
import { TextureLoader } from "three";
import  Avatar2  from "./Avatar2";
import { Leva, useControls } from "leva";


function Avatarsetup({ isSpeaking }) {
  const { animation } = useControls({
    animation: {
      value: "idle",
      options: ["greet", "talk9", "talk10"],
    },
  });
  
  const backgroundTexture = useLoader(TextureLoader, "/bg/office5.jpg");
  console.log("Avatarsetup isSpeaking:", isSpeaking);
  return (
    <div className="h-screen w-auto border mt-3 rounded-lg">
      <Leva collapsed />
      <Canvas
        camera={{ position: [0, -32, 7], fov: 3 }}
        onCreated={(state) => {
          state.scene.background = backgroundTexture;
        }}
      >
        <Suspense fallback={null}>
        
          <CameraManager />
          <Environment preset="studio" intensity={0.4} />
          
          {/* Increased ambient light for better overall visibility */}
          <ambientLight intensity={0.6} color="white" />
          
          {/* Main front light - repositioned and intensified for better face illumination */}
          <directionalLight
            position={[0, 2, 10]}
            intensity={1.5}
            castShadow
          />
          
          {/* Face-specific fill light */}
          <spotLight
            position={[0, 1, 8]}
            intensity={.4}
            angle={0.4}
            penumbra={0.2}
            castShadow={false}
            color="#ffffff"
          />
          
          {/* Eye-specific accent lights */}
          <pointLight
            position={[-0.5, 0, 5]}
            intensity={0.8}
            distance={10}
            color="#f0f8ff"
          />
          <pointLight
            position={[0.5, 0, 5]}
            intensity={0.8}
            distance={10}
            color="#f0f8ff"
          />
          
          {/* Side fill light */}
          <directionalLight
            position={[4, 0, 5]}
            intensity={0.6}
            castShadow={false}
          />
          
          {/* Top light for hair definition */}
          <directionalLight
            position={[0, 8, 3]}
            intensity={0.2}
            castShadow={false}
          />
          
          {/* Soft rim light for depth */}
          <spotLight
            position={[0, 3, -6]}
            intensity={0.4}
            angle={0.8}
            penumbra={0.5}
            castShadow={false}
            color="#e6f0ff"
          />
          
          
           
          {/* <InterviewDesk/> */}
            
         
           
          <Avatar2 animation={animation} position={[.1, -6.8, 0]} isSpeaking={isSpeaking} />
        </Suspense>
      </Canvas>
    </div>
  );
}

const CameraManager = () => {
  return (
    <CameraControls
      minAzimuthAngle={-Math.PI / 8}
      maxAzimuthAngle={Math.PI / 8}
      minPolarAngle={Math.PI / 2.8}
      maxPolarAngle={Math.PI / 2.2}
      minDistance={1.5}
      maxDistance={3.0}
      dollySpeed={0.1}
      azimuthRotateSpeed={0.5}
      polarRotateSpeed={0.5}
      mouseButtons={{
        LEFT: 1,
        MIDDLE: 4,
        RIGHT: 2,
      }}
      touches={{
        ONE: 1,
        TWO: 2,
      }}
    />
  );
};

export default Avatarsetup;




