import { useState, useMemo } from "react";
import { Stats, Instance } from "@react-three/drei";

import Plane from "../components/Plane";
import Player from "../components/Player";
import FlatObject from "../components/FlatObject";
import Coin from "../components/Coin";
import { chest, orb } from "../utils/textureManager";
import mapData from "../maps-data/level01MapData";
import Group from "../components/Group";

const resolveMapTile = (type, x, y, mapData, setCurrentMap) => {
  const key = `${x}-${y}`;

  switch (type) {
    case "T":
      return (
        <FlatObject
          key={key}
          position={[x, 0.5, y]}
          texture={chest}
          name="Blocking"
        />
      );
    case "C":
      return (
        <Coin
          key={key}
          position={[x, 0.5, y]}
          mapData={mapData}
          setCurrentMap={setCurrentMap}
          type={type}
        />
      );
    default:
      return null;
  }
};

const resolveMapWalls = (type, x, y) => {
  const key = `${x}-${y}`;

  switch (type) {
    case "#":
      return <Instance key={key} position={[x, 0.5, y]} />;
    default:
      return null;
  }
};

const Level01 = () => {
  const [currentMap, setCurrentMap] = useState(mapData);

  // Remove this to see performance degradation
  const memoizedMapData = useMemo(() => {
    return currentMap.map((row, y) =>
      row.map((type, x) => resolveMapTile(type, x, y, mapData, setCurrentMap))
    );
  }, [currentMap]);

  const memoizedWalls = useMemo(() => {
    return currentMap.map((row, y) =>
      row.map((type, x) => resolveMapWalls(type, x, y))
    );
  }, []);

  console.log("World rendering...");

  return (
    <>
      <Group memoizedWalls={memoizedWalls} />
      <Player />
      <Plane position={[0, 0, 0]} colour="#7E370C" />
      <ambientLight intensity={0.1} />
      {memoizedMapData}
      <FlatObject position={[10, 0.5, 20]} texture={orb} />
      <pointLight
        position={[10, 1.1, 20]}
        intensity={3}
        castShadow={true}
        penumbra={1}
        color="blue"
      />
      <FlatObject position={[20, 0.5, 20]} texture={orb} />
      <pointLight
        position={[20, 1.1, 20]}
        intensity={3}
        castShadow={true}
        penumbra={1}
        color="blue"
      />
      <rectAreaLight
        position={[38.5, 1, 11]}
        intensity={5}
        castShadow={true}
        penumbra={1}
        width={1}
        rotation={[0, 20.4, 0]}
      />
      <spotLight
        position={[10, 10, 10]}
        angle={0.5}
        intensity={1}
        castShadow={true}
        penumbra={1}
      />
      <Stats className="stats" />
    </>
  );
};

export default Level01;
