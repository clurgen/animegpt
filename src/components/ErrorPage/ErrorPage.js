import React from "react";
import batman from "../../images/batman.png";

const centerH2 = {
  textAlign: "center",
  marginTop: "50px",
};

const centerImg = {
  display: "block",
  margin: "40px auto",
};

function ErrorPage() {
  return (
    <div className="quiz-bg">
      <div className="container">
        <h2 style={centerH2}>
          Malheureusement cette page n'existe pas et FatBlack c'est un bg
        </h2>
        <img src={batman} style={centerImg} alt="error page" />
      </div>
    </div>
  );
}

export default ErrorPage;
