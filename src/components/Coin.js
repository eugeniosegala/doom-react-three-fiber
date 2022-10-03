import React, { useCallback, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import throttle from "lodash-es/throttle";

import { coin } from "../utils/textureManager";
import coinSound from "../sounds/coin.wav";
import { calcDistance } from "../utils/calcDistance";

const Coin = ({ position, mapData, setCurrentMap }) => {
  const sound = new Audio(coinSound);
  const ref = useRef();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const coinControl = useCallback(
    throttle(async (scene, camera) => {
      ref.current?.lookAt(camera.position);

      // this is supposed to be the first object in the scene: the player
      const player = scene.children[1].position;

      const collision =
        calcDistance(player, {
          x: position[0],
          y: position[1],
          z: position[2],
        }) < 1;

      if (collision) {
        await sound.play();
        let newMapData = [...mapData];
        newMapData[position[2]][position[0]] = "·";
        setCurrentMap(newMapData);
      }
    }, 100),
    []
  );

  useFrame(({ scene, camera }) => coinControl(scene, camera));

  console.log("Coin rendering...");

  return (
    <mesh
      position={position}
      ref={ref}
      name="coin"
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <planeGeometry attach="geometry" />
      <meshStandardMaterial attach="material" transparent={true} map={coin} />
    </mesh>
  );
};

const isSameType = (prevProps, nextProps) => {
  return prevProps.type === nextProps.type;
};

export default React.memo(Coin, isSameType);
