import React, { useCallback, useRef, useState } from "react";
import { useSphere } from "@react-three/cannon";
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

const Player = () => {
  const { moveForward, moveBackward, moveLeft, moveRight, action } =
    useKeyboardControls();
  const [bullets, setBullets] = useState([]);

  const [ref, api] = useSphere(() => ({
    fixedRotation: true,
    mass: 1,
    position: [2, 0.5, 2],
    args: [0.5, 0.5, 0.5],
  }));

  const player = useRef();

  const { camera } = useThree();

  const playerControl = useCallback(
    throttle(async () => {
      const obj = ref.current.getWorldPosition(new Vector3());

      let cameraDirection = new Vector3();
      camera.getWorldDirection(cameraDirection);

      const direction = new Vector3();
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

      direction
        .subVectors(frontVector, sideVector)
        .normalize()
        .multiplyScalar(6)
        .applyEuler(camera.rotation);

      api.velocity.set(direction.x, 0, direction.z);

      player.current.position.set(obj.x, 0.5, obj.z);

      camera?.position.set(obj.x, 0.5, obj.z);

      const bulletDirection = cameraDirection.clone().multiplyScalar(50);
      const bulletPosition = camera.position
        .clone()
        .add(cameraDirection.clone().multiplyScalar(2));

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
      <mesh ref={player} name="Player">
        <boxBufferGeometry attach="geometry" />
        <meshStandardMaterial
          attach="material"
          transparent={true}
          map={calculateImage()}
        />
      </mesh>
      <mesh ref={ref} />
    </>
  );
};

export default Player;
