import React from "react";
import ReactDOM from "react-dom";
import { Canvas } from "@react-three/fiber";
import { useProgress } from "@react-three/drei";
import { Physics } from "@react-three/cannon";

import SampleLevel from "./levels/SampleLevel";
import PhysicalMovements from "./components/PhysicalMovements";

import "./index.css";

function Loader() {
  const { progress } = useProgress();
  return <div>loading {progress.toFixed()} %</div>;
}

const Game = () => {
  return (
    <>
      {/* <Loader /> */}
      <PhysicalMovements />
      <Canvas camera={{ position: [0, 5, 0], rotation: [0, 0, 0] }}>
        <Physics
          broadphase="SAP"
          defaultContactMaterial={{
            contactEquationRelaxation: 4,
            friction: 0.05
          }}
        >
          <SampleLevel />
        </Physics>
      </Canvas>
    </>
  );
};

ReactDOM.render(<Game />, document.getElementById("root"));
