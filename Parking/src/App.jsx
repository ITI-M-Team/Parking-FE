import React from "react";
import { BrowserRouter } from "react-router-dom";
import RouteList from "./Routes/RouteList";

function App() {
  return (
    <BrowserRouter>
      <RouteList />
    </BrowserRouter>
  );
}

export default App;
