import React, { useRef } from "react";

const Object = ({ texture, position, name }) => {
  const ref = useRef();

  return (
    <mesh ref={ref} position={position} name={name}>
      <boxBufferGeometry attach="geometry" />
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

export default React.memo(Object, isSameType);
