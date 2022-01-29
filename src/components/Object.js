import React from "react";
import { useBox } from "@react-three/cannon";

import { wood } from "../utils/textureManager";

const Object = ({ texture, position, name }) => {
  const [ref] = useBox(() => ({ mass: 1, position: position, type: "Static" }));

  return (
    <mesh ref={ref} name={name}>
      <boxBufferGeometry attach="geometry" />
      <meshStandardMaterial
        attach="material"
        transparent={true}
        map={texture || wood}
      />
    </mesh>
  );
};

const isSameType = (prevProps, nextProps) => {
  return prevProps.type === nextProps.type;
};

export default React.memo(Object, isSameType);
