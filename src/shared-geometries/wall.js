import { BoxBufferGeometry, MeshStandardMaterial } from "three";
import { wall } from "../utils/textureManager";

const wallGeometry = new BoxBufferGeometry(1, 1, 1);

const wallMaterial = new MeshStandardMaterial({
  map: wall,
});

export { wallGeometry, wallMaterial };
