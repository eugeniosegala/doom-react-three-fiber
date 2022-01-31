import React, { useRef } from "react";

const Object = ({ position, name, geometry, material }) => {
  const ref = useRef();

  return (
    <mesh
      ref={ref}
      position={position}
      name={name}
      geometry={geometry}
      material={material}
    />
  );
};

const isSameType = (prevProps, nextProps) => {
  return prevProps.type === nextProps.type;
};

export default React.memo(Object, isSameType);
