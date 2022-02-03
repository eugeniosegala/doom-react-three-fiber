import React from "react";

const Plane = ({ position, rotation, colour }) => {
  return (
    <mesh position={position} rotation={rotation} name="plane">
      <planeBufferGeometry attach="geometry" args={[200, 200]} />
      <meshStandardMaterial attach="material" color={colour} />
    </mesh>
  );
};

export default React.memo(Plane);
