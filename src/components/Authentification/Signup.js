import React, { useState, useContext } from "react";
import { FirebaseContext } from "../Firebase";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const firebase = useContext(FirebaseContext);
  let navigate = useNavigate();

  const data = {
    pseudo: "",
    age: "",
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
    const { email, password, pseudo, age } = loginData;
    firebase
      .signupUser(email, password)
      .then((authUser) => {
        return firebase.user(authUser.user.uid).set({
          pseudo: pseudo,
          email: email,
          age: age,
        });
      })
      .then(() => {
        setLoginData({ ...data });
        navigate("/article");
      })
      .catch((error) => {
        setError(error);
        setLoginData({ ...data });
      });
  };

  const { pseudo, age, email, password, confirmPassword } = loginData;

  const btn =
    pseudo === "" ||
    age < 18 ||
    email === "" ||
    password === "" ||
    password !== confirmPassword ? (
      <button disabled>Inscription</button>
    ) : (
      <button>Inscription</button>
    );

  const errorMsg = error !== "" && <span>{error.message}</span>;

  return (
    <div className="signupLoginBox">
      <div className="slcontainer">
        <div className="formBoxLeftSignup"></div>
        <div className="formBoxRight">
          <div className="formContent">
            {errorMsg}
            <h2>Inscription</h2>
            <form onSubmit={handleSubmit}>
              <div className="inputBox">
                <input
                  onChange={handleChange}
                  value={pseudo}
                  type="text"
                  id="pseudo"
                  required
                />
                <label htmlFor="pseudo">Pseudo</label>
              </div>
              <div className="inputBox">
                <input
                  onChange={handleChange}
                  value={age}
                  type="number"
                  id="age"
                  required
                />
                <label htmlFor="age">Age</label>
              </div>
              <div className="inputBox">
                <input
                  onChange={handleChange}
                  value={email}
                  type="email"
                  id="email"
                  required
                />
                <label htmlFor="email">Email</label>
              </div>
              <div className="inputBox">
                <input
                  onChange={handleChange}
                  value={password}
                  type="password"
                  id="password"
                  required
                />
                <label htmlFor="password">Mot de passe</label>
              </div>
              <div className="inputBox">
                <input
                  onChange={handleChange}
                  value={confirmPassword}
                  type="password"
                  id="confirmPassword"
                  required
                />
                <label htmlFor="confirmPassword">
                  Confirmer le mot de passe
                </label>
              </div>
              {btn}
            </form>
            <div className="linkContainer">
              <Link className="simpleLink" to="/login">
                Déjà inscrit ? Connectez-vous
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
