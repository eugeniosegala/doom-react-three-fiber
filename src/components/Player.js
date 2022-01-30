import React, { useCallback, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
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

const cameraDirection = new Vector3();
const playerDirection = new Vector3();
const currentPosition = new Vector3();

const Player = () => {
  const { moveForward, moveBackward, moveLeft, moveRight, action } =
    useKeyboardControls();
  const [bullets, setBullets] = useState([]);

  const player = useRef();

  const { camera, scene } = useThree();

  const playerControl = useCallback(
    throttle(async () => {
      const position = player.current.position;

      camera.getWorldDirection(cameraDirection);

      const frontVector = new Vector3(
        0,
        0,
        (moveBackward ? 1 : 0) - (moveForward ? 1 : 0)
      );
      const sideVector = new Vector3(
        (moveLeft ? 1 : 0) - (moveRight ? 1 : 0),
        0,
        0
      );

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

      function limitNumberWithinRange(num, min, max) {
        const MIN = min || topClosest;
        const MAX = max || bottomClosest;
        const parsed = num;
        return Math.min(Math.max(parsed, MIN), MAX);
      }

      function limitNumberWithinRange2(num, min, max) {
        const MIN = min || leftClosest;
        const MAX = max || rightClosest;
        const parsed = num;
        return Math.min(Math.max(parsed, MIN), MAX);
      }

      player.current.position.set(
        limitNumberWithinRange2(playerDirection.x + position.x),
        0.5,
        limitNumberWithinRange(playerDirection.z + position.z)
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

  useFrame(playerControl);

  const calculateImage = () => {
    if (moveForward) {
      return playerUpMovement;
    }

    if (moveBackward) {
      return playerDownMovement;
    }

    if (moveRight) {
      return playerRightMovement;
    }

    if (moveLeft) {
      return playerLeftMovement;
    }

    return playerIdleMovement;
  };

  return (
    <>
      {bullets.map((bullet) => {
        return (
          <Bullet
            key={bullet.id}
            velocity={bullet.forward}
            position={bullet.position}
          />
        );
      })}
      <FPVControls />
      <mesh ref={player} position={[2, 0.5, 2]} name="Player">
        <boxBufferGeometry attach="geometry" />
        <meshStandardMaterial
          attach="material"
          transparent={true}
          map={calculateImage()}
        />
      </mesh>
    </>
  );
};

export default Player;
