import React, { useState, useEffect, useContext } from "react";
import { FirebaseContext } from "../Firebase";
import { Link, useNavigate } from "react-router-dom";
import { setIndexConfiguration } from "firebase/firestore";

function ArticleUpdate() {
  const firebase = useContext(FirebaseContext);
  const db = firebase.db;
  const auth = firebase.auth;
  const articlesRef = db.collection("articles");
  const url = window.location.href;
  const urlSplit = url.split("/");
  const idArticle = parseInt(urlSplit[4]);

  const [article, setArticle] = useState("");
  const [titre, setTitre] = useState("");
  const [id, setId] = useState();

  useEffect(() => {
    const lArticle = async () => {
      await articlesRef
        .where("idArticle", "==", idArticle)
        .get()
        .then((response) => {
          if (!response.empty) {
            response.forEach((doc) => {
              setArticle(doc.data().article);
              setTitre(doc.data().titre);
              setId(doc.id);
            });
          } else {
            console.log("La requête est vide");
          }
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    };
    lArticle();
  }, []);

  const handleArticle = (e) => setArticle(e.target.value);

  const update = async (e) => {
    e.preventDefault();
    await articlesRef.doc(id).update({ article: article });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="container col-xl-8">
          <h1>{titre}</h1>
          <form onSubmit={update}>
            <textarea
              className="textarea"
              type="text"
              wrap="hard"
              onChange={handleArticle}
              value={article}
            />
            <div className="text-center pt-2">
              <button type="submit">Mettre à jour l'article</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ArticleUpdate;
