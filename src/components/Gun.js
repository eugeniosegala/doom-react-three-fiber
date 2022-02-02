import React from "react";
import { useKeyboardControls } from "../hooks/useKeyboardControls";

const Gun = () => {
  const { action } = useKeyboardControls();

  return <div className={action ? "gun-fire" : "gun"} />;
};

export default Gun;
