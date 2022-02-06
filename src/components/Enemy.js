import React, { useCallback, useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import throttle from "lodash-es/throttle";
import { Vector3 } from "three";

import { dogGeometry, dogMaterial } from "../shared-geometries/dog";
import Bullet from "./Bullet";
import { calcDistance, closestObject } from "../utils/calcDistance";

const ENEMY_SPEED = 0.025;

const direction = new Vector3();

const possibleEnemyWDirection = ["up", "down", "right", "left"];

const Enemy = ({ position, mapData, setCurrentMap }) => {
  const [bullets, setBullets] = useState([]);

  let currTime = 0;
  let prevTime = 0;

  const ref = useRef();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const enemyControl = useCallback(
    throttle(async (scene, camera, clock) => {
      const dynamicPosition = ref.current?.position;

      ////////////////////////////
      ///// Camera manager
      ////////////////////////////

      ref.current.lookAt(
        camera.position.x,
        camera.position.y - 0.5,
        camera.position.z
      );

      ////////////////////////////
      ///// Bullet kills enemy
      ////////////////////////////

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

      ////////////////////////////
      ///// Player is close start attacking.
      ////////////////////////////

      const playerProximity =
        calcDistance(scene.children[1].position, {
          x: dynamicPosition.x,
          y: dynamicPosition.y,
          z: dynamicPosition.z,
        }) < 20;

      if (playerProximity) {
        ref.current.isChaising = true;

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

      ////////////////////////////
      ///// Enemy collision
      ////////////////////////////

      const wallsCollisions = scene.children[0].children.filter((e) => {
        return calcDistance(e.position, dynamicPosition) <= 2;
      });

      const topCollisions = wallsCollisions.filter((e) => {
        return (
          (e.position.x === Math.ceil(dynamicPosition.x) ||
            e.position.x === Math.floor(dynamicPosition.x)) &&
          e.position.z <= dynamicPosition.z
        );
      });

      const topClosest =
        closestObject(
          topCollisions.map((e) => e.position.z),
          dynamicPosition.z,
          -9999
        ) + 1;

      const bottomCollisions = wallsCollisions.filter((e) => {
        return (
          (e.position.x === Math.ceil(dynamicPosition.x) ||
            e.position.x === Math.floor(dynamicPosition.x)) &&
          e.position.z >= dynamicPosition.z
        );
      });

      const bottomClosest =
        closestObject(
          bottomCollisions.map((e) => e.position.z),
          dynamicPosition.z,
          9999
        ) - 1;

      const rightCollisions = wallsCollisions.filter((e) => {
        return (
          (e.position.z === Math.ceil(dynamicPosition.z) ||
            e.position.z === Math.floor(dynamicPosition.z)) &&
          e.position.x >= dynamicPosition.x
        );
      });

      const rightClosest =
        closestObject(
          rightCollisions.map((e) => e.position.x),
          dynamicPosition.x,
          9999
        ) - 1;

      const leftCollisions = wallsCollisions.filter((e) => {
        return (
          (e.position.z === Math.ceil(dynamicPosition.z) ||
            e.position.z === Math.floor(dynamicPosition.z)) &&
          e.position.x <= dynamicPosition.x
        );
      });

      const leftClosest =
        closestObject(
          leftCollisions.map((e) => e.position.x),
          dynamicPosition.x,
          -9999
        ) + 1;

      ////////////////////////////
      ///// Enemy movements
      ////////////////////////////

      if (dynamicPosition.z > topClosest) {
        if (ref.current.enemyWDirection === "up") {
          dynamicPosition.z = (dynamicPosition.z * 10 - ENEMY_SPEED * 10) / 10;
        }
      }

      if (dynamicPosition.z < bottomClosest) {
        if (ref.current.enemyWDirection === "down") {
          dynamicPosition.z = (dynamicPosition.z * 10 + ENEMY_SPEED * 10) / 10;
        }
      }

      if (dynamicPosition.x < rightClosest) {
        if (ref.current.enemyWDirection === "right") {
          dynamicPosition.x = (dynamicPosition.x * 10 + ENEMY_SPEED * 10) / 10;
        }
      }

      if (dynamicPosition.x > leftClosest) {
        if (ref.current.enemyWDirection === "left") {
          dynamicPosition.x = (dynamicPosition.x * 10 - ENEMY_SPEED * 10) / 10;
        }
      }

      ////////////////////////////
      ///// Timers
      ////////////////////////////

      currTime = clock.getElapsedTime();

      if (currTime - prevTime > 3) {
        // deciding next movement based on current position
        if (leftCollisions.length) {
          ref.current.enemyWDirection = ["up", "down", "right", "right"][
            Math.floor(Math.random() * possibleEnemyWDirection.length)
          ];
        } else if (rightCollisions.length) {
          ref.current.enemyWDirection = ["up", "down", "left", "left"][
            Math.floor(Math.random() * possibleEnemyWDirection.length)
          ];
        } else if (topCollisions.length) {
          ref.current.enemyWDirection = ["left", "down", "down", "right"][
            Math.floor(Math.random() * possibleEnemyWDirection.length)
          ];
        } else if (bottomCollisions.length) {
          ref.current.enemyWDirection = ["up", "up", "left", "right"][
            Math.floor(Math.random() * possibleEnemyWDirection.length)
          ];
        } else {
          ref.current.enemyWDirection =
            possibleEnemyWDirection[
              Math.floor(Math.random() * possibleEnemyWDirection.length)
            ];
        }

        prevTime = clock.getElapsedTime();
      }
    }, 10),
    []
  );

  useFrame(({ scene, camera, clock }) => enemyControl(scene, camera, clock));

  useEffect(() => {
    // the first movement is random
    ref.current.enemyWDirection =
      possibleEnemyWDirection[
        Math.floor(Math.random() * possibleEnemyWDirection.length)
      ];
  }, []);

  console.log("Enemy rendering...");

  return (
    <>
      <mesh
        ref={ref}
        position={position}
        geometry={dogGeometry}
        material={dogMaterial}
        scale={1.5}
        name="enemy"
      />
      {bullets.map((bullet) => {
        return (
          <Bullet
            key={bullet.id}
            position={bullet.position}
            velocity={bullet.forward}
            setBullets={setBullets}
            collisionMarker={["player", "wall"]}
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
