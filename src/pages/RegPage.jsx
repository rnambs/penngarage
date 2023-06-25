import React, { useState } from 'react';
import './RegPage.css';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { verifyId, registerUser } from '../api/login';

function onlyLowercaseAndNumbers(str) {
  return /^[a-z0-9]*$/.test(str);
}

function RegPage() {
  const [idQuery, setIdQuery] = useState('');
  const [pwQuery, setPwQuery] = useState('');
  const [pw2Query, setPw2Query] = useState('');
  const [firstnameQuery, setFirstnameQuery] = useState('');
  const [lastnameQuery, setLastnameQuery] = useState('');
  const [emailQuery, setEmailQuery] = useState('');
  const [questionQuery, setQuestionQuery] = useState('');
  const [answerQuery, setAnswerQuery] = useState('');

  const [idMsg, setIdMsg] = useState('');
  const [errMsg, setErrMsg] = useState('');

  const [idChecked, setIdChecked] = useState(false);

  const navigate = useNavigate();

  const [show, setShow] = useState(false);

  const handleClose = () => {
    setIdQuery('');
    setPwQuery('');
    setPw2Query('');
    setFirstnameQuery('');
    setLastnameQuery('');
    setEmailQuery('');
    setQuestionQuery('');
    setAnswerQuery('');
    setIdMsg('');
    setErrMsg('');
    setIdChecked(false);

    setShow(false);
  };
    // const handleShow = () => setShow(true);

  const handleIdChange = (e) => {
    setIdQuery(e.target.value);
  };

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

  const handleQuestionChange = (e) => {
    setQuestionQuery(e.target.value);
  };

  const handleAnswerChange = (e) => {
    setAnswerQuery(e.target.value);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (idQuery === '' || pwQuery === '' || pw2Query === '' || firstnameQuery === ''
    || lastnameQuery === '' || emailQuery === '' || questionQuery === '' || answerQuery === '') {
      setErrMsg('All fields are required.');
    } else if (!idChecked) {
      setErrMsg("'Check ID' is not completed.");
    } else if (pwQuery !== pw2Query) {
      setErrMsg('Two passwords do not match');
    } else {
      const response = await registerUser(
        idQuery,
        pwQuery,
        firstnameQuery,
        lastnameQuery,
        emailQuery,
        questionQuery,
        answerQuery,
      );

      if (response.status === 201) {
        setErrMsg('Registration complete!');
        setShow(true);
      } else {
        setErrMsg('Error occurred.');
      }
      // console.log(response.data);
    }
  };

  const handleCheck = async (e) => {
    e.preventDefault();

    if (idQuery.length < 3 || idQuery.length > 12) {
      setIdMsg('id should be of length 3~12 letters');
    } else if (!onlyLowercaseAndNumbers(idQuery)) {
      setIdMsg('id should only have lowercase letters and numbers');
    } else {
      const response = await verifyId(idQuery);

      // console.log(response.data);

      if (response.status !== 200) {
        setIdMsg('id already exists');
      } else {
        setIdMsg('Check ID completed');
        setIdChecked(true);
      }
    }
  };

  const handleGoToLogin = async () => {
    navigate('/login');
  };

  return (
    <div id="reg-page">
      <div className="row">
        <div id="title-text" className="col-12">
          User Registration
        </div>
      </div>
      <div className="row">
        <div className="col-3">
          ID:
        </div>
        <div className="col-6">
          <input type="text" name="id-query" placeholder="enter id here" value={idQuery} onChange={handleIdChange} />
        </div>
        <div className="col-3">
          <button type="button" className="btn btn-secondary" onClick={handleCheck}>
            Check ID
          </button>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          {idMsg}
        </div>
      </div>
      <div className="row">
        <div className="col-3">
          Password:
        </div>
        <div className="col-6">
          <input type="text" name="pw-query" placeholder="enter pw here" value={pwQuery} onChange={handlePwChange} />
        </div>
      </div>
      <div className="row">
        <div className="col-3">
          Password again:
        </div>
        <div className="col-6">
          <input type="text" name="pw2-query" placeholder="enter pw again here" value={pw2Query} onChange={handlePw2Change} />
        </div>
      </div>
      <div className="row">
        <div className="col-3">
          First Name:
        </div>
        <div className="col-6">
          <input type="text" name="firstname-query" placeholder="enter first name here" value={firstnameQuery} onChange={handleFirstnameChange} />
        </div>
      </div>
      <div className="row">
        <div className="col-3">
          Last Name:
        </div>
        <div className="col-6">
          <input type="text" name="lastname-query" placeholder="enter last name here" value={lastnameQuery} onChange={handleLastnameChange} />
        </div>
      </div>
      <div className="row">
        <div className="col-3">
          Email:
        </div>
        <div className="col-6">
          <input type="text" name="email-query" placeholder="enter email here" value={emailQuery} onChange={handleEmailChange} />
        </div>
      </div>
      <div className="row">
        <div className="col-3">
          Security Question:
        </div>
        <div className="col-6">
          <input type="text" name="question-query" placeholder="enter question here" value={questionQuery} onChange={handleQuestionChange} />
        </div>
      </div>
      <div className="row">
        <div className="col-3">
          Security Answer:
        </div>
        <div className="col-6">
          <input type="text" name="answer-query" placeholder="enter answer here" value={answerQuery} onChange={handleAnswerChange} />
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          Answer should be simple, one word
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <button type="button" className="btn btn-secondary" onClick={handleRegister}>
            Register
          </button>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          {errMsg}
        </div>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Registration Complete</Modal.Title>
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

export default RegPage;
