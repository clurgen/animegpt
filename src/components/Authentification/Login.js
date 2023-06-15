import { React, useState, useEffect, useContext } from "react";
import { FirebaseContext } from "../Firebase";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [btn, setBtn] = useState(false);
  const [error, setError] = useState("");
  const firebase = useContext(FirebaseContext);
  let navigate = useNavigate();

  useEffect(() => {
    if (password.length > 5 && email !== "") {
      setBtn(true);
    } else if (btn) {
      setBtn(false);
    }
  }, [password, email, btn]);

  const handleSubmit = (e) => {
    e.preventDefault();
    firebase
      .loginUser(email, password)
      .then((user) => {
        setPassword("");
        navigate("/article");
      })
      .catch((error) => {
        setPassword("");
        setError(error);
      });
  };

  return (
    <div className="container py-5 h-100">
      <div className="row d-flex justify-content-center align-items-center h-100">
        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
          <div
            className="card bg-dark text-white"
            style={{ borderRadius: "1rem" }}
          >
            <div className="card-body p-5 text-center">
              <div className="mb-md-5 mt-md-4 pb-5">
                <h2 className="fw-bold mb-2 text-uppercase">Connexion</h2>
                {error !== "" ? (
                  <span>{error.message}</span>
                ) : (
                  <p className="text-white-50 mb-5">
                    Entrez votre mail et votre mot de passe
                  </p>
                )}
                <form onSubmit={handleSubmit}>
                  <div className="form-outline form-white mb-4">
                    <input
                      type="email"
                      id="typeEmailX"
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                      required
                      className="form-control form-control-lg"
                      placeholder="Test@email.fr"
                    />
                    <label className="form-label" for="typeEmailX">
                      Email
                    </label>
                  </div>

                  <div className="form-outline form-white mb-4">
                    <input
                      type="password"
                      id="typePasswordX"
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                      required
                      className="form-control form-control-lg"
                      placeholder="UnMotDePasseSophistiqué"
                    />
                    <label className="form-label" for="typePasswordX">
                      Mot de passe
                    </label>
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
                      Connnexion
                    </button>
                  )}
                </form>
              </div>
              <div>
                <p class="mb-0">
                  Pas encore inscrit ?{" "}
                  <Link className="text-white-50 fw-bold" to="/signup">
                    Inscrivez-vous
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

export default Login;
