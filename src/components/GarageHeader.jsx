import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { editHeaderInfo } from '../api/users';
import './GarageHeader.css';
import './EditHeaderPopUp.css';
import './AddReviewPopUp.css';

/**
 * *******************************************************
 * This stateless component defines the "Edit Header" pop-up window,
 * activated from clicking the "Edit Header" button.
 * *******************************************************
 */
function EditHeaderPopUp({
  ownerId, headerInfo, changeHeader, changeView,
}) {
  // Event-handler: "Back" button.
  const backClick = () => {
    changeView(0);
  };

  // Event-handler: "Confirm Changes" button.
  const ccClick = () => {
    const formEl = document.getElementById('editHeadForm');

    // First check that the fields have been filled in.
    // Alternative: could add more stringent input checks in addition to non-empty.
    const validBool = formEl.inputLink.value && formEl.inputDesc.value
      && formEl.inputMOD.value && formEl.inputPUL.value;

    if (!validBool) {
      // alert('Fill out all of the fields before submitting.');
      return;
    }

    changeView(0); // It's now safe to close the pop-up! (Could have done this later.)

    const updatedHeader = {
      garagePhotoURL: formEl.inputLink.value,
      garageDesc: formEl.inputDesc.value,
      moveoutDate: formEl.inputMOD.value,
      pickupLoc: formEl.inputPUL.value,
      avgRating: headerInfo.avgRating,
    };

    // *** Update the view (modify state) ***
    changeHeader(updatedHeader);

    // *** Update the backend (API call) ***
    const changeHeaderInfo = async (ownerIdInput, headerObjInput) => {
      try {
        await editHeaderInfo(ownerIdInput, headerObjInput);
        // console.log('Header updated.');
      } catch (err) {
        // console.error('error', err.message);
      }
    };

    changeHeaderInfo(ownerId, updatedHeader);
  };

  // const fadeInEffect = () => {
  //   const outerDiv = document.getElementById('editHeadDarken');
  //   outerDiv.style.opacity = '1';
  // };

  return (
    <div id="editHeadBox">
      <img id="editHeadPic" src={headerInfo.garagePhotoURL} alt="Garage Pic" width="352" height="352" />
      <form id="editHeadForm">
        <p id="editHeadDescLabel" className="editHeadLabel"><b>Description:</b></p>
        <textarea type="text" id="editHeadDesc" name="inputDesc" rows="4" cols="50" maxLength="250" defaultValue={headerInfo.garageDesc} />

        <p id="editHeadPicLabel" className="editHeadLabel"><b>Photo URL:</b></p>
        <input type="text" id="editHeadPicLink" name="inputLink" defaultValue={headerInfo.garagePhotoURL} />

        <p id="editHeadMODLabel" className="editHeadLabel"><b>Move-out Date:</b></p>
        <input type="date" id="editHeadMOD" name="inputMOD" defaultValue={headerInfo.moveoutDate} />

        <p id="editHeadPULLabel" className="editHeadLabel"><b>Pick-up Location:</b></p>
        <input type="text" id="editHeadPUL" name="inputPUL" maxLength="65" defaultValue={headerInfo.pickupLoc} />
      </form>
      <button className="popupBtnEditRev" id="editHeadBackBtn" type="button" onClick={backClick}><b>Back</b></button>
      <button className="popupBtnEditRev" id="editHeadCCBtn" type="button" onClick={ccClick}><b>Confirm Changes</b></button>
    </div>
  );
}

EditHeaderPopUp.propTypes = {
  ownerId: PropTypes.string,
  headerInfo: PropTypes.shape({
    garageDesc: PropTypes.string,
    garagePhotoURL: PropTypes.string,
    moveoutDate: PropTypes.string,
    pickupLoc: PropTypes.string,
    avgRating: PropTypes.number,
  }),
  changeHeader: PropTypes.func,
  changeView: PropTypes.func,
};

EditHeaderPopUp.defaultProps = {
  ownerId: '',
  headerInfo: {},
  changeHeader: {},
  changeView: {},
};

/**
 * ******************************************************
 * This stateless component defines the "Add Review" pop-up window,
 * activated from clicking the "Add Review" button.
 * ******************************************************
 */
function AddReviewPopUp({
  ownerId, ownerFullName, headerInfo, changeHeader, changeView,
}) {
  // Event-handler: "Back" button.
  const backClick = () => {
    changeView(0);
  };

  // Event-handler: "Confirm Changes" button.
  const ccClick = () => {
    // First check that the fields have been filled in.
    if (!document.querySelector('input[name="revInput"]:checked')) {
      // alert('Pick a rating before submitting.');
      return;
    }

    const reviewVal = document.querySelector('input[name="revInput"]:checked').value;

    changeView(0); // It's now safe to close the pop-up! (Could have done this later.)

    // Alternative: we could record the total # of reviews cast on this user in the backend:
    //              we could then use this to produce a new authentic 'average rating'.

    // Because the radio values are strings of the form '#'.
    const newRating = Number(reviewVal);

    const updatedHeader = {
      garagePhotoURL: headerInfo.garagePhotoURL,
      garageDesc: headerInfo.garageDesc,
      moveoutDate: headerInfo.moveoutDate,
      pickupLoc: headerInfo.pickupLoc,
      avgRating: newRating,
    };

    // *** Update the view (modify state) ***
    changeHeader(updatedHeader);

    // *** Update the backend (API call) ***
    const changeHeaderInfo = async (ownerIdInput, headerObjInput) => {
      try {
        await editHeaderInfo(ownerIdInput, headerObjInput);
        // console.log('Header updated.');
      } catch (err) {
        // console.error('error', err.message);
      }
    };

    changeHeaderInfo(ownerId, updatedHeader);
  };

  // const fadeInEffect = () => {
  //   const outerDiv = document.getElementById('addRevDarken');
  //   outerDiv.style.opacity = '1';
  // };

  return (
    <div id="addRevBox">
      <img id="addRevPic" src={headerInfo.garagePhotoURL} alt="Garage Pic" width="352" height="352" />
      <p id="addRevText">
        <i>
          Add a review for&nbsp;
          {ownerFullName}
          :
        </i>
      </p>
      <form id="addRevForm">
        <p id="zeroStar" className="ratingStarDecor addRevZeroPos">{'\u2605'}</p>
        <p id="zeroLabel" className="ratingLabel addRevZeroPos"><b>0</b></p>
        <input type="radio" id="zeroRad" className="radBtn addRevZeroPos" name="revInput" value="0" />

        <p id="oneStar" className="ratingStarDecor addRevOnePos">{'\u2605'}</p>
        <p id="oneLabel" className="ratingLabel addRevOnePos"><b>1</b></p>
        <input type="radio" id="oneRad" className="radBtn addRevOnePos" name="revInput" value="1" />

        <p id="twoStar" className="ratingStarDecor addRevTwoPos">{'\u2605'}</p>
        <p id="twoLabel" className="ratingLabel addRevTwoPos"><b>2</b></p>
        <input type="radio" id="twoRad" className="radBtn addRevTwoPos" name="revInput" value="2" />

        <p id="threeStar" className="ratingStarDecor addRevThreePos">{'\u2605'}</p>
        <p id="threeLabel" className="ratingLabel addRevThreePos"><b>3</b></p>
        <input type="radio" id="threeRad" className="radBtn addRevThreePos" name="revInput" value="3" />

        <p id="fourStar" className="ratingStarDecor addRevFourPos">{'\u2605'}</p>
        <p id="fourLabel" className="ratingLabel addRevFourPos"><b>4</b></p>
        <input type="radio" id="fourRad" className="radBtn addRevFourPos" name="revInput" value="4" />

        <p id="fiveStar" className="ratingStarDecor addRevFivePos">{'\u2605'}</p>
        <p id="fiveLabel" className="ratingLabel addRevFivePos"><b>5</b></p>
        <input type="radio" id="fiveRad" className="radBtn addRevFivePos" name="revInput" value="5" />
      </form>
      <button className="popupBtnAddRev" id="revBackBtn" type="button" onClick={backClick}><b>Back</b></button>
      <button className="popupBtnAddRev" id="revCCBtn" type="button" onClick={ccClick}><b>Confirm Changes</b></button>
    </div>
  );
}

AddReviewPopUp.propTypes = {
  ownerId: PropTypes.string,
  ownerFullName: PropTypes.string,
  headerInfo: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.object])),
  changeHeader: PropTypes.func,
  changeView: PropTypes.func,
};

AddReviewPopUp.defaultProps = {
  ownerId: '',
  ownerFullName: '',
  headerInfo: [],
  changeHeader: {},
  changeView: {},
};

// A helper function invoked when setting up the star rating
// HTML/CSS code in the header of a user's garage page.
const starHTML = (numberStars) => (
  <div>
    <div id="star1" className={numberStars > 0 ? 'filled' : 'unfilled'}>
      {'\u2605'}
    </div>
    <div id="star2" className={numberStars > 1 ? 'filled' : 'unfilled'}>
      {'\u2605'}
    </div>
    <div id="star3" className={numberStars > 2 ? 'filled' : 'unfilled'}>
      {'\u2605'}
    </div>
    <div id="star4" className={numberStars > 3 ? 'filled' : 'unfilled'}>
      {'\u2605'}
    </div>
    <div id="star5" className={numberStars > 4 ? 'filled' : 'unfilled'}>
      {'\u2605'}
    </div>
  </div>
);

/**
 * *******************************************************************
 * This stateful component is the parent of EditHeaderPopUp and AddReviewPopUp:
 * it defines everything in the "header" section of a Garage page.
 *
 * headerInfoObjInput is an object of the header information.
 * *******************************************************************
 */

function GarageHeader({
  ownerBool, ownerId, ownerName, headerInfoObjInput,
}) {
  const [view, setView] = useState(0);
  const [headerInfoObj, setHeader] = useState(headerInfoObjInput);

  // headerInfo[1] = headerInfoObj;

  const {
    garagePhotoURL: photoURL, garageDesc: desc, moveoutDate: moutDate,
    pickupLoc: pupLoc, avgRating: avgRtng,
  } = headerInfoObj;

  let sellerTitle = '';
  let numStars;
  if (avgRtng < 0.5) {
    sellerTitle = 'Shit Seller';
    numStars = 0;
  } else if (avgRtng < 1.5) {
    sellerTitle = 'Sketchy Seller';
    numStars = 1;
  } else if (avgRtng < 2.5) {
    sellerTitle = 'Subpar Seller';
    numStars = 2;
  } else if (avgRtng < 3.5) {
    sellerTitle = 'Satisfactory Seller';
    numStars = 3;
  } else if (avgRtng < 4.5) {
    sellerTitle = 'Superb Seller';
    numStars = 4;
  } else {
    sellerTitle = 'Supreme Seller';
    numStars = 5;
  }

  // Event-handler: "Add Review" button.
  const addReviewClick = () => {
    setView(2);
  };

  // Event-handler: "Edit Header" button.
  const editHeaderClick = () => {
    setView(1);
  };

  function manageView(viewVal) {
    if (viewVal === 1) {
      return (
        <EditHeaderPopUp
          ownerId={ownerId}
          headerInfo={headerInfoObj}
          changeHeader={setHeader}
          changeView={setView}
        />
      );
    }

    if (viewVal === 2) {
      return (
        <AddReviewPopUp
          ownerId={ownerId}
          ownerFullName={ownerName}
          headerInfo={headerInfoObj}
          changeHeader={setHeader}
          changeView={setView}
        />
      );
    }

    return (<div />);
  }

  function managePermissions(ownerBoolVal) {
    if (ownerBoolVal) {
      return (<button className="headerButton" id="editHeaderBtn" type="button" onClick={editHeaderClick}><span><b>Edit Header</b></span></button>);
    }
    return (<button className="headerButton" id="addReviewBtn" type="button" onClick={addReviewClick}><span><b>Add Review</b></span></button>);
  }

  return (
    <div>
      <svg id="svg">
        <rect id="backgroundRect"> </rect>
      </svg>
      <img id="headerPic" src={photoURL} alt="Garage Pic" width="352" height="352" />
      {starHTML(numStars)}
      <p id="sellerTitle">
        {sellerTitle}
      </p>
      <p id="headerTitle">
        <i>
          {ownerName}
          &apos;s Garage
        </i>
      </p>
      <p id="headerDesc">
        {desc}
      </p>
      <div id="subDesc">
        <p id="moveoutDate">
          <b>
            Move-out date:&nbsp;
          </b>
          {moutDate}
        </p>
        <p id="pickupLoc">
          <b>
            Pick-up location:&nbsp;
          </b>
          {pupLoc}
        </p>
      </div>
      {managePermissions(ownerBool)}
      {manageView(view)}
    </div>
  );
}

GarageHeader.propTypes = {
  ownerBool: PropTypes.bool,
  ownerId: PropTypes.string,
  ownerName: PropTypes.string,
  headerInfoObjInput: PropTypes.shape({
    garageDesc: PropTypes.string,
    garagePhotoURL: PropTypes.string,
    moveoutDate: PropTypes.string,
    pickupLoc: PropTypes.string,
  }),
};

GarageHeader.defaultProps = {
  ownerBool: false,
  ownerId: '',
  ownerName: '',
  headerInfoObjInput: {},
};

export { GarageHeader, starHTML };
