import React from "react";
import ReactDOM from "react-dom";
import { Canvas } from "@react-three/fiber";
import { useProgress } from "@react-three/drei";

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
      <Canvas orthographic camera={{ zoom: 50, position: [0, 5, 0] }}>
        <SampleLevel />
      </Canvas>
    </>
  );
};

ReactDOM.render(<Game />, document.getElementById("root"));
