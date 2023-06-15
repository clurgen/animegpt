import React, { useState, useRef } from "react";

const ErrorPage = () => {
  const [animation, setAnimation] = useState("glitch 1s infinite");
  const h1Ref = useRef(null);

  const handleMouseEnter = () => {
    setAnimation("none");
  };

  const handleMouseLeave = () => {
    setAnimation("glitch 1s infinite");
  };

  return (
    <div className="container404">
      <h1
        ref={h1Ref}
        style={{ animation }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        404
      </h1>
      <p>{"Desolé, cette page n'existe pas, ou pas encore ;)"}.</p>
    </div>
  );
};

export default ErrorPage;
