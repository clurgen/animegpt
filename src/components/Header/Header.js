import React from "react";
import Logout from "../Authentification/Logout";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Offcanvas from "react-bootstrap/Offcanvas";
import chat from "../../images/chat.png";

function Header(props) {
  return (
    <Container>
      <Navbar fixed="top" key="xl" bg="dark" expand="xl" className="mb-4">
        <Container fluid>
          <Navbar.Brand text="white" href="/">
            <img className="header-image" alt="logo" src={chat} /> Le Chat de
            Gepeto
          </Navbar.Brand>
          <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-xl`} />
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-xl`}
            aria-labelledby={`offcanvasNavbarLabel-expand-xl`}
            placement="end"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-xl`}>
                <img className="header-image" alt="logo" src={chat} /> Le Chat
                de Gepeto
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-center nav-menu-header flex-grow-1 px-">
                <Nav.Link href="/">Accueil</Nav.Link>
                <NavDropdown
                  title="Articles"
                  id={`offcanvasNavbarDropdown-expand-xl`}
                >
                  <NavDropdown.Item href="/articles">
                    Derniers Articles
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/anime">Animes</NavDropdown.Item>
                  <NavDropdown.Item href="/manga">Mangas</NavDropdown.Item>
                </NavDropdown>
                <Nav.Link href="/about">A propos</Nav.Link>
              </Nav>
              {!props.userData.email ? (
                <Nav className="justify-content-end flex-grow-1 pe-3">
                  <Nav.Link href="/login">Connexion</Nav.Link>
                  <Nav.Link href="/signup">Inscription</Nav.Link>
                </Nav>
              ) : (
                <Nav className="justify-content-end flex-grow-1 pe-3">
                  <Logout />
                </Nav>
              )}
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </Container>
  );
}

export default Header;
