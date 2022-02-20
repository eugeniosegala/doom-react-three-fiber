import React, { useState, useMemo } from "react";
import { Stats, Instance } from "@react-three/drei";

import Plane from "../components/Plane";
import Player from "../components/Player";
import Enemy from "../components/Enemy";
import FlatObject from "../components/FlatObject";
import Coin from "../components/Coin";
import { barrel, orb } from "../utils/textureManager";
import mapData from "../maps-data/level01MapData";
import Group from "../components/Group";
import PointLight from "../components/PointLight";

const resolveMapTile = (type, x, y, mapData, setCurrentMap) => {
  const key = `${x}-${y}`;

  switch (type) {
    case "T":
      return (
        <FlatObject
          key={key}
          position={[x, 0.5, y]}
          texture={barrel}
          name="blocking"
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
    case "E":
      return (
        <Enemy
          key={key}
          position={[x, 0.75, y]}
          type={type}
          mapData={mapData}
          setCurrentMap={setCurrentMap}
        />
      );
    case "L":
      return <PointLight key={key} position={[x, 0.5, y]} type={type} />;
    default:
      return null;
  }
};

const resolveMapWalls = (type, x, y) => {
  const key = `${x}-${y}`;

  switch (type) {
    case "#":
      return (
        <React.Fragment key={key}>
          <Instance name="wall" position={[x, 1.5, y]} />
          <Instance name="wall" position={[x, 0.5, y]} />
        </React.Fragment>
      );
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
      {memoizedMapData}
      <Plane
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        colour="#7E370C"
      />
      <Plane
        position={[0, 2, 0]}
        rotation={[+Math.PI / 2, 0, 0]}
        colour="#7E370C"
      />
      <ambientLight intensity={0.1} />
      <FlatObject position={[10, 0.5, 20]} texture={orb} />
      <pointLight
        position={[10, 1.1, 20]}
        intensity={3}
        castShadow={true}
        color="blue"
      />
      <FlatObject position={[20, 0.5, 20]} texture={orb} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.5}
        intensity={1}
        castShadow={true}
        penumbra={1}
      />
      <pointLight
        position={[20, 1.1, 20]}
        intensity={0.2}
        castShadow={true}
        color="red"
      />
      <Stats className="stats" />
    </>
  );
};

export default Level01;
