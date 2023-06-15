import React, { useState, useEffect, useContext } from "react";
import { FirebaseContext } from "../Firebase";
import { Link, useNavigate } from "react-router-dom";
import { setIndexConfiguration } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ArticleUpdate() {
  const firebase = useContext(FirebaseContext);
  const db = firebase.db;
  const auth = firebase.auth;
  const articlesRef = db.collection("articles");
  const url = window.location.href;
  const urlSplit = url.split("/");
  let navigate = useNavigate();
  const idArticle = parseInt(urlSplit[4]);
  const [opening, setOpening] = useState("indisponible");
  const [status, setStatus] = useState("indisponible");

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
              setOpening(doc.data().opening);
              setStatus(doc.data().status);
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
    await articlesRef
      .doc(id)
      .update({ article: article })
      .then(() => {
        toast.success(" Validé !", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        navigate(`/article/${idArticle}`);
      })
      .catch((error) => {
        console.error(error);
        toast.error(" FUCK !", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
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
            {/* <input
              type="text"
              value={opening}
              onChange={(e) => {
                setOpening(e.target.value);
              }}
            />
            <input
              type="text"
              value={opening}
              onChange={(e) => {
                setOpening(e.target.value);
              }}
            /> */}
            {/* <select
              name="disponibilité"
              onChange={(e) => {
                setStatus(e.target.value);
              }}
              value={status}
            >
              <option value="disponible"></option>
              <option value="indisponible"></option>
            </select> */}
            <div className="text-center pt-2">
              <button type="submit">Mettre à jour l'article</button>
            </div>
            <ToastContainer></ToastContainer>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ArticleUpdate;
