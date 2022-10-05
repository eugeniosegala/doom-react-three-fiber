import React from "react";
import { Link } from "react-router-dom";
import gameStart from "../images/game-start.png";
import skull from "../images/skull.gif";

const Home = () => {
  return (
    <>
      <div className="home-menu">
        <div className="home-menu__logo" />
        <Link className="home-menu__link" to="/level-01">
          <img alt="skull icon" width="55px" src={skull} />
          <img alt="start game" width="250px" src={gameStart} />
        </Link>
      </div>
    </>
  );
};

export default React.memo(Home);
