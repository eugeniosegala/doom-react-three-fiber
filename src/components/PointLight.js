import React, { useCallback, useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import throttle from "lodash-es/throttle";

const PointLight = ({ position, type }) => {
  const ref = useRef();

  const [direction, setDirection] = useState(false);

  const playerControl = useCallback(
    throttle((direction) => {
      ref.current.position.x = direction
        ? ref.current.position.x - 0.1
        : ref.current.position.x + 0.1;
    }, 5),
    []
  );

  useFrame(() => playerControl(direction));

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection((direction) => !direction);
    }, 6000);

    return () => clearInterval(timer);
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
