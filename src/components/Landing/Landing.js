import React, { Fragment } from "react";
import LesArticles from "../Article/LesArticles";

function Landing() {
  return (
    <Fragment>
      <div className="container">
        <h1 className="">Les derniers articles</h1>
        <div className="row d-flex justify-content-center align-items-center">
          <LesArticles page="home" />
        </div>
        <h1 className="">Animes</h1>
        <div className="row d-flex justify-content-center align-items-center">
          <LesArticles page="home" categorie="anime" />
        </div>
        <h1 className="">Manga</h1>
        <div className="row d-flex justify-content-center align-items-center">
          <LesArticles page="home" categorie="manga" />
        </div>
      </div>
    </Fragment>
  );
}

export default Landing;
