import React, { useCallback, useRef } from "react";

import throttle from "lodash-es/throttle";
import { useFrame, useThree } from "@react-three/fiber";

const FlatObject = ({ texture, position, name }) => {
  const ref = useRef();
  const { camera } = useThree();

  const objectControl = useCallback(
    throttle(() => {
      ref.current.lookAt(camera.position);
    }, 100),
    []
  );

  useFrame(objectControl);

  return (
    <mesh ref={ref} position={position} name={name}>
      <planeBufferGeometry attach="geometry" />
      <meshStandardMaterial
        attach="material"
        transparent={true}
        map={texture}
        depthTest={false}
      />
    </mesh>
  );
};

const isSameType = (prevProps, nextProps) => {
  return prevProps.type === nextProps.type;
};

export default React.memo(FlatObject, isSameType);
