import React from "react";
import { useSphere } from "@react-three/cannon";

const Bullet = (props) => {
  const [sphereRef, api] = useSphere(() => ({
    mass: 5,
    args: [0.1, 0.1, 0.1],
    onCollide: () => {
      api.sleep();
      api.position.set(-1000, -1000, -1000);
    },
    ...props,
  }));

  return (
    <mesh ref={sphereRef}>
      <sphereBufferGeometry args={[0.1, 32, 32]} />
    </mesh>
  );
};

const isSameType = (prevProps, nextProps) => {
  return prevProps.position === nextProps.position;
};

export default React.memo(Bullet, isSameType);
