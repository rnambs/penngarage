import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { NAVBAR_HEIGHT, setAxiosAuthHeaders } from './utils/utils';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegPage from './pages/RegPage';
import ForgotPage from './pages/ForgotPage';
import Navbar from './components/Navbar';
import SearchPage from './pages/SearchPage';
import MyProfilePage from './pages/MyProfilePage';
// import ChatRoom from './pages/ChatPage';
import ChatPage from './pages/Chat';
import MyGaragePage from './pages/MyGaragePage';
import OtherGaragePage from './pages/OtherGaragePage';

function App() {
  const [userId, setUserId] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  const setAxiosResInterceptors = () => {
    axios.interceptors.response.use((res) => res, (err) => {
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error

      // console.log(err)

      if (err.response.status === 401) {
        setLoggedIn(false);
        setUserId('');
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('token');
        setAxiosAuthHeaders();
        navigate('/login');
      }

      return err.response;
    });
  };

  useEffect(() => {
    if (!loggedIn) {
      navigate('/login');
    }

    setAxiosResInterceptors();
  }, []);

  return (
    <div className="App">
      {loggedIn
        ? <Navbar />
        : ''}
      <div style={{ height: NAVBAR_HEIGHT }} />
      <Routes>
        <Route path="/" element={<HomePage userId={userId} />} />
        <Route path="/login" element={<LoginPage setUserId={setUserId} setLoggedIn={setLoggedIn} />} />
        <Route path="/login/new-user" element={<RegPage />} />
        <Route path="/login/forgot" element={<ForgotPage />} />
        <Route path="/search" element={<SearchPage userId={userId} />} />
        <Route path="/garage" element={<MyGaragePage userId={userId} />} />
        <Route path="/garage/:userId" element={<OtherGaragePage userId={userId} />} />
        <Route path="/profile" element={<MyProfilePage setUserId={setUserId} setLoggedIn={setLoggedIn} userId={userId} />} />
        <Route path="/profile/bookmarks" element={<div>my bookmarks page</div>} />
        <Route path="/messages" element={<ChatPage userId={userId} />} />
        <Route path="/messages/:receiverId" element={<ChatPage userId={userId} />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </div>
  );
}

export default App;
