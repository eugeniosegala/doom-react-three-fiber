import { BoxGeometry, MeshStandardMaterial } from "three";

import { enemy, deadEnemyStatic } from "../utils/textureManager";

const enemyGeometry = new BoxGeometry(1.5, 1.5, 1.5);

const enemyMaterial = new MeshStandardMaterial({
  map: enemy,
  transparent: true,
});

const deadEnemyStaticMaterial = new MeshStandardMaterial({
  map: deadEnemyStatic,
  transparent: true,
});

export { enemyMaterial, enemyGeometry, deadEnemyStaticMaterial };
