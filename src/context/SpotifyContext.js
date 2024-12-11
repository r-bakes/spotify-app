import React, { createContext, useState } from "react";
import axios from "axios";
export const SpotifySearchContext = createContext();

const SpotifySearchContextProvider = (props) => {
  const [albumImage, setAlbumImage] = useState([]);
  const [artist, setArtist] = useState("");
  const [track, setTrack] = useState("");
  const [trackId, setTrackId] = useState("");
  const [loading, setLoading] = useState(true);

  const runSearch = (query) => {
    var url =
      "https://api.spotify.com/v1/search?q=" +
      props.searchValue +
      "&type=track%2Cartist&market=ES&limit=10&offset=5";
    axios(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "",
      },
    });
  };
  return (
    <PhotoContext.Provider value={{ images, loading, runSearch }}>
      {props.children}
    </PhotoContext.Provider>
  );
};

export default SpotifySearchContextProvider;
