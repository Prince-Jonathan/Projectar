import React, { useState, useEffect } from "react";
import Menu from "./components/Menu";

function App() {
  const [name, setName] = useState({"name":"Jonathan"});
  useEffect(() => {
    fetch("/api").then((res) => res.json().then((data) => setName(data)));
  });
  return <Menu user={name} />;
  // return <div>hello,there</div>;
}

export default App;
