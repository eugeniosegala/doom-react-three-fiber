import React, { useCallback, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import throttle from "lodash-es/throttle";

const PointLight = ({ position, type }) => {
  const ref = useRef();

  const playerControl = useCallback(
    throttle(() => {
      const limit = ref.current.position.x < 73;

      ref.current.position.x = limit ? ref.current.position.x + 0.1 : 30;
    }, 10),
    []
  );

  useFrame(playerControl);

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
