import React, { useState, useEffect } from "react";
import axios from "axios";
import Container from "./Container";

const Search = (props) => {
  const [albumImage, setAlbumImage] = useState("");
  const [artist, setArtist] = useState("");
  const [track, setTrack] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [trackFeatures, setTrackFeatures] = useState({});
  const [loading, setLoading] = useState(false);
  const [trackGenres, setTrackGenres] = useState([
    ["", ""],
    ["", ""],
    ["", ""],
  ]);

  const runSearch = () => {
    if (
      (props.searchValue === "_AboutGenreLabeling") |
      (props.searchValue === "_AboutRecommendations")
    ) {
      return null;
    }
    setLoading(true);

    var urlSearch =
      "https://api.spotify.com/v1/search?q=" +
      props.searchValue +
      "&type=track&market=ES&limit=1";

    axios(urlSearch, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + props.accessToken,
      },
    })
      .then((response) => {
        console.log("Get track meta-data successful", response);
        let track = response.data.tracks.items[0];

        setAlbumImage(track.album.images[1].url);
        setArtist(track.artists[0].name);
        setTrack(track.name);

        var urlFeatures =
          "https://api.spotify.com/v1/audio-features/" + track.id;
        return axios(urlFeatures, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + props.accessToken,
          },
        });
      })
      .then((response) => {
        console.log("Get track features successful", response);
        var features = response.data;

        setTrackFeatures(features);

        let genrePredictFeatures = {
          danceability: features.danceability,
          energy: features.energy,
          loudness: features.loudness,
          mode: features.mode,
          speechiness: features.speechiness,
          instrumentalness: features.instrumentalness,
          liveness: features.liveness,
          valence: features.valence,
          tempo: features.tempo,
          key: features.key,
          acousticness: features.acousticness,
          time_signature: features.time_signature,
        };
        genrePredictFeatures = JSON.stringify(genrePredictFeatures);

        var urlPredictGenre =
          "https://66g3uq67q7.execute-api.us-east-1.amazonaws.com/default/predictGenreAndRecommendations";

        return axios(urlPredictGenre, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          data: genrePredictFeatures,
        });
      })
      .then((response) => {
        console.log(
          "Get track genre & recommendations predictions successful",
          response
        );
        let prediction = response.data.data;

        setTrackGenres(prediction.genrePrediction);
        setRecommendations(prediction.recommendationsPrediction);
      })
      .then((_) => {
        setLoading(false);
      })
      .catch((error) => {
        console.log("Search error.", error);
      });
  };

  useEffect(() => {
    if (props.searchValue) {
      runSearch();
    }
  }, [props.searchValue]);

  var content = (
    <div>
      <h2>Search for a song...</h2>
    </div>
  );

  if (props.searchValue === "_AboutGenreLabeling") {
    content = (
      <div>
        <h2>About Genre Labeling</h2>
      </div>
    );
  } else if (props.searchValue === "_AboutRecommendations") {
    content = (
      <div>
        <h2>About Recommendations</h2>
      </div>
    );
  } else if (props.searchValue && !loading && recommendations.length > 0) {
    var analysis = (
      <div className="container__analysis">
        <div className="container__analysis-content">
          <p>Genre</p>
          <p>{trackGenres[2][1]}</p>
          <p>{trackGenres[1][1]}</p>
          <p>{trackGenres[0][1]}</p>
        </div>
        <div className="container__analysis-content">
          <p>Confidence</p>
          <p>{Math.round(trackGenres[2][0] * 100)}%</p>
          <p>{Math.round(trackGenres[1][0] * 100)}%</p>
          <p>{Math.round(trackGenres[0][0] * 100)}%</p>
        </div>
      </div>
    );

    content = (
      <div>
        <div className="container__search-results">
          <div className="container__search-album">
            <img src={albumImage} alt="Album Cover"></img>
          </div>
          <div className="container__search-info">
            <h2 style={{ margin: "25px 0 40px" }}>{track}</h2>
            <h3>{artist}</h3>
            {analysis}
          </div>
          <div className="container__search-features">
            <div className="container__analysis-content">
              <h3>Features</h3>
              <p>Danceability: </p>
              <p>Energy: </p>
              <p>Loudness:</p>
              <p>Mode:</p>
              <p>Speechiness:</p>
              <p>Instrumentalness:</p>
              <p>Valence:</p>
              <p>Tempo:</p>
              <p>Key:</p>
              <p>Acousticness:</p>
              <p>Time Signature:</p>
            </div>
            <div
              className="container__analysis-content"
              style={{ textAlign: "left" }}
            >
              <h3></h3>
              <p>{trackFeatures.danceability}</p>
              <p>{trackFeatures.energy}</p>
              <p>{trackFeatures.loudness.toFixed(2)}</p>
              <p>{trackFeatures.mode.toFixed(2)}</p>
              <p>{trackFeatures.speechiness.toFixed(2)}</p>
              <p>{trackFeatures.instrumentalness.toFixed(2)}</p>
              <p>{trackFeatures.valence.toFixed(2)}</p>
              <p>{trackFeatures.tempo.toFixed(2)}</p>
              <p>{trackFeatures.key}</p>
              <p>{trackFeatures.acousticness.toFixed(2)}</p>
              <p>{trackFeatures.time_signature}</p>
            </div>
          </div>
        </div>
        <Container
          recommendations={recommendations}
          accessToken={props.accessToken}
        />
      </div>
    );
  } else if (loading) {
    content = <h2>Loading...</h2>;
  }

  return content;
};

export default Search;
