import React, { Component } from "react";
import Menu from "./components/Menu";


class App extends Component {
  state = { name: "Jonathan" };
  componentDidMount() {
    this.fetch();
  }
  fetch=()=>{
    return fetch("/api").then((res) => res.json().then((data) => this.setState(data)));
  }
  render() {
    return <Menu user={this.state} />;
  }
}
export default App;
