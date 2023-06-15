import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FirebaseContext } from "../Firebase";
import Nav from "react-bootstrap/Nav";

const Logout = () => {
  const firebase = useContext(FirebaseContext);
  let navigate = useNavigate();

  const handleChange = () => {
    firebase.signoutUser();
    navigate("/");
    window.location.reload();
  };
  return (
    <Nav.Link onClick={handleChange} href="/">
      Deconnexion
    </Nav.Link>
  );
};

export default Logout;
