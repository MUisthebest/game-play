import React from "react";
import Game from "./components/Game";

function App() {
  return (
    <div
      style={{
        backgroundColor: "transparent",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-start",
      }}
    >
      <Game />
    </div>
  );
}

export default App;
