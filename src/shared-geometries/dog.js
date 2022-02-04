import { BoxBufferGeometry, MeshStandardMaterial } from "three";

import { dog } from "../utils/textureManager";

const dogGeometry = new BoxBufferGeometry(1, 1, 1);

const dogMaterial = new MeshStandardMaterial({
  map: dog,
  transparent: true,
});

export { dogMaterial, dogGeometry };
