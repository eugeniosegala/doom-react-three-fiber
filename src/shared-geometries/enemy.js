import { BoxGeometry, MeshStandardMaterial } from "three";

import { enemy } from "../utils/textureManager";

const enemyGeometry = new BoxGeometry(1.5, 1.5, 1.5);

const enemyMaterial = new MeshStandardMaterial({
  map: enemy,
  transparent: true,
});

export { enemyMaterial, enemyGeometry };
