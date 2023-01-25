import React from "react";
import Logout from "../Authentification/Logout";

function Header() {
  return (
    <div className="banner-container">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="#">
          Anime Blog
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <a className="nav-link" href="#">
                Accueil
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Articles
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                A propos
              </a>
            </li>
          </ul>
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link" href="#">
                Connexion
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Inscription
              </a>
            </li>
          </ul>
          <ul>
            <li className="nav-item">
              <Logout />
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default Header;
