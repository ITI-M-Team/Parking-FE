import React from "react";
import { BrowserRouter } from "react-router-dom";
import RouteList from "./Routes/RouteList";
import { VerificationProvider } from "./components/Verification/VerificationContext";

function App() {
  return (
    <BrowserRouter>
      <VerificationProvider>
        <RouteList />
      </VerificationProvider>
    </BrowserRouter>
  );
}

export default App;
