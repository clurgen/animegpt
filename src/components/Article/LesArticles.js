import React, { Fragment, useEffect, useState, useContext } from "react";
import { FirebaseContext } from "../Firebase";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import TextTruncate from "react-text-truncate";

const LesArticles = (props) => {
  const firebase = useContext(FirebaseContext);
  const db = firebase.db;
  const articlesRef = db.collection("articles");
  const [articlesList, setArticlesList] = useState([]);
  const [laDate, setLaDate] = useState();

  const [pageNumber, setPageNumber] = useState(0);
  const articlePerPage = 6;
  const pageVisited = pageNumber * articlePerPage;
  const categorie = props.categorie;

  useEffect(() => {
    const lesArticles = async () => {
      let articles = [];
      let dates = [];
      if (categorie === "anime" || categorie === "manga") {
        await articlesRef
          .where("type", "==", categorie)
          .orderBy("idArticle")
          .get()
          .then((response) => {
            if (!response.empty) {
              response.forEach((doc) => {
                articles.push(doc.data());
              });
              setArticlesList(articles.reverse());
            } else {
              console.log("La requête est vide");
            }
          })
          .catch((error) => {
            console.log("Error getting documents: ", error);
          });
      } else {
        await articlesRef
          .orderBy("idArticle")
          .get()
          .then((response) => {
            if (!response.empty) {
              response.forEach((doc) => {
                articles.push(doc.data());
              });
              setArticlesList(articles.reverse());
            } else {
              console.log("La requête est vide");
            }
          })
          .catch((error) => {
            console.log("Error getting documents: ", error);
          });
      }
    };
    lesArticles();
  }, []);

  const theDate = (uneDate) => {
    let date = new Date(uneDate.seconds * 1000); // on multiplie par 1000 pour convertir en millisecondes
    const dateFinal = date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    console.log(dateFinal);
    return dateFinal;
  };

  const displayArticle = articlesList
    .slice(pageVisited, pageVisited + articlePerPage)
    .map((val, key) => {
      let link = `/article/${val.idArticle}`;
      return (
        <div
          key={key}
          className="col-xl-3 col-md-5 mx-4 py-2 d-flex justify-content-center"
        >
          <div className="card apparition shadow p-3 mb-3 rounded">
            <Link to={link}>
              <img className="card-img-top" src={val.image} alt={val.titre} />
            </Link>
            <div className="card-body">
              <h5 className="card-title">
                {val.titre} {` [${val.type}]`}
              </h5>
              <p className="card-text">
                <TextTruncate
                  line={5}
                  element="span"
                  truncateText="…"
                  text={val.synopsis_fr.fr}
                />
              </p>
              <Link className="link" to={link}>
                Lire l'article
              </Link>
            </div>
            <div className="card-footer">
              <p className="text-muted text-center align-items-center">
                {theDate(val.createdAt)}
              </p>
            </div>
          </div>
        </div>
      );
    });

  if (props.page === "home") {
    articlesList.length = 3;
  }

  const pageCount = Math.ceil(articlesList.length / articlePerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  return (
    <Fragment>
      <div className="container">
        <div className="row d-flex justify-content-center">
          {displayArticle}
          {props.paginate && (
            <ReactPaginate
              previousLabel="Précedent"
              nextLabel="Suivant"
              pageCount={pageCount}
              onPageChange={changePage}
              containerClassName="paginationBtns"
              previousLinkClassName="previousBtn"
              pageLinkClassName="pageBtn"
              nextLinkClassName="nextBtn"
              disabledClassName="paginationDisabled"
              activeClassName="paginationActived"
            />
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default LesArticles;
