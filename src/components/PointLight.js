import React, { useCallback, useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import throttle from "lodash-es/throttle";

const PointLight = ({ position }) => {
  const ref = useRef();

  const playerControl = useCallback(
    throttle(() => {
      if (ref.current.position.x > 70) {
        ref.current.goRight = false;
      }

      if (ref.current.position.x < 30) {
        ref.current.goRight = true;
      }

      ref.current.position.x = ref.current.goRight
        ? ref.current.position.x + 0.1
        : ref.current.position.x - 0.1;
    }, 10),
    []
  );

  useFrame(playerControl);

  useEffect(() => {
    ref.current.goRight = true;
  }, []);

  console.log("Light rendering...");

  return (
    <pointLight
      ref={ref}
      distance={20}
      decay={2}
      position={position}
      intensity={1}
      castShadow={true}
      color="white"
    />
  );
};

const isSameType = (prevProps, nextProps) => {
  return prevProps.type === nextProps.type;
};

export default React.memo(PointLight, isSameType);
