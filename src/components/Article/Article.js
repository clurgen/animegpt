import React, { useState, useEffect, useContext } from "react";
import { FirebaseContext } from "../Firebase";
import { Helmet } from "react-helmet";

function Article() {
  const firebase = useContext(FirebaseContext);
  const db = firebase.db;
  const articlesRef = db.collection("articles");
  const url = window.location.href;
  const urlSplit = url.split("/");
  const [idArticle, setIdArticle] = useState(parseInt(urlSplit[4]));

  const [laDate, setLaDate] = useState();
  const [article, setArticle] = useState([]);
  const [lesGenres, setLesGenres] = useState([]);
  const [synopsis, setSynopsis] = useState();

  useEffect(() => {
    const lArticle = async () => {
      const url = window.location.href;
      const urlSplit = url.split("/");
      setIdArticle(parseInt(urlSplit[4]));
      await articlesRef
        .where("idArticle", "==", idArticle)
        .get()
        .then((response) => {
          if (!response.empty) {
            response.forEach((doc) => {
              setArticle(doc.data());
              setLesGenres(doc.data().genres);
              const leSynopsis = doc.data().synopsis_fr.fr;
              setSynopsis(leSynopsis);
              console.log("test");
              let date = new Date(doc.data().createdAt.seconds * 1000); // on multiplie par 1000 pour convertir en millisecondes
              setLaDate(
                date.toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              );
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
  }, [idArticle]);

  return (
    <div className="container-fluid">
      <Helmet>
        <meta charSet="utf-8" />
        <title>{`${article.titre} avis sur la série`}</title>
        <meta name="description" content={synopsis} />
      </Helmet>
      <div className="row">
        <div className="container col-xl-8">
          <h1>{article.titre}</h1>
          <div className=" container">
            <div className="row align-items-center">
              <div className="text-center col-xl-4">
                <p>Classement: {article.rang}</p>
                {article.type === "anime" && (
                  <p>Nombre d'épisodes: {article.episodes}</p>
                )}
                {article.type === "manga" && (
                  <p>Nombre de chapitres: {article.chapters}</p>
                )}
                <p>Note: {article.note}/10</p>
                <p>Date de sortie: {article.date}</p>
                <p>
                  Genres:{" "}
                  {lesGenres.map((val, key) => {
                    return val + ", ";
                  })}
                </p>
              </div>
              <div
                className="right col-xl-4 px-3 text-center"
                style={{ float: "right" }}
              >
                <img
                  className=" img-thumbnail"
                  alt="couverture"
                  src={article.image}
                />
              </div>
              {article.type === "anime" && (
                <div className="right col-xl-4 px-3 mr-auto">
                  {article.opening ? (
                    <iframe
                      width="auto"
                      height="auto"
                      src={`https://www.youtube.com/embed/${article.opening}`}
                      frameBorder="0"
                      allow="accelerometer; fullscreen; autoplay; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title="opening"
                    />
                  ) : (
                    <iframe
                      width="auto"
                      height="auto"
                      src="https://www.youtube.com/embed/KVV5Hh2RHoA"
                      frameBorder="0"
                      allow="accelerometer; fullscreen; autoplay; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title="opening"
                    />
                  )}
                </div>
              )}
            </div>
            <p className="text-center">Le Chat de Gepeto- {laDate}</p>
          </div>
          <div dangerouslySetInnerHTML={{ __html: article.article }} />
          <div className="d-flex justify-content-around">
            <button className="btn btn-outline-secondary ml-auto">
              <a href={`/article/${idArticle - 1}`}>Article précedent</a>
            </button>
            <button className="btn btn-outline-secondary mr-auto">
              <a href={`/article/${idArticle + 1}`}>Article suivant</a>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Article;
