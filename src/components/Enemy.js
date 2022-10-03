import React, { useCallback, useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import throttle from "lodash-es/throttle";
import { MeshStandardMaterial, Vector3 } from "three";

import {
  deadEnemyStaticMaterial,
  enemyGeometry,
  enemyMaterial,
} from "../shared-geometries/enemy";
import Bullet from "./Bullet";
import { calcDistance, closestObject } from "../utils/calcDistance";
import limitNumberWithinRange from "../utils/limitNumberWithinRange";
import calcLine from "../utils/calcLine";
import { imgLoader } from "../utils/textureManager";
import deadEnemyImg from "../images/dead-enemy.gif";
import enemyDeathSound from "../sounds/enemy-death.wav";

const ENEMY_SPEED = 0.025;
const ENEMY_CHASE_SPEED = 0.0075;
const ENEMY_BULLET_SPEED = 0.075;
const ENEMY_ATTACK_INTERVAL = 1000;
const ENEMY_AGGRO_AREA = 15;
const WORLD_COLLISION_MARGIN = 2;
const TOP_LEFT_BOUNDARY = -9999;
const BOTTOM_RIGHT_BOUNDARY = 9999;
const POSITION_Y = 0.75;
const SHOULD_MOVE = true;

const possibleEnemyWDirection = ["up", "down", "right", "left"];

const direction = new Vector3();

// TODO: Consider to use Web Workers
// TODO: Split logic into smaller files

const Enemy = ({ position, mapData, setCurrentMap }) => {
  const [bullets, setBullets] = useState([]);

  const sound = new Audio(enemyDeathSound);

  const [baseMaterial, setBaseMaterial] = useState(enemyMaterial);

  let isAlive = true;
  let currTime = 0;
  let prevTime = 0;

  const ref = useRef();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const enemyControl = useCallback(
    throttle(async (scene, camera, clock) => {
      const enemyPosition = ref.current?.position;
      const playerPosition = scene.children[1].position;

      ////////////////////////////
      ///// Camera manager
      ////////////////////////////

      ref.current.lookAt(
        camera.position.x,
        camera.position.y - 0.25,
        camera.position.z
      );

      ////////////////////////////
      ///// Bullet behaviour
      ////////////////////////////

      const bulletCollisions = scene.children.filter((e) => {
        return (
          calcDistance(e.position, enemyPosition) <= 0.8 && e.name === "bullet"
        );
      });

      // if hit by a bullet
      if (bulletCollisions.length && isAlive) {
        const deadEnemy = imgLoader(deadEnemyImg, "gif");

        const deadEnemyMaterial = new MeshStandardMaterial({
          map: deadEnemy,
          transparent: true,
        });

        isAlive = false;

        sound.play();
        setBaseMaterial(deadEnemyMaterial);

        // set persistent material after death effect
        setTimeout(function () {
          setBaseMaterial(deadEnemyStaticMaterial);
        }, 1000);

        // in case you want to remove it from the map
        // let newMapData = [...mapData];
        // newMapData[position[2]][position[0]] = "·";
        // setCurrentMap(newMapData);
      }

      ////////////////////////////
      ///// Reacting to Player
      ////////////////////////////

      const pointsBetweenEandP = calcLine(
        Math.floor(playerPosition.x),
        Math.floor(playerPosition.z),
        Math.floor(enemyPosition.x),
        Math.floor(enemyPosition.z)
      );

      const objectsBetweenEandP = scene.children[0].children.find((obj) =>
        pointsBetweenEandP.find(
          (possibleObj) =>
            possibleObj.x === obj.position.x && possibleObj.z === obj.position.z
        )
      );

      const playerProximityAggro =
        calcDistance(playerPosition, {
          x: enemyPosition.x,
          y: enemyPosition.y,
          z: enemyPosition.z,
        }) < ENEMY_AGGRO_AREA;

      const playerDirection = direction.subVectors(
        new Vector3(enemyPosition.x, enemyPosition.y, enemyPosition.z),
        new Vector3(
          scene.children[1].position.x,
          scene.children[1].position.y,
          scene.children[1].position.z
        )
      );

      if (playerProximityAggro && !objectsBetweenEandP && isAlive) {
        ref.current.isChaising = true;

        const playerDirectionBullet = playerDirection
          .clone()
          .multiplyScalar(ENEMY_BULLET_SPEED);

        // start shooting
        const now = Date.now();
        if (now >= (ref.current.timeToShoot || 0)) {
          ref.current.timeToShoot = now + ENEMY_ATTACK_INTERVAL;
          setBullets(() => [
            {
              id: now,
              position: [enemyPosition.x, enemyPosition.y, enemyPosition.z],
              forward: [
                playerDirectionBullet.x < 0
                  ? Math.abs(playerDirectionBullet.x)
                  : -Math.abs(playerDirectionBullet.x),
                playerDirectionBullet.y < 0
                  ? Math.abs(playerDirectionBullet.y)
                  : -Math.abs(playerDirectionBullet.y),
                playerDirectionBullet.z < 0
                  ? Math.abs(playerDirectionBullet.z)
                  : -Math.abs(playerDirectionBullet.z),
              ],
            },
          ]);
        }
      }

      ////////////////////////////
      ///// Enemy collisions
      ////////////////////////////

      const wallsCollisions = [
        ...scene.children[0].children,
        ...scene.children.filter(
          (obj) =>
            obj.name.includes("enemy") &&
            obj.name !== `enemy-${position[0]}-${position[2]}`
        ),
      ].filter((e) => {
        return (
          calcDistance(e.position, enemyPosition) <= WORLD_COLLISION_MARGIN
        );
      });

      const topCollisions = wallsCollisions.filter((e) => {
        return (
          (Math.ceil(e.position.x) === Math.ceil(enemyPosition.x) ||
            Math.floor(e.position.x) === Math.floor(enemyPosition.x)) &&
          e.position.z <= enemyPosition.z
        );
      });

      const topClosest =
        closestObject(
          topCollisions.map((e) => e.position.z),
          enemyPosition.z,
          TOP_LEFT_BOUNDARY
        ) + 1;

      const bottomCollisions = wallsCollisions.filter((e) => {
        return (
          (Math.ceil(e.position.x) === Math.ceil(enemyPosition.x) ||
            Math.floor(e.position.x) === Math.floor(enemyPosition.x)) &&
          e.position.z >= enemyPosition.z
        );
      });

      const bottomClosest =
        closestObject(
          bottomCollisions.map((e) => e.position.z),
          enemyPosition.z,
          BOTTOM_RIGHT_BOUNDARY
        ) - 1;

      const rightCollisions = wallsCollisions.filter((e) => {
        return (
          (Math.ceil(e.position.z) === Math.ceil(enemyPosition.z) ||
            Math.floor(e.position.z) === Math.floor(enemyPosition.z)) &&
          e.position.x >= enemyPosition.x
        );
      });

      const rightClosest =
        closestObject(
          rightCollisions.map((e) => e.position.x),
          enemyPosition.x,
          BOTTOM_RIGHT_BOUNDARY
        ) - 1;

      const leftCollisions = wallsCollisions.filter((e) => {
        return (
          (Math.ceil(e.position.z) === Math.ceil(enemyPosition.z) ||
            Math.floor(e.position.z) === Math.floor(enemyPosition.z)) &&
          e.position.x <= enemyPosition.x
        );
      });

      const leftClosest =
        closestObject(
          leftCollisions.map((e) => e.position.x),
          enemyPosition.x,
          TOP_LEFT_BOUNDARY
        ) + 1;

      ////////////////////////////
      ///// Enemy movements
      ////////////////////////////

      if (SHOULD_MOVE && isAlive) {
        // start following player
        if (ref.current.isChaising) {
          const playerProximityChase =
            calcDistance(playerPosition, {
              x: enemyPosition.x,
              y: enemyPosition.y,
              z: enemyPosition.z,
            }) < 2;

          const playerDirectionChase = playerDirection
            .clone()
            .multiplyScalar(ENEMY_CHASE_SPEED);

          // Stop moving when too close to player
          if (!playerProximityChase) {
            ref?.current?.position.set(
              limitNumberWithinRange(
                (playerDirectionChase.x < 0
                  ? Math.abs(playerDirectionChase.x)
                  : -Math.abs(playerDirectionChase.x)) + enemyPosition?.x,
                leftClosest,
                rightClosest
              ),
              POSITION_Y,
              limitNumberWithinRange(
                (playerDirectionChase.z < 0
                  ? Math.abs(playerDirectionChase.z)
                  : -Math.abs(playerDirectionChase.z)) + enemyPosition?.z,
                topClosest,
                bottomClosest
              )
            );
          }
        }

        // Pre-scripted movements - very basic AI
        if (!ref.current.isChaising) {
          if (enemyPosition.z > topClosest) {
            if (ref.current.enemyWDirection === "up") {
              enemyPosition.z = (enemyPosition.z * 10 - ENEMY_SPEED * 10) / 10;
            }
          }

          if (enemyPosition.z < bottomClosest) {
            if (ref.current.enemyWDirection === "down") {
              enemyPosition.z = (enemyPosition.z * 10 + ENEMY_SPEED * 10) / 10;
            }
          }

          if (enemyPosition.x < rightClosest) {
            if (ref.current.enemyWDirection === "right") {
              enemyPosition.x = (enemyPosition.x * 10 + ENEMY_SPEED * 10) / 10;
            }
          }

          if (enemyPosition.x > leftClosest) {
            if (ref.current.enemyWDirection === "left") {
              enemyPosition.x = (enemyPosition.x * 10 - ENEMY_SPEED * 10) / 10;
            }
          }

          // Random movements based of timers
          currTime = clock.getElapsedTime();

          if (currTime - prevTime > 3) {
            // deciding next random movement based on current position
            if (leftCollisions.length) {
              ref.current.enemyWDirection = [
                "up",
                "down",
                "right",
                "right",
                "right",
              ][Math.floor(Math.random() * possibleEnemyWDirection.length)];
            } else if (rightCollisions.length) {
              ref.current.enemyWDirection = [
                "up",
                "down",
                "left",
                "left",
                "left",
              ][Math.floor(Math.random() * possibleEnemyWDirection.length)];
            } else if (topCollisions.length) {
              ref.current.enemyWDirection = [
                "left",
                "right",
                "down",
                "down",
                "down",
              ][Math.floor(Math.random() * possibleEnemyWDirection.length)];
            } else if (bottomCollisions.length) {
              ref.current.enemyWDirection = ["left", "right", "up", "up", "up"][
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
        }
      }
    }, 10),
    []
  );

  useFrame(({ scene, camera, clock }) => enemyControl(scene, camera, clock));

  useEffect(() => {
    // Select first random movement
    if (SHOULD_MOVE) {
      ref.current.enemyWDirection =
        possibleEnemyWDirection[
          Math.floor(Math.random() * possibleEnemyWDirection.length)
        ];
    }
  }, []);

  console.log("Enemy rendering...");

  return (
    <>
      <mesh
        ref={ref}
        position={position}
        geometry={enemyGeometry}
        material={baseMaterial}
        name={`enemy-${position[0]}-${position[2]}`}
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
