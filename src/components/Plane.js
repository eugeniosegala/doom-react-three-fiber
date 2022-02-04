import React from "react";
import { Plane } from "@react-three/drei";

const PlaneOb = ({ position, rotation, colour }) => {
  return (
    <Plane
      position={position}
      rotation={rotation}
      args={[200, 200]}
      name="plane"
      receiveShadow
    >
      <meshStandardMaterial attach="material" color={colour} />
    </Plane>
  );
};

export default React.memo(PlaneOb);
