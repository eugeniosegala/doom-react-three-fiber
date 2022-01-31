import React, { useRef, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import throttle from "lodash-es/throttle";
import { calcDistance } from "../utils/calcDistance";

const Bullet = ({ position, velocity }) => {
  const ref = useRef();

  const bulletControl = useCallback(
    throttle(async (scene) => {
      const collisions = scene.children.filter((e) => {
        return calcDistance(e.position, ref.current.position) <= 1;
      });

      if (collisions.length) {
        // console.log(collisions);
      }

      ref.current.position.set(
        velocity[0] + ref.current.position.x,
        velocity[1] + ref.current.position.y,
        velocity[2] + ref.current.position.z
      );
    }, 25),
    []
  );

  useFrame(({ scene }) => bulletControl(scene));

  console.log("Bullet rendering...");

  return (
    <mesh ref={ref} position={position}>
      <sphereBufferGeometry args={[0.1, 32, 32]} />
    </mesh>
  );
};

const isSamePosition = (prevProps, nextProps) => {
  return prevProps.position === nextProps.position;
};

export default React.memo(Bullet, isSamePosition);
