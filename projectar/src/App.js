import React, { Component } from "react";


class App extends Component {
  state = { name: "Jonathan" };
  componentDidMount() {
    this.fetch();
  }
  fetch=()=>{
    return fetch("/api").then((res) => res.json().then((data) => this.setState(data)));
  }
  render() {
    return <div></div>;
  }
}
export default App;
