import React from "react";
import LesArticles from "./LesArticles";

function Categories() {
  const url = window.location.href;
  const urlSplit = url.split("/");
  const media = urlSplit[3];

  console.log(media);

  return <LesArticles page={media} categorie={media} paginate={true} />;
}

export default Categories;
