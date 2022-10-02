import React, { useEffect } from "react";
import { PointerLockControls as PointerLockControlsImpl } from "three/examples/jsm/controls/PointerLockControls";
import { useThree, extend } from "@react-three/fiber";
import { useRef } from "react";
import fireSound from "../sounds/music.mp3";

extend({ PointerLockControlsImpl });

const sound = new Audio(fireSound);

const FPVControls = () => {
  const { camera, gl } = useThree();
  const controls = useRef();

  useEffect(() => {
    document.addEventListener("click", () => {
      sound.play();
      controls.current.lock();
    });
  }, []);

  return (
    <pointerLockControlsImpl ref={controls} args={[camera, gl.domElement]} />
  );
};

export default React.memo(FPVControls);
