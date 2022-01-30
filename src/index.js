import React from "react";
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
      <Canvas camera={{ position: [0, 5, 0], rotation: [0, 0, 0] }}>
        <SampleLevel />
      </Canvas>
    </>
  );
};

ReactDOM.render(<Game />, document.getElementById("root"));
