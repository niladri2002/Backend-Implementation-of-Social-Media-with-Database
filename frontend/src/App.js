// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './Components/Home';
import Login from './Components/Login';
import Signup from './Components/Signup';
import  Profile  from "./Components/Profile";
import  AddPost  from "./Components/AddPost";

const App = () => {
  const [isLoggedIn, setLoggedIn] = React.useState(false);

  const handleLogin = () => {
    setLoggedIn(true);
  };

  const handleSignup = () => {
    setLoggedIn(true);
  };

  const handleLogout=()=>{
    setLoggedIn(false);
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/" element={<Signup onSignup={handleSignup} />} />
        <Route
          path="/home"
          element={isLoggedIn ? <Home onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
         <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/add-post" element={isLoggedIn ? <AddPost /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
