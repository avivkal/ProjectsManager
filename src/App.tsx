import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Signup from './Screens/Signup/Signup';
import Login from './Screens/Login/Login';
import Home from './Screens/Home/Home';
import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports';
import ConfirmSignup from './Screens/ConfirmSignup/ConfirmSignup';

Amplify.configure(awsconfig);

function App() {
  return (

    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} /> 
        <Route path="/confirmSignup" element={<ConfirmSignup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>

  );
}

export default App;
