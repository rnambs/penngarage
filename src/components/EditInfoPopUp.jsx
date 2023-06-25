import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './EditInfoPopUp.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { editUserInfo } from '../api/users';

/**
 * *******************************************************
 * This component defines the "Edit Header" pop-up window,
 * activated from clicking the "Edit Header" button.
 * *******************************************************
 */
function EditInfoPopUp(props) {
  const {
    userId, show, setShow, userInfo,
  } = props;

  const [pwQuery, setPwQuery] = useState('');
  const [pw2Query, setPw2Query] = useState('');
  const [firstnameQuery, setFirstnameQuery] = useState('');
  const [lastnameQuery, setLastnameQuery] = useState('');
  const [emailQuery, setEmailQuery] = useState('');
  const [phoneQuery, setPhoneQuery] = useState('');
  const [questionQuery, setQuestionQuery] = useState('');
  const [answerQuery, setAnswerQuery] = useState('');
  const [urlQuery, setUrlQuery] = useState('');

  useEffect(() => {
    setFirstnameQuery(userInfo.firstName);
    setLastnameQuery(userInfo.lastName);
    setEmailQuery(userInfo.email);
    setPhoneQuery(userInfo.phone);
    setQuestionQuery(userInfo.question);
    setAnswerQuery(userInfo.answer);
    setPwQuery(userInfo.password);
    setPw2Query(userInfo.password);
    setUrlQuery(userInfo.profilePicture);
  }, [userInfo]);

  const [errMsg, setErrMsg] = useState('');

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

  const handlePhoneChange = (e) => {
    setPhoneQuery(e.target.value);
  };

  const handleQuestionChange = (e) => {
    setQuestionQuery(e.target.value);
  };

  const handleAnswerChange = (e) => {
    setAnswerQuery(e.target.value);
  };

  const handleUrlChange = (e) => {
    setUrlQuery(e.target.value);
  };

  const handleCancel = () => {
    setShow(false);
  };

  const handleConfirm = async (e) => {
    e.preventDefault();

    if (pwQuery !== pw2Query) {
      setErrMsg('two passwords must match');
    } else {
      const response = await editUserInfo(
        userId,
        pwQuery,
        firstnameQuery,
        lastnameQuery,
        emailQuery,
        phoneQuery,
        questionQuery,
        answerQuery,
        urlQuery,
      );

      if (response.status === 200) {
        setShow(false);
      } else {
        setErrMsg('Error occurred.');
      }
    }
  };

  return (
    <Modal show={show} onHide={handleCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit User Information</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-3">Password:</div>
          <div className="col-6">
            <input
              type="text"
              name="pw-query"
              value={pwQuery}
              placeholder="enter new password here"
              onChange={handlePwChange}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-3">Password again:</div>
          <div className="col-6">
            <input
              type="text"
              name="pw2-query"
              placeholder="enter new password again here"
              value={pw2Query}
              onChange={handlePw2Change}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-3">First Name:</div>
          <div className="col-6">
            <input
              type="text"
              name="firstname-query"
              value={firstnameQuery}
              onChange={handleFirstnameChange}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-3">Last Name:</div>
          <div className="col-6">
            <input
              type="text"
              name="lastname-query"
              value={lastnameQuery}
              onChange={handleLastnameChange}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-3">Email:</div>
          <div className="col-6">
            <input
              type="text"
              name="email-query"
              value={emailQuery}
              onChange={handleEmailChange}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-3">Phone:</div>
          <div className="col-6">
            <input
              type="text"
              name="phone-query"
              value={phoneQuery}
              onChange={handlePhoneChange}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-3">Security Question:</div>
          <div className="col-6">
            <input
              type="text"
              name="question-query"
              value={questionQuery}
              onChange={handleQuestionChange}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-3">Security Answer:</div>
          <div className="col-6">
            <input
              type="text"
              name="answer-query"
              value={answerQuery}
              onChange={handleAnswerChange}
            />
          </div>
        </div>
        {/* <div className="row">
        <div className="col-12">
          Answer should be simple, one word
        </div>
      </div> */}
        <div className="row">
          <div className="col-12">{errMsg}</div>
        </div>
        <div className="row">
          <div className="col-3">Profile Picture URL:</div>
          <div className="col-6">
            <input
              type="text"
              name="answer-query"
              value={urlQuery}
              onChange={handleUrlChange}
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleConfirm}>
          Confirm Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

EditInfoPopUp.propTypes = {
  userId: PropTypes.number.isRequired,
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
  userInfo: PropTypes.shape({
    id: PropTypes.number,
    username: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    password: PropTypes.string,
    phone: PropTypes.string,
    question: PropTypes.string,
    answer: PropTypes.string,
    profilePicture: PropTypes.string,
    header: PropTypes.shape({
      garagePhotoURL: PropTypes.string,
      garageDesc: PropTypes.string,
      moveoutDate: PropTypes.string,
      pickupLoc: PropTypes.string,
      avgRating: PropTypes.number,
    }),
  }).isRequired,
};

export default EditInfoPopUp;
