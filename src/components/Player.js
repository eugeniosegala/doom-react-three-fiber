import React, { useCallback, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import throttle from "lodash-es/throttle";
import { Vector3 } from "three";

import { FPVControls } from "./FPVControls";
import {
  playerUpMovement,
  playerDownMovement,
  playerRightMovement,
  playerLeftMovement,
  playerIdleMovement,
} from "../utils/textureManager";
import { useKeyboardControls } from "../hooks/useKeyboardControls";
import Bullet from "./Bullet";
import { calcDistance, closestObject } from "../utils/calcDistance";

const limitNumberWithinRangeLR = (num, min, max) => {
  const MIN = min;
  const MAX = max;
  return Math.min(Math.max(num, MIN), MAX);
};

const limitNumberWithinRangeTB = (num, min, max) => {
  const MIN = min;
  const MAX = max;
  return Math.min(Math.max(num, MIN), MAX);
};

const cameraDirection = new Vector3();
const playerDirection = new Vector3();
const frontVector = new Vector3();
const sideVector = new Vector3();

const Player = () => {
  const { moveForward, moveBackward, moveLeft, moveRight, action } =
    useKeyboardControls();
  const [bullets, setBullets] = useState([]);

  const player = useRef();

  const playerControl = useCallback(
    throttle(async (camera, scene) => {
      const position = player.current.position;

      camera.getWorldDirection(cameraDirection);

      frontVector.set(0, 0, (moveBackward ? 1 : 0) - (moveForward ? 1 : 0));
      sideVector.set((moveLeft ? 1 : 0) - (moveRight ? 1 : 0), 0, 0);

      playerDirection
        .subVectors(frontVector, sideVector)
        .normalize()
        .multiplyScalar(0.1)
        .applyEuler(camera.rotation);

      const collisions = scene.children.filter((e) => {
        return calcDistance(e.position, position) <= 2 && e.name === "Blocking";
      });

      const topCollisions = collisions.filter((e) => {
        return (
          (e.position.x === Math.ceil(position.x) ||
            e.position.x === Math.floor(position.x)) &&
          e.position.z <= position.z
        );
      });

      const topClosest =
        closestObject(
          topCollisions.map((e) => e.position.z),
          position.z,
          -9999
        ) + 1;

      const bottomCollisions = collisions.filter((e) => {
        return (
          (e.position.x === Math.ceil(position.x) ||
            e.position.x === Math.floor(position.x)) &&
          e.position.z >= position.z
        );
      });

      const bottomClosest =
        closestObject(
          bottomCollisions.map((e) => e.position.z),
          position.z,
          9999
        ) - 1;

      const rightCollisions = collisions.filter((e) => {
        return (
          (e.position.z === Math.ceil(position.z) ||
            e.position.z === Math.floor(position.z)) &&
          e.position.x >= position.x
        );
      });

      const rightClosest =
        closestObject(
          rightCollisions.map((e) => e.position.x),
          position.x,
          9999
        ) - 1;

      const leftCollisions = collisions.filter((e) => {
        return (
          (e.position.z === Math.ceil(position.z) ||
            e.position.z === Math.floor(position.z)) &&
          e.position.x <= position.x
        );
      });

      const leftClosest =
        closestObject(
          leftCollisions.map((e) => e.position.x),
          position.x,
          -9999
        ) + 1;

      player.current.position.set(
        limitNumberWithinRangeLR(
          playerDirection.x + position.x,
          leftClosest,
          rightClosest
        ),
        0.5,
        limitNumberWithinRangeTB(
          playerDirection.z + position.z,
          topClosest,
          bottomClosest
        )
      );

      camera?.position.set(position.x, 0.5, position.z);

      const bulletDirection = cameraDirection.clone().multiplyScalar(5);
      const bulletPosition = camera.position
        .clone()
        .add(cameraDirection.clone().multiplyScalar(1));

      if (action) {
        const now = Date.now();
        if (now >= (player.current.timeToShoot || 0)) {
          player.current.timeToShoot = now + 500;
          setBullets((bullets) => [
            ...bullets,
            {
              id: now,
              position: [bulletPosition.x, bulletPosition.y, bulletPosition.z],
              forward: [
                bulletDirection.x,
                bulletDirection.y,
                bulletDirection.z,
              ],
            },
          ]);
        }
      }
    }, 10),
    [moveForward, moveBackward, moveRight, moveLeft, action]
  );

  useFrame(({ camera, scene }) => playerControl(camera, scene));

  console.log("Player rendering...");

  return (
    <>
      <FPVControls />
      <mesh ref={player} position={[2, 0.5, 2]} name="Player" />
      {bullets.map((bullet) => {
        return (
          <Bullet
            key={bullet.id}
            velocity={bullet.forward}
            position={bullet.position}
          />
        );
      })}
    </>
  );
};

export default Player;
