import "./App.css";
import React, { useState, useContext, Fragment, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { FirebaseContext } from "./components/Firebase/index";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import AddArticle from "./components/Article/AddArticle";
import Article from "./components/Article/Article";
import Login from "./components/Authentification/Login";
import Signup from "./components/Authentification/Signup";
import ErrorPage from "./components/ErrorPage/ErrorPage";
import ForgetPassword from "./components/ForgetPassword/ForgetPassword";
import Landing from "./components/Landing/Landing";
import ArticleUpdate from "./components/Article/ArticleUpdate";
import AboutPage from "./components/AboutPage/AboutPage";
import Articles from "./components/Article/Articles";
import Categories from "./components/Article/Categories";

function App() {
  const firebase = useContext(FirebaseContext);
  const [userSession, setUserSession] = useState(null);
  const [userData, setUserData] = useState({});
  const [user] = firebase.useAuthState(firebase.auth);

  useEffect(() => {
    let listener = firebase.auth.onAuthStateChanged((user) => {
      user ? setUserSession(user) : setUserSession(null);
    });
    if (!!userSession) {
      firebase
        .user(userSession.uid)
        .get()
        .then((doc) => {
          if (doc && doc.exists) {
            const myData = doc.data();
            setUserData(myData);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
    return () => {
      listener();
    };
  }, [userSession]);

  return (
    <Fragment>
      <Header userData={userData} userSession={userSession} />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/about/" element={<AboutPage />} />
        <Route path="/article/:id" element={<Article />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/anime" element={<Categories />} />
        <Route path="/manga" element={<Categories />} />
        <Route path="*" element={<ErrorPage />} />
        {userSession === null && <Route path="/login" element={<Login />} />}
        {userSession === null && <Route path="/signup" element={<Signup />} />}
        {userSession === null && (
          <Route path="/forgetpassword" element={<ForgetPassword />} />
        )}
        {userData.role === "admin" && (
          <Route path="/article/:id/update" element={<ArticleUpdate />} />
        )}
        {userData.role === "admin" && (
          <Route path="/article" element={<AddArticle userData={userData} />} />
        )}
      </Routes>
      <Footer />
    </Fragment>
  );
}

export default App;
