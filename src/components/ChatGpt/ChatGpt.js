import React, { useState, useEffect, useContext, Fragment } from "react";
import { Configuration, OpenAIApi } from "openai";
import ArticleService from "../services/article.service";
import { FirebaseContext } from "../Firebase";
import { Link, useNavigate } from "react-router-dom";

function ChatGPT() {
  const firebase = useContext(FirebaseContext);
  const db = firebase.db;
  const auth = firebase.auth;
  const articlesRef = db.collection("articles");
  let navigate = useNavigate();

  const [responses, setResponses] = useState([]);
  const [anime, setAnime] = useState([]);
  const [animeTitre, setAnimeTitre] = useState("");
  const [animeSynopsis, setAnimeSynopsis] = useState("");
  const [animeRank, setAnimeRank] = useState(0);
  const [nbEpisode, setNbEpisodes] = useState(0);
  const [animeDate, setAnimeDate] = useState();
  const [animeImageUrl, setAnimeImageUrl] = useState("");
  const [animeScore, setAnimeScore] = useState("");
  const [animeGenre, setAnimeGenre] = useState([]);
  const [lastId, setLastId] = useState(0);
  const [malId, setMalId] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusSynopsis, setStatusSynopsis] = useState(false);

  useEffect(() => {
    const lesAnimes = async () => {
      ArticleService.recuperer()
        .then((response) => {
          setMalId(response.data.data.mal_id);

          setAnime(response.data.data);
          setAnimeSynopsis(response.data.data.synopsis);
          setAnimeScore(response.data.data.score);
          setAnimeRank(response.data.data.rank);
          setNbEpisodes(response.data.data.episodes);
          setAnimeDate(response.data.data.aired.string);
          response.data.data.genres.map((val, key) => {
            return animeGenre.push(val.name);
          });
          setAnimeImageUrl(response.data.data.images.jpg.image_url);
          console.log(response.data.data.title_english);
          if (response.data.data.title_english !== null) {
            setAnimeTitre(response.data.data.title_english);
          } else {
            setAnimeTitre(response.data.data.title);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    };
    lesAnimes();

    articlesRef
      .orderBy("idArticle")
      .limitToLast(1)
      .onSnapshot(function (snapshot) {
        snapshot.forEach((doc) => {
          setLastId(doc.data().idArticle);
        });
      });
  }, []);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const configuration = new Configuration({
      apiKey: process.env.REACT_APP_API_KEY,
    });

    const openai = new OpenAIApi(configuration);
    let prompt = "";
    statusSynopsis
      ? (prompt = `En t'aidant de MyAnimeList, Nautiljon, AniDB, Youtube et de ce synopsis ${animeSynopsis} écris un article avec un titre global <h2 class="leTitre"> entoure d'une <div class="leTitre">, un titre originale par partie <h3 class="sousTitre"> et des paragraphes <p class="paragraphe"> toute partie devra etre entouré d'une div englobant h3 et p avec un className se référant au numéro de la partie et l'integralité des parties d'une <div class="lesParties">.
    Pas de répetition. Si ${animeScore} inférieure à 7 soit negatif, si ${animeScore} supérieure à 8 soit positif et si ${animeScore} entre 7 et 8 soit mesuré. 
    Partie 1 au moins 200 mots présente ${animeTitre} sortie en ${animeDate} composé de ${nbEpisode} épisodes avec uniquement bref aperçu de l'histoire et du contexte. 
    Partie 2 présente en au moins 200 mots uniquement les personnages clés de l'anime ${animeTitre}, inclu leur histoire, personnalité et rôle dans l'histoire.
    Partie 3, analyse uniquement l'intrigue de l'anime, integre les thèmes principaux, éléments de l'intrigue et moments clés de l'histoire en au moins 300 mots, sans spoiler.
    Partie 4 analyse de facon originale uniquement les aspects techniques de l'anime tels que le style d'animation, la direction artistique, la musique, les effets visuels, etc en apportant des exemples et des annectodes en au moins 200 mots
    Partie 5, en prenant en compte la note ${animeScore}/10, et le classement de la série (${animeRank}) presente uniquement l'avis générale des fans sur l'anime en au moins 200 mots
    Et dans une conclusion invite à discuter de l'anime dans les commentaires, à partager l'article en au moins 100 mots.
    `)
      : (prompt = `En t'aidant de MyAnimeList, Nautiljon, AniDB, Youtube, écris un article avec un titre global <h2 class="leTitre"> entoure d'une <div class="leTitre">, un titre originale par partie <h3 class="sousTitre"> et des paragraphes <p class="paragraphe"> toute partie devra etre entouré d'une div englobant h3 et p avec un className se référant au numéro de la partie et l'integralité des parties d'une <div class="lesParties">.
    Partie 1 au moins 200 mots présente ${animeTitre} sortie en ${animeDate} composé de ${nbEpisode} épisodes avec uniquement bref aperçu de l'histoire et du contexte. 
    Partie 2 présente en au moins 200 mots uniquement les personnages clés de l'anime ${animeTitre}, inclu leur histoire, personnalité et rôle dans l'histoire.
    Partie 3, analyse uniquement l'intrigue de l'anime, integre les thèmes principaux, éléments de l'intrigue et moments clés de l'histoire en au moins 300 mots, sans spoiler.
    Partie 4 analyse de facon originale et en étant créatif uniquement les aspects techniques de l'anime tels que le style d'animation, la direction artistique, la musique, les effets visuels, etc en apportant des exemples et des annectodes en au moins 200 mots
    Partie 5, en prenant en compte la note ${animeScore}/10, et le classement de la série (${animeRank})  Si ${animeScore} inférieure à 7 critique negativement, si ${animeScore} inférieure à 8 soit critique positivement et si ${animeScore} entre 7 et 8 soit mesuré, presente uniquement l'avis générale des fans sur l'anime en au moins 200 mots
    Et dans une conclusion invite à discuter de l'anime dans les commentaires, à partager l'article en au moins 100 mots.
    Soit orginal et créatif !
    `);
    let lesResponses = [];

    const completions = await openai
      .createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        temperature: 0.7,
        max_tokens: 3500,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      })
      .then((res) => {
        lesResponses.push(res.data.choices[0].text);
        setResponses(lesResponses);
        setLoading(false);
        setStatusSynopsis(false);
      })
      .catch((error) => {
        setLoading(false);
        setStatusSynopsis(false);
        console.error(error);
      });
  };

  const addArticle = async (e) => {
    e.preventDefault();
    const timestamp = firebase.timestamp;
    await articlesRef.add({
      idArticle: lastId + 1,
      malId: malId,
      date: animeDate,
      titre: animeTitre,
      note: animeScore,
      image: animeImageUrl,
      createdAt: timestamp,
      synopsis: animeSynopsis,
      episodes: nbEpisode,
      genres: animeGenre,
      rang: animeRank,
      article: responses,
      type: "anime",
    });
  };

  const reloadAnime = async () => {
    setAnime([]);
    setResponses("");
    ArticleService.recuperer()
      .then((response) => {
        setMalId(response.data.data.mal_id);
        setAnime(response.data.data);
        setAnimeSynopsis(response.data.data.synopsis);
        setAnimeScore(response.data.data.score);
        setAnimeRank(response.data.data.rank);
        setNbEpisodes(response.data.data.episodes);
        setAnimeDate(response.data.data.aired.string);
        response.data.data.genres.map((val, key) => {
          return animeGenre.push(val.name);
        });
        console.log(animeGenre);

        setAnimeImageUrl(response.data.data.images.jpg.image_url);
        console.log(response.data.data.title_english);
        if (response.data.data.title_english !== null) {
          setAnimeTitre(response.data.data.title_english);
        } else {
          setAnimeTitre(response.data.data.title);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const btnArticle =
    responses === [] ? (
      <button disabled>Insérer un Article</button>
    ) : (
      <button type="submit">Insérer un Article</button>
    );

  const load = loading ? (
    <div className="container pt-2">
      <div className="loader" />
    </div>
  ) : (
    <div className="container pt-2">
      <button type="submit">Générer un article</button>
    </div>
  );

  const leSynopsis = statusSynopsis ? (
    <p>Le synopsis sera ajouté</p>
  ) : (
    <p>Le synopsis n'est pas inclus</p>
  );

  return (
    <div className="container-fluid">
      <form onSubmit={handleSubmit}>
        <div className="container">
          <h1 className="title text-center pt-3">{animeTitre}</h1>
          <p>Last Id: {lastId}</p>
          <p>Classement: {animeRank}</p>
          <p>Note: {animeScore}/10</p>
          <p>Date de sortie: {animeDate}</p>
          <p>
            {" "}
            Genres:
            {animeGenre.map((val, key) => {
              return val + ", ";
            })}
          </p>
          <div className="align-content-center text-center">
            <div className="col-xl-6 mx-auto">
              <p>{animeSynopsis}</p>
            </div>
            <div>
              <img src={animeImageUrl} alt="couverture" />
            </div>
            <div className="container pt-2">
              <button
                type="button"
                onClick={() =>
                  statusSynopsis
                    ? setStatusSynopsis(false)
                    : setStatusSynopsis(true)
                }
              >
                Ajouter le synopsis
              </button>
              {leSynopsis}
            </div>
            {load}
          </div>
        </div>
      </form>
      <div className="container pt-2">
        <button onClick={reloadAnime}>Charger un autre animé</button>
      </div>
      <div className="container">
        <div className="align-content-center text-center">
          <div className="col-xl-6 mx-auto">
            <form onSubmit={addArticle}>
              <div className="container">
                <div dangerouslySetInnerHTML={{ __html: responses }} />
              </div>
              {btnArticle}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatGPT;
