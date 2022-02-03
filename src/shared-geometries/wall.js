import { BoxBufferGeometry, MeshStandardMaterial } from "three";
import { wall, dog } from "../utils/textureManager";

const geometry = new BoxBufferGeometry(1, 1, 1);
const material = new MeshStandardMaterial({
  map: wall,
});
const materialDog = new MeshStandardMaterial({
  map: dog,
  transparent: true,
});

export { geometry, material, materialDog };
