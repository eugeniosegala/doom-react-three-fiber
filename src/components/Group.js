import React from "react";
import { Instances, Instance } from "@react-three/drei";

import { geometry, material } from "../shared-geometries/wall";

const Group = ({ memoizedWalls }) => {
  return (
    <Instances
      limit={1000}
      range={1000}
      geometry={geometry}
      material={material}
    >
      {memoizedWalls}
    </Instances>
  );
};

export default React.memo(Group);