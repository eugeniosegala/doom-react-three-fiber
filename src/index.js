import React, { Suspense } from "react";
import * as ReactDOM from 'react-dom/client';
import { Canvas } from "@react-three/fiber";
import { Loader } from "@react-three/drei";

import Level01 from "./levels/Level01";
import UI from "./components/UI";
import ViewFinder from "./components/ViewFinder";
import Gun from "./components/Gun";

import "./index.css";

const Game = () => {
  return (
    <>
      <Loader />
      <UI>
        <ViewFinder />
        <Gun />
      </UI>
      <Canvas
        shadows={{
          type: "BasicShadowMap",
        }}
        mode="concurrent"
        camera={{ position: [0, 5, 0], rotation: [0, 3.2, 0] }}
      >
        <Suspense fallback={null}>
          <Level01 />
        </Suspense>
      </Canvas>
    </>
  );
};

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);
root.render(<Game />);
