import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import { verifyLogin, verifyToken } from '../api/login';
import { NAVBAR_HEIGHT, setAxiosAuthHeaders } from '../utils/utils';
import './LoginPage.css';

/* eslint-disable no-underscore-dangle */

function LoginPage(props) {
  const { setUserId, setLoggedIn } = props;

  const [idQuery, setIdQuery] = useState('');
  const [pwQuery, setPwQuery] = useState('');
  const [errMsg, setErrMsg] = useState('');

  const navigate = useNavigate();

  const handleIdChange = (e) => {
    setIdQuery(e.target.value);
  };

  const handlePwChange = (e) => {
    setPwQuery(e.target.value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await verifyLogin(idQuery, pwQuery);
    if (response.status === 404 || idQuery === '' || pwQuery === ''
      || response.data.user.length === 0) {
      setIdQuery('');
      setPwQuery('');
      setErrMsg('incorrect id & password pair');
    } else if (response.status === 200) {
      setUserId(response.data.user[0]._id);
      console.log(response);
      setLoggedIn(true);
      sessionStorage.setItem('userId', response.data.user[0]._id);
      sessionStorage.setItem('token', response.data.token);
      setAxiosAuthHeaders();
      navigate('/');
    } else {
      setErrMsg('server error');
    }

    // console.log(response);
  };

  const handleVerifyToken = async (token, userId) => {
    setAxiosAuthHeaders();
    const response = await verifyToken(token, userId);

    if (response.status === 200) {
      setUserId(userId);
      setLoggedIn(true);
      setAxiosAuthHeaders();
      navigate('/');
    } else {
      setLoggedIn(false);
      setUserId('');
      sessionStorage.removeItem('userId');
      sessionStorage.removeItem('token');
      setAxiosAuthHeaders();
      navigate('/login');
    }
  };

  useEffect(() => {
    const sessionToken = sessionStorage.getItem('token');
    const sessionUserId = sessionStorage.getItem('userId');

    if (sessionToken !== null && sessionUserId !== null) {
      handleVerifyToken(sessionToken, sessionUserId);
    }
  }, []);

  return (
    <div
      id="login-page"
      style={{ height: `calc(100vh - ${NAVBAR_HEIGHT})` }}
      className="container-lg"
    >
      <div>
        <div className="row">
          <div className="col-12">
            <h1 id="login-page-logo">
              Penn Garage
            </h1>
          </div>
        </div>
        <div className="row">
          <div id="login-text" className="col-3">
            <div id="id-text" className="row">
              ID:
            </div>
            <div id="pw-text" className="row">
              Password:
            </div>
          </div>
          <div id="login-box" className="col-6">
            <div id="id-box" className="row">
              <input
                type="text"
                name="id-query"
                placeholder="enter id here"
                value={idQuery}
                onChange={handleIdChange}
              />
            </div>
            <div id="pw-box" className="row">
              <input
                type="text"
                name="pw-query"
                placeholder="enter pw here"
                value={pwQuery}
                onChange={handlePwChange}
              />
            </div>
          </div>
          <div id="login-button" className="col-3">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleLogin}
            >
              Login
            </button>
          </div>
        </div>

        <div className="row">
          <div id="error" className="col-12">
            {errMsg}
          </div>
        </div>

        <div id="link-row" className="row">
          <div className="col-6">
            <Link to="/login/new-user"> Create account </Link>
          </div>
          <div className="col-6">
            <Link to="/login/forgot"> Forgot ID/Password? </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

LoginPage.propTypes = {
  setUserId: PropTypes.func.isRequired,
  setLoggedIn: PropTypes.func.isRequired,
};
