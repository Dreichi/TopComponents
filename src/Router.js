import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { useState } from 'react';
import NavbarComponent from './components/NavbarComponent';
import FooterComponent from './components/FooterComponent';
import HeaderComponent from './components/HeaderComponent';
import SignupPage from './pages/SignupPage';

function Router() {
  const [isLogged, setIsLogged] = useState(Boolean(sessionStorage.getItem('accessToken')) || false);
  const [accessToken, setAccessToken] = useState(sessionStorage.getItem('accessToken') || '');

  const notify = (text, type) => {
    console.log("notify called")
    toast(text, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
      theme: "colored",
      type: type || "info"
    })
  };

  return (
    <BrowserRouter>
      <NavbarComponent isLogged={isLogged} setIsLogged={setIsLogged} />
      <HeaderComponent />
      <Routes>
        <Route path="/" element={<h1>Homepage</h1>} />
        <Route path="/signup" element={<SignupPage notify={notify} />} />
      </Routes>
      <FooterComponent />
    </BrowserRouter>

  );
}

export default Router;
