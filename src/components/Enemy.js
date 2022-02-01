import React, { useCallback, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import throttle from "lodash-es/throttle";

import { geometry, material } from "../shared-geometries/wall";
import { FPVControls } from "./FPVControls";
import Bullet from "./Bullet";
import { Vector3 } from "three";

const direction = new Vector3();

const Enemy = () => {
  const [bullets, setBullets] = useState([]);

  const ref = useRef();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const playerControl = useCallback(
    throttle(async (scene, camera) => {
      ref.current.lookAt(
        camera.position.x,
        camera.position.y - 0.5,
        camera.position.z
      );

      const position = ref.current.position;
      const player = direction
        .subVectors(
          new Vector3(position.x, position.y, position.z),
          new Vector3(
            scene.children[1].position.x,
            scene.children[1].position.y,
            scene.children[1].position.z
          )
        )
        .clone()
        .multiplyScalar(0.1);

      const now = Date.now();
      if (now >= (ref.current.timeToShoot || 0)) {
        ref.current.timeToShoot = now + 1000;
        setBullets((bullets) => [
          {
            id: now,
            position: [position.x, position.y, position.z],
            forward: [
              player.x < 0 ? Math.abs(player.x) : -Math.abs(player.x),
              player.y < 0 ? Math.abs(player.y) : -Math.abs(player.y),
              player.z < 0 ? Math.abs(player.z) : -Math.abs(player.z),
            ],
          },
        ]);
      }
    }, 10),
    []
  );

  useFrame(({ scene, camera }) => playerControl(scene, camera));

  return (
    <>
      <FPVControls />
      <mesh
        ref={ref}
        position={[5, 0.5, 5]}
        geometry={geometry}
        material={material}
      />
      {bullets.map((bullet) => {
        return (
          <Bullet
            key={bullet.id}
            position={bullet.position}
            velocity={bullet.forward}
          />
        );
      })}
    </>
  );
};

export default Enemy;
