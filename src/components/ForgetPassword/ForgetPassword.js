import { React, useState, useContext } from "react";
import { FirebaseContext } from "../Firebase";
import { Link, useNavigate } from "react-router-dom";

function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const firebase = useContext(FirebaseContext);
  const disabled = email === "";

  const handleSubmit = (e) => {
    e.preventDefault();
    firebase
      .passwordReset(email)
      .then(() => {
        setError(null);
        setSuccess(
          `Consulter votre boîte mail ${email} pour changer le mot de passe`
        );
        setEmail("");
        setTimeout(() => {
          navigate("/");
        }, 5000);
      })
      .catch((error) => {
        setError(error);
        setEmail("");
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
                <h2 className="fw-bold mb-2 text-uppercase">
                  Mot de passe oublié ?
                </h2>
                {success && (
                  <span
                    style={{
                      border: "1px solid green",
                      background: "green",
                      color: "#ffffff",
                    }}
                  >
                    {success}
                  </span>
                )}
                {error !== "" ? (
                  <span>{error.message}</span>
                ) : (
                  <p className="text-white-50 mb-5">Saississez votre email</p>
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

                  <button
                    className="btn btn-outline-light btn-lg px-5"
                    disabled={disabled}
                  >
                    Récuperer
                  </button>
                </form>
              </div>
              <div>
                <p className="mb-0">
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

export default ForgetPassword;
