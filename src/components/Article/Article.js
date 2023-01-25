import React, { useState, useEffect, useContext } from "react";
import { FirebaseContext } from "../Firebase";
import { Form, Button, ListGroup } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

function Article() {
  const firebase = useContext(FirebaseContext);
  const db = firebase.db;
  const auth = firebase.auth;
  const articlesRef = db.collection("articles");
  const url = window.location.href;
  const urlSplit = url.split("/");
  const idArticle = parseInt(urlSplit[4]);

  const [laDate, setLaDate] = useState();
  const [article, setArticle] = useState([]);
  const [lesGenres, setLesGenres] = useState([]);
  const [pseudo, setPseudo] = useState("");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const lArticle = async () => {
      await articlesRef
        .where("idArticle", "==", idArticle)
        .get()
        .then((response) => {
          if (!response.empty) {
            response.forEach((doc) => {
              setArticle(doc.data());
              setLesGenres(doc.data().genres);
              console.log(doc.data().createdAt);
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
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setComments([...comments, newComment]);
    setNewComment("");
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="container col-xl-8">
          <h1>{article.titre}</h1>
          <div className=" container">
            <div className="row align-items-center">
              <div className="text-center left col-xl-4">
                <p>Classement: {article.rang}</p>
                <p>Nombre d'épisodes {article.episodes}</p>
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
                className="right col-xl-4 text-center"
                style={{ float: "right" }}
              >
                <img className=" img-thumbnail" src={article.image} />
              </div>
            </div>
            <p className="text-center">Le Chat de Gepeto- {laDate}</p>
          </div>
          <div dangerouslySetInnerHTML={{ __html: article.article }} />
          <div className="container col-xl-3">
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Control
                  value={pseudo}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Entrer un pseudo"
                />
                <Form.Control
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Laisser un commentaire"
                />
              </Form.Group>
              <Button type="submit">Envoyer</Button>
            </Form>
            <ListGroup>
              {comments.map((comment, index) => (
                <ListGroup.Item key={index}>{comment}</ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Article;
