import axios from "axios";

export default class ArticleService {
  static async recuperer(media) {
    return await axios.get(
      `https://us-central1-animegpt-afce1.cloudfunctions.net/randomAnime/?media=${media}`
    );
  }
}
