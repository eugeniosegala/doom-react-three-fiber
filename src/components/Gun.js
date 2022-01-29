import React, { useEffect } from "react";
import { useKeyboardControls } from "../hooks/useKeyboardControls";
import fireSound from "../sounds/fire.mp3";

const Gun = () => {
  const { action } = useKeyboardControls();

  const sound = new Audio(fireSound);

  useEffect(async () => {
    if (action) {
      await sound.play();
    }
  }, [action]);

  return <div className={action ? "gun-fire" : "gun"} />;
};

export default Gun;
