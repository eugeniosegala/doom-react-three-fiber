import { BoxBufferGeometry, MeshStandardMaterial } from "three";
import { wall } from "../utils/textureManager";

const geometry = new BoxBufferGeometry(1, 1, 1);
const material = new MeshStandardMaterial({
  attach: "material",
  map: wall,
  transparent: true,
});

export { geometry, material };
