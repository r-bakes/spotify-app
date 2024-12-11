import React from "react";
const Gallery = (props) => {
  var content = [];
  var tracks = props.data.tracks;
  var features = props.features.data;

  for (var i = 0; i < tracks.length; i++) {
    let track = tracks[i];

    content.push(
      <div key={i} style={{ padding: ".75em" }}>
        <li>
          <div className="recommendations-container-content">
            <img src={track.album.images[1].url}></img>
            <div className="recommendations-container-info">
              <h3>{track.name}</h3>
              <p>{track.artists[0].name}</p>
            </div>
          </div>
        </li>
      </div>
    );
  }

  return (
    <div>
      <ul>{content}</ul>
    </div>
  );
};

export default Gallery;
