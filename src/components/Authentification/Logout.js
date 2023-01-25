import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FirebaseContext } from "../Firebase";

const Logout = () => {
  const [checked, setChecked] = useState(false);
  const firebase = useContext(FirebaseContext);
  let navigate = useNavigate();

  useEffect(() => {
    if (checked) {
      firebase.signoutUser();
      navigate("/");
      window.location.reload();
    }
  }, [checked]);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };
  return (
    <div className="logoutContainer">
      <label className="switch">
        <input onChange={handleChange} type="checkbox" checked={checked} />
        <span className="slider round"></span>
      </label>
    </div>
  );
};

export default Logout;
