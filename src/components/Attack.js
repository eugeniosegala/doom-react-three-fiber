import React from "react";
import { useSphere } from "@react-three/cannon";

const Attack = (props) => {
  const [sphereRef, api] = useSphere(() => ({
    mass: 5,
    args: [0.1, 0.1, 0.1],
    ...props,
  }));

  setTimeout(() => {
    api.position.set(-1000, -1000, -1000);
  }, 2000);

  return (
    <mesh ref={sphereRef}>
      <sphereBufferGeometry args={[0.1, 32, 32]} />
      <meshLambertMaterial color="hotpink" />
    </mesh>
  );
};

const isSameType = (prevProps, nextProps) => {
  return prevProps.position === nextProps.position;
};

export default React.memo(Attack, isSameType);
