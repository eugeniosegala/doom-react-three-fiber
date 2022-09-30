import React, { useCallback, useRef } from "react";

import throttle from "lodash-es/throttle";
import { useFrame } from "@react-three/fiber";

const FlatObject = ({ texture, position, name }) => {
  const ref = useRef();

  const objectControl = useCallback(
    throttle((camera) => {
      ref.current.lookAt(
        camera.position.x,
        camera.position.y - 0.5,
        camera.position.z
      );
    }, 50),
    []
  );

  useFrame(({ camera }) => objectControl(camera));

  return (
    <mesh ref={ref} position={position} name={name}>
      <planeGeometry attach="geometry" />
      <meshStandardMaterial
        attach="material"
        transparent={true}
        map={texture}
      />
    </mesh>
  );
};

const isSameType = (prevProps, nextProps) => {
  return prevProps.type === nextProps.type;
};

export default React.memo(FlatObject, isSameType);
