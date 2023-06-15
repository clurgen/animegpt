const functions = require("firebase-functions");
const axios = require("axios");

exports.randomAnime = functions.https.onRequest((request, response) => {
  response.set("Access-Control-Allow-Origin", "*");
  const media = request.query.media;
  /**
   * This function gets a random anime from an external API
   * and returns it if it satisfies certain conditions.
   * @param {Object} request - The incoming request object from the client.
   * @param {Object} response - The response object to send to the client.
   */
  function getRandom() {
    if (media === "anime") {
      axios
          .get("https://api.jikan.moe/v4/random/anime")
          .then((res) => {
            if (
              res.data.data.status !== "Finished Airing" ||
              res.data.data.type !== "TV" ||
              res.data.data.score === null ||
              res.data.data.rank > 10000 ||
              res.data.data.synopsis === null ||
              res.data.data.episodes < 5
            ) {
              getRandom();
            } else {
              response.send(res.data);
            }
          })
          .catch((err) => {
            response.send(err);
          });
    }
  }
  if (media === "manga") {
    axios
        .get("https://api.jikan.moe/v4/random/manga")
        .then((res) => {
          if (
            res.data.data.rank > 20000 ||
            res.data.data.rank === null
          ) {
            getRandom();
          } else {
            response.send(res.data);
          }
        })
        .catch((err) => {
          response.send(err);
        });
  }

  getRandom();
});
