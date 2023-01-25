import axios from "axios";

export default class ArticleService {
  /**
   * Recuperer un article
   * @param id
   * @returns {Promise<AxiosResponse<T>>}
   */
  static async recuperer() {
    return await axios.get(`${process.env.REACT_APP_HOST_API}/recuperer/`);
  }

  /**
   * Recuperer un article
   * @param id
   * @returns {Promise<AxiosResponse<T>>}
   */
  static async lArticle(id) {
    return await axios.get(`${process.env.REACT_APP_HOST_API}/article/${id}`);
  }

  /**
   * Recuperer des article en fonction de leur playlist
   * @param id
   * @returns {Promise<AxiosResponse<T>>}
   */
  static async lesArticlesByPlaylist(playlist) {
    return await axios.get(
      `${process.env.REACT_APP_HOST_API}/articles/${playlist}`
    );
  }

  /**
   * Récuperer tout les articles
   * @returns {Promise<AxiosResponse<T>>}
   */
  static async lesArticles() {
    return await axios.get(`${process.env.REACT_APP_HOST_API}/articles`);
  }

  /**
   * Créer un article
   * @param body
   * @returns {Promise<AxiosResponse<T>>}
   */
  static async createArticle(body) {
    return await axios.post(
      `${process.env.REACT_APP_HOST_API}/createArticle`,
      body,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  }

  static async updateArticle(id, body) {
    console.log(body);
    return await axios.put(
      `${process.env.REACT_APP_HOST_API}/article/nopicture/edit/${id}`,
      body
    );
  }

  /**
   * Supprimer un article
   * @param id
   * @returns {Promise<AxiosResponse<T>>}
   */
  static async delete(id, image) {
    return await axios.delete(
      `${process.env.REACT_APP_HOST_API}/article/delete/${id}`
    );
  }
}
