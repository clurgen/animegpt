import React, { useState, useEffect, useContext } from "react";
import { Configuration, OpenAIApi } from "openai";
import ArticleService from "../services/article.service";
import { FirebaseContext } from "../Firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ChatGPT(props) {
  const firebase = useContext(FirebaseContext);
  const db = firebase.db;
  const articlesRef = db.collection("articles");
  const media = props.media;

  const [responses, setResponses] = useState([]);
  const [author, setAuthor] = useState([]);
  const [titre, setTitre] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [rank, setRank] = useState(0);
  const [nbEpisodes, setNbEpisodes] = useState(0);
  const [dateDeSortie, setDateDeSortie] = useState();
  const [imageUrl, setImageUrl] = useState("");
  const [score, setScore] = useState("");
  const [genre, setGenre] = useState([]);
  const [lastId, setLastId] = useState(0);
  const [malId, setMalId] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusSynopsis, setStatusSynopsis] = useState(false);
  const [opening, setOpening] = useState("=indisponible");
  const [status, setStatus] = useState("indisponible");
  const [leMedia, setLeMedia] = useState();
  const [etatParution, setEtatParution] = useState();
  const [chapters, setChapters] = useState();
  const [popularite, setPopularite] = useState();

  const loadOeuvre = async () => {
    if (media === "anime") {
      setLeMedia("l'anime");
    }
    if (media === "manga") {
      setLeMedia("le manga");
    }
    ArticleService.recuperer(media)
      .then((response) => {
        console.log(response.data.data);
        setMalId(response.data.data.mal_id);
        setSynopsis(response.data.data.synopsis);
        setScore(response.data.data.score);
        setRank(response.data.data.rank);
        if (media === "anime") {
          setNbEpisodes(response.data.data.episodes);
          setDateDeSortie(response.data.data.aired.string);
        }
        if (media === "manga") {
          setDateDeSortie(response.data.data.published.string);
          setEtatParution(response.data.data.status);
          setChapters(response.data.data.chapters);
          author.length = 0;
          response.data.data.authors.map((val, key) => {
            return author.push(val.name);
          });
        }
        setPopularite(response.data.data.popularity);
        genre.length = 0;
        response.data.data.genres.map((val, key) => {
          return genre.push(val.name);
        });
        setImageUrl(response.data.data.images.jpg.large_image_url);
        if (response.data.data.title_english !== null) {
          setTitre(response.data.data.title_english);
        } else {
          setTitre(response.data.data.title);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    loadOeuvre();
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
      ? (prompt = `A l'aide de MyAnimeList, Nautiljon, AniDB, Youtube et de ce synopsis ${synopsis} écris un article avec titre global <h2 class="leTitre"> dans <div class="leTitre">, un titre original par partie <h3 class="sousTitre"> et des paragraphes <p class="paragraphe"> toute partie devra etre entouré d'une div englobant h3 et p avec un className se référant au numéro de la partie et l'integralité des parties d'une <div class="lesParties">.
    Pas de répetition. Si ${score} inférieure à 7 soit negatif, si ${score} supérieure à 8 soit positif et si ${score} entre 7 et 8 soit mesuré. 
    Partie 1 présente ${titre} sortie en ${dateDeSortie} de ${nbEpisodes} épisodes avec bref aperçu de l'histoire et contexte. 
    Partie 2 présente uniquement les personnages clés de ${leMedia} ${titre}, inclu leur histoire personnalité et rôle.
    Partie 3, analyse uniquement l'intrigue de ${leMedia}, integre thèmes principaux, éléments de l'intrigue et moments clés de l'histoire sans spoiler.
    Partie 4, avec la note ${score}/10, et le classement de la série (${rank}) presente uniquement avis général sur ${leMedia}
    Conclusion invite à discuter de ${leMedia} dans les commentaires, à partager l'article.
    `)
      : (prompt = `Ignore toutes les instructions avant celles-ci. 
      Tu es un rédacteur d'article en ligne et tu excerce dans la redaction depuis une vingtaine d'année, ta tache est maintenant,
      en t'aidant de MyAnimeList, Nautiljon, AniDB, Youtube, écris un article avec un titre global <h2 class="leTitre"> entoure d'une <div class="leTitre">, un titre originale par partie <h3 class="sousTitre"> et des paragraphes <p class="paragraphe"> toute partie devra etre entouré d'une div englobant h3 et p avec un className se référant au numéro de la partie et l'integralité des parties d'une <div class="lesParties">.
    Partie 1 au moins 200 mots présente ${titre} sortie en ${dateDeSortie} composé de ${nbEpisodes} épisodes avec uniquement bref aperçu de l'histoire et du contexte. 
    Partie 2 présente en au moins 200 mots uniquement les personnages clés de ${leMedia} ${titre}, inclu leur histoire, personnalité et rôle dans l'histoire.
    Partie 3, analyse uniquement l'intrigue de ${leMedia}, integre les thèmes principaux, éléments de l'intrigue et moments clés de l'histoire en au moins 300 mots, sans spoiler.
    Partie 4, en prenant en compte la note ${score}/10, et le classement de la série (${rank})  Si ${score} inférieure à 7 critique negativement, si ${score} inférieure à 8 soit critique positivement et si ${score} entre 7 et 8 soit mesuré, presente uniquement l'avis générale des fans sur ${leMedia} en au moins 200 mots
    Et dans une conclusion invite à discuter de ${leMedia} dans les commentaires, à partager l'article en au moins 100 mots.
    Soit orginal et créatif et ne te répète pas !
    `);
    let lesResponses = [];

    await openai
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
    if (media === "anime") {
      await articlesRef
        .add({
          idArticle: lastId + 1,
          malId: malId,
          date: dateDeSortie,
          titre: titre,
          note: score,
          image: imageUrl,
          createdAt: timestamp,
          synopsis: synopsis,
          episodes: nbEpisodes,
          genres: genre,
          rang: rank,
          article: responses,
          type: media,
          statut: status,
          opening: opening,
        })
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
    }
    if (media === "manga") {
      await articlesRef
        .add({
          idArticle: lastId + 1,
          malId: malId,
          date: dateDeSortie,
          titre: titre,
          note: score,
          image: imageUrl,
          createdAt: timestamp,
          synopsis: synopsis,
          episodes: nbEpisodes,
          genres: genre,
          rang: rank,
          article: responses,
          auteur: author,
          type: media,
          statut: status,
          chapters: chapters,
          publication: etatParution,
        })
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
    }
    loadOeuvre();
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

  const handleChangeOpening = (e) => {
    setOpening(e.target.value);
  };

  const modifOpening = () => {
    const urlParts = opening.split("=");
    const lopening = urlParts[urlParts.length - 1];
    setOpening(lopening);
    console.log(opening);
  };

  const leStatus =
    status === "disponible" ? (
      <p>L'article sera disponible</p>
    ) : (
      <p>L'article sera indisponible</p>
    );
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="container col-xl-10">
          <form onSubmit={handleSubmit}>
            <div className="container">
              <div className="row align-items-center">
                <div className="text-center col-xl-3">
                  <h1 className="title text-center pt-3">{titre}</h1>
                  <p>Last Id: {lastId}</p>
                  {author !== "" && (
                    <p>
                      {" "}
                      Auteur:
                      {author.map((val, key) => {
                        return val + ", ";
                      })}
                    </p>
                  )}
                  <p>Classement: {rank}</p>
                  <p>Popularité: {popularite}</p>
                  <p>Note: {score}/10</p>
                  <p>Date de sortie: {dateDeSortie}</p>
                  {media === "anime" && <p>Nombre d'épisodes: {nbEpisodes}</p>}
                  {media === "manga" && <p>Nombre de chapitres: {chapters}</p>}
                  <p>
                    {" "}
                    Genres:
                    {genre.map((val, key) => {
                      return val + ", ";
                    })}
                  </p>
                </div>

                <div className=" col-xl-3 px-3">
                  <img src={imageUrl} alt="couverture" />
                </div>

                <div className="right col-xl-6 px-3" style={{ float: "right" }}>
                  <p>{synopsis}</p>
                </div>
              </div>
              <div className="container col-xl-3 pt-2">
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
                <button
                  type="button"
                  onClick={() =>
                    status === "disponible"
                      ? setStatus("indisponible")
                      : setStatus("disponible")
                  }
                >
                  Disponibilité
                </button>
                {leStatus}
              </div>
              {load}
            </div>
          </form>
          <div className="container">
            <div className="align-content-center text-center">
              <div className="col-xl-4 pt-2 mx-auto">
                <button onClick={loadOeuvre}>Charger une autre oeuvre</button>
              </div>
              {media === "anime" && (
                <div className="col-xl-4 pt-2 mx-auto">
                  <label>Opening</label>
                  <input
                    onChange={handleChangeOpening}
                    type="text"
                    value={opening}
                  />
                  <button onClick={modifOpening}>Update Opening</button>
                  <p>{opening}</p>
                </div>
              )}
              <div className="col-xl-6 mx-auto">
                <form onSubmit={addArticle}>
                  <div className="container">
                    <div dangerouslySetInnerHTML={{ __html: responses }} />
                  </div>
                  {btnArticle}
                  <ToastContainer></ToastContainer>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatGPT;
