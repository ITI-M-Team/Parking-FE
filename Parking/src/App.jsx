import React from "react";
import { BrowserRouter } from "react-router-dom";
import RouteList from "./Routes/RouteList";
import { VerificationProvider } from "./components/Verification/VerificationContext";
import { LanguageProvider } from './context/LanguageContext';

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <VerificationProvider>
          <RouteList />
        </VerificationProvider>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
