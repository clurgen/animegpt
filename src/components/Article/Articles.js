import React from "react";
import LesArticles from "./LesArticles";

function Articles() {
  return (
    <div>
      <LesArticles page="all" paginate={true} />
    </div>
  );
}

export default Articles;
