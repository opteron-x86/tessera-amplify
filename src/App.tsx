import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Authenticator } from '@aws-amplify/ui-react';
import Home from "./pages/Home";
import GamePage from "./pages/GamePage";
import CardAdminPage from "./pages/CardAdminPage";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route 
          path="/game" 
          element={
            <Authenticator>
              <GamePage />
            </Authenticator>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <Authenticator>
              <CardAdminPage />
            </Authenticator>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
