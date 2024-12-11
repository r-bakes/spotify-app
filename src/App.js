import React, { Component } from "react";
import Header from "./components/Header";
import Search from "./components/Search";
import axios from "axios";

var client_id = "";
var client_secret = "";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchValue: "",
      accessToken: this.authenticateApp(),
      hasError: false,
    };
  }

  handleSubmit = (searchInput) => {
    this.setState({ searchValue: searchInput });
  };

  authenticateApp = () => {
    var url = "https://accounts.spotify.com/api/token";
    axios(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          new Buffer(client_id + ":" + client_secret).toString("base64"),
      },
      data: "grant_type=client_credentials",
    })
      .then((response) => {
        this.setState({ accessToken: response.data.access_token });
      })
      .catch((error) => {
        console.log("Access token request failed.\n", error);
        this.setState({ hasError: true });
      });
  };

  render() {
    return (
      <div className="container">
        <Header
          handleSubmit={this.handleSubmit}
          searchValue={this.state.searchValue}
        ></Header>
        <Search
          searchValue={this.state.searchValue}
          accessToken={this.state.accessToken}
        ></Search>
      </div>
    );
  }
}

export default App;
