import React from "react";
import { useAction } from "../store";
import gunIdle from "../images/gun-idle.png";
import gunShoot from "../images/gun-shoot.gif";

const Gun = () => {
  const isShooting = useAction((state) => state.isShooting);

  return (
    <div className="weapon-wrapper">
      <div className="gun">
        {isShooting ? (
          <img src={gunShoot} height="100%" alt="gun shoot" />
        ) : (
          <img src={gunIdle} height="100%" alt="gun idle" />
        )}
      </div>
    </div>
  );
};

export default Gun;
