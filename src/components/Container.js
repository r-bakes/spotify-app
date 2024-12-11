import React, { useState, useEffect } from "react";
import axios from "axios";

import Gallery from "./Gallery";

const Container = (props) => {
  const [tracksMetaData, setTracksMetaData] = useState([]);
  const [tracksFeatures, setTracksFeatures] = useState([]);
  const [loading, setLoading] = useState(true);

  const getRecommendations = () => {
    setLoading(true);

    var ids = props.recommendations.map((row, _) => {
      return row[0];
    });
    ids = ids.join(",");
    var urlFeatures = "https://api.spotify.com/v1/tracks?ids=" + ids;

    axios(urlFeatures, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + props.accessToken,
      },
    })
      .then((response) => {
        console.log("Get tracks' meta-data successful", response);

        setTracksMetaData(response.data);
        var urlFeatures =
          "https://api.spotify.com/v1/audio-features?ids=" + ids;

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
        console.log("Get tracks' features successful", response);

        setTracksFeatures(response);
        setLoading(false);
      })
      .catch((error) => {
        console.log("recommendations error.", error);
      });
  };

  useEffect(() => {
    if (props.recommendations) {
      getRecommendations();
    }
  }, [props.recommendations]);

  var content = (
    <div>
      <h2>We think you'll like...</h2>
      {!loading ? (
        <Gallery data={tracksMetaData} features={tracksFeatures} />
      ) : (
        <div />
      )}
    </div>
  );

  return <div className="recommendations-container">{content}</div>;
};

export default Container;
