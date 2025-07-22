import React from "react";
import { BrowserRouter } from "react-router-dom";
import RouteList from "./Routes/RouteList";
import { VerificationProvider } from "./components/Verification/VerificationContext";
// import GoogleTranslate from "./components/translate/GoogleTranslate";
function App() {
  
  return (
    <BrowserRouter>
      <VerificationProvider>
        {/* <GoogleTranslate /> */}
        <RouteList />
      </VerificationProvider>
    </BrowserRouter>
  );
}

export default App;
