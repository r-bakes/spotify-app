import React from "react";
import Form from "./Form";

const Header = (props) => {
  const surpriseMe = () => {
    return "Paranoid, Kanye West";
  };

  return (
    <div>
      <h1>Music Me!</h1>
      <Form handleSubmit={props.handleSubmit} searchValue={props.searchValue} />
      <nav className="main-nav">
        <ul>
          <li>
            <button onClick={() => props.handleSubmit(surpriseMe())}>
              Surprise Me!
            </button>
          </li>
          <li>
            <button onClick={() => props.handleSubmit("_AboutGenreLabeling")}>
              About Genre Labeling
            </button>
          </li>
          <li>
            <button onClick={() => props.handleSubmit("_AboutRecommendations")}>
              About Recommendations
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Header;
