// import React, { useState, useEffect } from "react";
import React, { Component } from "react";
import Menu from "./components/Menu";

// function App() {
//   const [name, setName] = useState({"name":"Jonathan"});
//   useEffect(() => {
//     fetch("/api").then((res) => res.json().then((data) => setName(data)));
//   });
//   return <Menu user={name} />;
//   // return <div>hello,there</div>;
// }

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
