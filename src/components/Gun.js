import React from "react";
import { useAction } from "../store";

const Gun = () => {
  const isShooting = useAction((state) => state.isShooting);

  return <div className={isShooting ? "gun-fire" : "gun"} />;
};

export default Gun;
