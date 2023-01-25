import React from "react";

function Footer() {
  return (
    <footer class="footer bg-dark text-white py-3">
      <div class="container">
        <div class="row">
          <div class="col-md-6">
            <h4>A propos de nous</h4>
            <p>
              Nous sommes un groupe de passionnés d'animés japonais qui aimons
              partager nos découvertes et nos avis avec les autres.
            </p>
          </div>
          <div class="col-md-6">
            <h4>Rejoignez-nous</h4>
            <ul class="list-unstyled">
              <li>
                <a href="#">Facebook</a>
              </li>
              <li>
                <a href="#">Twitter</a>
              </li>
              <li>
                <a href="#">Instagram</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
