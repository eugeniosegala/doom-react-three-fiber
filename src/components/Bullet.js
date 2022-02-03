import React, { useRef, useCallback, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import throttle from "lodash-es/throttle";
import { calcDistance } from "../utils/calcDistance";
import fireSound from "../sounds/fire.mp3";

const Bullet = ({ position, velocity }) => {
  const sound = new Audio(fireSound);
  const ref = useRef();

  useEffect(() => {
    sound.play();
  }, []);

  const bulletControl = useCallback(
    throttle(async (scene) => {
      const position = ref.current?.position;

      const collisions = scene.children.filter((e) => {
        return calcDistance(e.position, position) <= 1;
      });

      if (collisions.length) {
        // console.log(collisions);
      }

      ref?.current?.position.set(
        velocity[0] + position?.x,
        velocity[1] + position?.y,
        velocity[2] + position?.z
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
