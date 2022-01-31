import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { Canvas } from "@react-three/fiber";
import { Loader } from "@react-three/drei";

import SampleLevel from "./levels/SampleLevel";
import PhysicalMovements from "./components/PhysicalMovements";
import UI from "./components/UI";
import Crosshair from "./components/Crosshair";
import Gun from "./components/Gun";

import "./index.css";

const Game = () => {
  return (
    <>
      <Loader />
      <PhysicalMovements />
      <UI>
        <Crosshair />
        <Gun />
      </UI>
      <Canvas
        mode="concurrent"
        camera={{ position: [0, 5, 0], rotation: [0, 3.2, 0] }}
      >
        <Suspense fallback={null}>
          <SampleLevel />
        </Suspense>
      </Canvas>
    </>
  );
};

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);
root.render(<Game />);
