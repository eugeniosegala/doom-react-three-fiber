import React, { useRef, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import throttle from "lodash-es/throttle";
import { calcDistance } from "../utils/calcDistance";

const Bullet = ({ position, velocity }) => {
  const ref = useRef();

  const { scene } = useThree();

  const coinControl = useCallback(
    throttle(async () => {
      const collisions = scene.children.filter((e) => {
        return calcDistance(e.position, ref.current.position) <= 1;
      });

      if (collisions.length) {
        console.log(collisions);
      }

      ref.current.position.set(
        velocity[0] + ref.current.position.x + 0.01,
        velocity[1] + ref.current.position.y + 0.01,
        velocity[2] + ref.current.position.z + 0.01
      );
    }, 25),
    []
  );

  useFrame(coinControl);

  return (
    <mesh ref={ref} position={position}>
      <sphereBufferGeometry args={[0.1, 32, 32]} />
    </mesh>
  );
};

const isSameType = (prevProps, nextProps) => {
  return prevProps.position === nextProps.position;
};

export default React.memo(Bullet, isSameType);
