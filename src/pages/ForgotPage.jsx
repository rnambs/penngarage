import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { verifyForgot, resetPassword } from '../api/login';
import './ForgotPage.css';

function ForgotPage() {
  const [pwQuery, setPwQuery] = useState('');
  const [pw2Query, setPw2Query] = useState('');
  const [firstnameQuery, setFirstnameQuery] = useState('');
  const [lastnameQuery, setLastnameQuery] = useState('');
  const [emailQuery, setEmailQuery] = useState('');
  const [answerQuery, setAnswerQuery] = useState('');
  const [errMsg0, setErrMsg0] = useState('');
  const [errMsg1, setErrMsg1] = useState('');
  const [errMsg2, setErrMsg2] = useState('');
  const [userData, setUserData] = useState({});
  const [screen, setScreen] = useState(0);

  const [show, setShow] = useState(false);

  const navigate = useNavigate();

  const handlePwChange = (e) => {
    setPwQuery(e.target.value);
  };

  const handlePw2Change = (e) => {
    setPw2Query(e.target.value);
  };

  const handleFirstnameChange = (e) => {
    setFirstnameQuery(e.target.value);
  };

  const handleLastnameChange = (e) => {
    setLastnameQuery(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmailQuery(e.target.value);
  };

  const handleAnswerChange = (e) => {
    setAnswerQuery(e.target.value);
  };

  const handleClose = () => {
    setPwQuery('');
    setPw2Query('');

    setShow(false);
  };

  const handleSubmit0 = async (e) => {
    e.preventDefault();

    const response = await verifyForgot(
      firstnameQuery,
      lastnameQuery,
      emailQuery,
    );
    // const responseData = response.data

    // console.log(response.data);

    if (response.data.length === 0) {
      setFirstnameQuery('');
      setLastnameQuery('');
      setEmailQuery('');

      setErrMsg0('Incorrect user information. Try again');
    } else {
      // setQuestion(responseData.question)
      setUserData(response.data[0]);

      console.log(response);

      setScreen(1);
    }
  };

  const handleSubmit1 = async (e) => {
    e.preventDefault();

    if (userData.answer !== answerQuery) {
      setAnswerQuery('');

      setErrMsg1('Incorrect answer. Try again');
    } else {
      setScreen(2);
    }
  };

  const handleSubmit2 = async (e) => {
    e.preventDefault();

    if (pwQuery === '') {
      setErrMsg2('Empty field input');
    }
    if (pwQuery !== pw2Query) {
      setErrMsg2('two passwords do not match. Try again');
    } else {
      const response = await resetPassword(
        pwQuery,
        userData,
      );

      if (response.status === 200) {
        setShow(true);
      } else {
        setErrMsg2('error occurred in password reset');
      }
    }
  };

  const handleGoToLogin = async () => {
    navigate('/login');
  };

  const switchScreen = () => {
    let returnComp;

    if (screen === 0) {
      returnComp = (
        <div>
          <div className="row">
            <div className="col-12">Forgot ID/PW?</div>
          </div>
          <div className="row">
            <div className="col-12">Enter user information</div>
          </div>
          <div className="row">
            <div className="col-3">First Name:</div>
            <div className="col-9">
              <input
                type="text"
                name="firstname-query"
                placeholder="enter first name here"
                value={firstnameQuery}
                onChange={handleFirstnameChange}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-3">Last Name:</div>
            <div className="col-9">
              <input
                type="text"
                name="lastname-query"
                placeholder="enter last name here"
                value={lastnameQuery}
                onChange={handleLastnameChange}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-3">Email:</div>
            <div className="col-9">
              <input
                type="text"
                name="email-query"
                placeholder="enter email here"
                value={emailQuery}
                onChange={handleEmailChange}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleSubmit0}
              >
                Submit
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col-12">{errMsg0}</div>
          </div>
        </div>
      );
    } else if (screen === 1) {
      returnComp = (
        <div>
          <div className="row">
            <div className="col-12">Security Question</div>
          </div>
          <div className="row">
            <div className="col-3">Question:</div>
            <div className="col-9">
              {userData.question}
              {/* {question} */}
            </div>
          </div>
          <div className="row">
            <div className="col-3">Answer:</div>
            <div className="col-9">
              <input
                type="text"
                name="answer-query"
                placeholder="type in answer here"
                value={answerQuery}
                onChange={handleAnswerChange}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              Enter one-word answer for the question above.
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleSubmit1}
              >
                Submit
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col-12">{errMsg1}</div>
          </div>
        </div>
      );
    } else if (screen === 2) {
      returnComp = (
        <div>
          <div className="row">
            <div className="col-3">Your ID is:</div>
            <div className="col-6">
              {userData.username}
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <button type="button" className="btn btn-secondary" onClick={handleGoToLogin}>
                Return to Login
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col-12">Forgot your password? Reset it below:</div>
          </div>
          <div className="row">
            <div className="col-12">Reset Password</div>
          </div>
          <div className="row">
            <div className="col-3">Enter new password:</div>
            <div className="col-9">
              <input
                type="text"
                name="pw-query"
                placeholder="type in password here"
                value={pwQuery}
                onChange={handlePwChange}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-3">Enter new password again:</div>
            <div className="col-9">
              <input
                type="text"
                name="pw2-query"
                placeholder="type in password again here"
                value={pw2Query}
                onChange={handlePw2Change}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleSubmit2}
              >
                Submit
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col-12">{errMsg2}</div>
          </div>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Reset Password Complete</Modal.Title>
            </Modal.Header>
            <Modal.Body>You may proceed to the login page.</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={handleGoToLogin}>
                Go to Login
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      );
    }

    return returnComp;
  };
  return <div id="forgot-page">{switchScreen()}</div>;
}

export default ForgotPage;
