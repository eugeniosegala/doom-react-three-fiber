import * as THREE from "three";
import React, { useRef, useEffect } from "react";

const Instances = ({ count = 100, temp = new THREE.Object3D() }) => {
  const ref = useRef();

  useEffect(() => {
    // Set positions
    for (let i = 0; i < count; i++) {
      const id = i++;
      temp.position.set(Math.random(), Math.random(), Math.random());
      temp.updateMatrix();
      ref.current.setMatrixAt(id, temp.matrix);
    }
    // Update the instance
    ref.current.instanceMatrix.needsUpdate = true;
  }, []);

  return (
    <instancedMesh ref={ref} args={[null, null, count]}>
      <boxGeometry />
      <meshPhongMaterial />
    </instancedMesh>
  );
};

export default Instances;
