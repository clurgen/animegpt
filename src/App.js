import "./App.css";
import React, { useState, useContext, Fragment, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { FirebaseContext } from "./components/Firebase/index";
import Home from "./components/Home/Home";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import ChatGPT from "./components/ChatGpt/ChatGpt";
import Article from "./components/Article/Article";
import Login from "./components/Authentification/Login";
import Signup from "./components/Authentification/Signup";
import ErrorPage from "./components/ErrorPage/ErrorPage";
import ForgetPassword from "./components/ForgetPassword/ForgetPassword";
import Landing from "./components/Landing/Landing";
import ArticleUpdate from "./components/Article/ArticleUpdate";

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

  return userSession === null ? (
    <Fragment>
      <Header />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgetpassword" element={<ForgetPassword />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
      <Footer />
    </Fragment>
  ) : (
    <Fragment>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/article" element={<ChatGPT userData={userData} />} />
        <Route path="/article/:id" element={<Article />} />
        <Route path="/article/:id/update" element={<ArticleUpdate />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>

      <Footer />
    </Fragment>
  );
}

export default App;
