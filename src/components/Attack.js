import React, { useRef } from "react";

import { bomb } from "../utils/textureManager";

const Attack = () => {
  const ref = useRef();
  return (
    <mesh ref={ref} position={[1, 0, 0]}>
      <boxBufferGeometry attach="geometry" />
      <meshStandardMaterial attach="material" transparent={true} map={bomb} />
    </mesh>
  );
};

export default Attack;
