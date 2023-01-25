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
    <div className="signupLoginBox">
      <div className="slcontainer">
        <div className="formBoxLeftLogin"></div>
        <div className="formBoxRight">
          <div className="formContent">
            <h2>Connexion</h2>
            {error !== "" && <span>{error.message}</span>}
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
              <div className="inputBox">
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type="password"
                  id="password"
                  required
                />
                <label htmlFor="password">Mot de passe</label>
              </div>
              {btn ? (
                <button>Connexion</button>
              ) : (
                <button disabled>Connexion</button>
              )}
            </form>
            <div className="linkContainer">
              <Link className="simpleLink" to="/signup">
                Nouveau sur Faceless ? Inscrivez-vous
              </Link>
              <br />
              <Link className="simpleLink" to="/forgetpassword">
                Mot de passe oublié ? Récupérez le ici
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
