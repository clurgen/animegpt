import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer class="bg-dark py-5">
      <div class="container">
        <div class="row">
          <div class="col-lg-6 mb-5 mb-lg-0">
            <h3 class="text-light text-center text-lg-left">
              Explorer notre section Animes
            </h3>
            <p class="text-light text-center text-lg-left">
              Découvrez des animes de tout temps
            </p>
            <a href="/anime" class="btn btn-light d-block mx-auto mt-4">
              Découvrir
            </a>
          </div>
          <div class="col-lg-6 mb-5 mb-lg-0">
            <h3 class="text-light text-center text-lg-left">
              Explorer notre section Mangas
            </h3>
            <p class="text-light text-center text-lg-left">
              Partagez vos avis et découvrez ceux des autres fans.
            </p>
            <a href="/manga" class="btn btn-light d-block mx-auto mt-4">
              Découvrir
            </a>
          </div>
          <div class="col-lg-4">
            <i class="fas fa-heart fa-3x mx-auto d-block text-light"></i>
          </div>
        </div>
        <p class="text-light text-center mt-4">
          Copyright <i>"Le Chat de Gepeto"</i> © 2023
        </p>
      </div>
    </footer>
  );
}

export default Footer;
