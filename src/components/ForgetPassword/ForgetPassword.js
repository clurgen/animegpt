import { React, useState, useContext } from "react";
import { FirebaseContext } from "../Firebase";
import { Link, useNavigate } from "react-router-dom";

function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
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
    <div className="signupLoginBox">
      <div className="slcontainer">
        <div className="formBoxLeftForget"></div>
        <div className="formBoxRight">
          <div className="formContent">
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
            {error && <span>{error.message}</span>}
            <h2>Mot de passe oublié ?</h2>
            <form onSubmit={handleSubmit}>
              <div className="inputBox">
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type="email"
                  required
                />
                <label htmlFor="email">Email</label>
              </div>
              <button disabled={disabled}>Récuperer</button>
            </form>
            <div className="linkContainer">
              <Link className="simpleLink" to="/login">
                Déjà inscrit ? Connectez vous
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgetPassword;
