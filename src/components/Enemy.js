import React, { useCallback, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import throttle from "lodash-es/throttle";
import { Vector3 } from "three";

import { dogGeometry, dogMaterial } from "../shared-geometries/dog";
import Bullet from "./Bullet";
import { calcDistance } from "../utils/calcDistance";

const direction = new Vector3();

const Enemy = ({ position, type, mapData, setCurrentMap }) => {
  const [bullets, setBullets] = useState([]);

  const ref = useRef();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const enemyControl = useCallback(
    throttle(async (scene, camera) => {
      const dynamicPosition = ref.current?.position;

      const playerProximity =
        calcDistance(scene.children[1].position, {
          x: dynamicPosition.x,
          y: dynamicPosition.y,
          z: dynamicPosition.z,
        }) < 10;

      const bulletCollisions = scene.children.filter((e) => {
        return (
          calcDistance(e.position, dynamicPosition) <= 1 && e.name === "bullet"
        );
      });

      if (bulletCollisions.length) {
        let newMapData = [...mapData];
        newMapData[position[2]][position[0]] = "·";
        setCurrentMap(newMapData);
      }

      ref.current.lookAt(
        camera.position.x,
        camera.position.y - 0.5,
        camera.position.z
      );

      if (playerProximity) {
        const player = direction
          .subVectors(
            new Vector3(
              dynamicPosition.x,
              dynamicPosition.y,
              dynamicPosition.z
            ),
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
          setBullets(() => [
            {
              id: now,
              position: [
                dynamicPosition.x,
                dynamicPosition.y,
                dynamicPosition.z,
              ],
              forward: [
                player.x < 0 ? Math.abs(player.x) : -Math.abs(player.x),
                player.y < 0 ? Math.abs(player.y) : -Math.abs(player.y),
                player.z < 0 ? Math.abs(player.z) : -Math.abs(player.z),
              ],
            },
          ]);
        }
      }
    }, 10),
    []
  );

  useFrame(({ scene, camera }) => enemyControl(scene, camera));

  return (
    <>
      <mesh
        ref={ref}
        position={position}
        geometry={dogGeometry}
        material={dogMaterial}
        scale={1.5}
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

const isSameType = (prevProps, nextProps) => {
  return prevProps.type === nextProps.type;
};

export default React.memo(Enemy, isSameType);
