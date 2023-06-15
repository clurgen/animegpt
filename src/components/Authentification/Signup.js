import React, { useState, useContext } from "react";
import { FirebaseContext } from "../Firebase";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const firebase = useContext(FirebaseContext);
  let navigate = useNavigate();

  const data = {
    pseudo: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const [loginData, setLoginData] = useState(data);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password, pseudo } = loginData;
    firebase
      .signupUser(email, password)
      .then((authUser) => {
        return firebase.user(authUser.user.uid).set({
          pseudo: pseudo,
          email: email,
        });
      })
      .then(() => {
        setLoginData({ ...data });
        navigate("/");
      })
      .catch((error) => {
        setError(error);
      });
  };

  const { pseudo, email, password, confirmPassword } = loginData;

  const btn =
    pseudo === "" ||
    email === "" ||
    password === "" ||
    password !== confirmPassword ? (
      <button disabled>Inscription</button>
    ) : (
      <button>Inscription</button>
    );

  const errorMsg =
    error !== "" ? (
      <span>{error.message}</span>
    ) : (
      <p className="text-white-50 mb-5">Entrez les informations demandées</p>
    );

  return (
    <div className="container h-100">
      <div className="row d-flex justify-content-center align-items-center h-100">
        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
          <div
            className="card bg-dark text-white"
            style={{ borderRadius: "1rem" }}
          >
            <div className="card-body p-5 text-center">
              <div className="mb-md-5 mt-md-4 pb-5">
                <h2 className="fw-bold mb-2 text-uppercase">Inscription</h2>
                {errorMsg}
                <form onSubmit={handleSubmit}>
                  <div className="form-outline form-white mb-4">
                    <label className="form-label" for="pseudo">
                      Pseudo
                    </label>
                    <input
                      type="text"
                      id="pseudo"
                      onChange={handleChange}
                      value={pseudo}
                      placeholder="Hokage"
                      required
                      className="form-control form-control-lg"
                    />
                  </div>

                  <div className="form-outline form-white mb-4">
                    <label className="form-label" for="typeEmailX">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      onChange={handleChange}
                      value={email}
                      placeholder="Test@email.fr"
                      required
                      className="form-control form-control-lg"
                    />
                  </div>

                  <div className="form-outline form-white mb-4">
                    <label className="form-label" for="typePasswordX">
                      Mot de passe
                    </label>
                    <input
                      type="password"
                      id="password"
                      onChange={handleChange}
                      value={password}
                      placeholder="UnMotDePasseSophistiqué"
                      required
                      className="form-control form-control-lg"
                    />
                  </div>

                  <div className="form-outline form-white mb-4">
                    <label className="form-label" for="confirmPassword">
                      Confirmez votre mot de passe
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      onChange={handleChange}
                      value={confirmPassword}
                      placeholder="UnMotDePasseSophistiqué"
                      required
                      className="form-control form-control-lg"
                    />
                  </div>

                  <p className="small mb-5 pb-lg-2">
                    <Link className="text-white-50" to="/forgetpassword">
                      Mot de passe oublié ?
                    </Link>
                  </p>

                  {btn ? (
                    <button
                      className="btn btn-outline-light btn-lg px-5"
                      type="submit"
                    >
                      Connnexion
                    </button>
                  ) : (
                    <button
                      disabled
                      className="btn btn-outline-light btn-lg px-5"
                      type="submit"
                    >
                      Inscription
                    </button>
                  )}
                </form>
              </div>
              <div>
                <p class="mb-0">
                  Déjà inscrit ?{" "}
                  <Link className="text-white-50 fw-bold" to="/login">
                    Connectez-vous
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
