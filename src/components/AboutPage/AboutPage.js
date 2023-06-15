import { Container, Row, Col, Image } from "react-bootstrap";
import chat from "../../images/chat.png";

const AboutPage = () => {
  return (
    <Container className="d-flex">
      <h1 className="col-xl-6 py-4">À propos</h1>

      <Row className="justify-content-around">
        <Col xl="6">
          <p>
            Bienvenue sur notre site d'articles de blog sur les animés japonais
            !
          </p>
          <p>
            Notre équipe de passionnés partage avec vous ses analyses sur
            d'animés ainsi que des recommandations pour découvrir de nouvelles
            oeuvres.
          </p>
          <p>
            Nous couvrons tous les genres d'animés, des classiques aux dernières
            sorties en passant par les animés les plus méconnus.
          </p>
        </Col>
        <Col xl="2">
          <Image src={chat} alt="Image d'un anime" className="about-image" />
        </Col>
      </Row>
    </Container>
  );
};

export default AboutPage;
