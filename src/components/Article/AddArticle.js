import React from "react";
import { useState } from "react";
import ChatGPT from "../ChatGpt/ChatGpt";

function AddArticle(props) {
  const [media, setMedia] = useState("");
  return (
    <>
      {media === "" ? (
        <div className="container">
          <div className="row">
            <button onClick={(e) => setMedia(e.target.value)} value="anime">
              Anime
            </button>
            <button onClick={(e) => setMedia(e.target.value)} value="manga">
              Manga
            </button>
          </div>
        </div>
      ) : (
        <ChatGPT userData={props.userData} media={media} />
      )}
    </>
  );
}

export default AddArticle;
