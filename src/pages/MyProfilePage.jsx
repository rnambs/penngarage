import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { currentUserInfo } from '../api/users';
import './MyProfilePage.css';
import ItemPostingTable from '../components/ItemPostingTable';
// import ProfileOverlay from '../components/ProfileOverlay';
import { fetchUserContact, getBookmarks } from '../api/myprofile';
import EditInfoPopUp from '../components/EditInfoPopUp';
import { setAxiosAuthHeaders } from '../utils/utils';

function MyProfilePage({ userId, setUserId, setLoggedIn }) {
  const oID = userId;
  const [userPassword, setUserPassword] = useState();
  const [userEmail, setUserEmail] = useState();
  const [userPhone, setUserPhone] = useState();
  const [userFirstName, setUserFirstName] = useState();
  const [userLastName, setUserLastName] = useState();
  const [userProfilePicture, setUserProfilePicture] = useState();
  // const [display, setDisplay] = useState(false);
  const [recentBookmarks, setRecentBookmarks] = useState([]);
  // const [page, setPage] = useState(1);
  console.log(userPassword);

  // const [errMsg, setErrMsg] = useState('');
  const [showEditInfo, setShowEditInfo] = useState(false);
  const [userInfo, setUserInfo] = useState({});

  const USER_PLACEHOLDER_IMAGE = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';

  // const overflowHandler = () => {
  //   if (display) {
  // return <ProfileOverlay setDisplay={setDisplay} setUserProfilePicture={setUserProfilePicture}/>;
  //   }
  //   return '';
  // };

  const handleLogOut = () => {
    setLoggedIn(false);
    setUserId('');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('token');
    setAxiosAuthHeaders();
  };

  useEffect(() => {
    const getOwnerContact = async () => {
      try {
        const response = await fetchUserContact(userId);
        setUserPassword(response.password);
        setUserEmail(response.email);
        setUserPhone(response.phone);
        setUserFirstName(response.firstName);
        setUserLastName(response.lastName);
        setUserProfilePicture(response.profilePicture);
      } catch (err) {
        // console.error('', err.message);
      }
    };

    const getUserBookmarks = async () => {
      const response = await getBookmarks(userId);

      if (response.status === 200) {
        setRecentBookmarks(response.data);
      }
    };

    const getInfo = async () => {
      await getOwnerContact();
      await getUserBookmarks();
    };

    getInfo();
  }, []);

  const handleEdit = async (e) => {
    e.preventDefault();

    const response = await currentUserInfo(oID);

    if (response.status === 200) {
      setUserInfo(response.data);
      setShowEditInfo(true);
    } else {
      // setErrMsg('Failed to load current user info');
    }
  };

  return (
    <div>
      <div id="profile-page">
        <div className="page-container">
          <div id="infoBox-left">
            <div className="profile-display">
              <div id="profile-img">
                <img src={userProfilePicture === '' || !userProfilePicture ? USER_PLACEHOLDER_IMAGE : userProfilePicture} alt="current-profile-pic" className="profile-img" />
              </div>
              {/* <button
                id="change-pic-button"
                type="button"
                onClick={() => { setDisplay(!display); }}
              >
                Change
              <div>
                {overflowHandler()}
              </div> */}
            </div>
            <div className="other-display">
              <div className="display-list">
                Email: &nbsp;
                {userEmail}
              </div>
              <div className="display-list">
                Phone: &nbsp;
                {userPhone}
              </div>
              <div className="display-list">
                First Name: &nbsp;
                {userFirstName}
              </div>
              <div className="display-list">
                Last Name: &nbsp;
                {userLastName}
              </div>
            </div>
            <div>
              <button id="edit-button" type="button" onClick={handleEdit}>
                Edit
              </button>
            </div>
            <button id="log-out-button" type="button"><Link to="/login" onClick={handleLogOut} style={{ textDecoration: 'none' }}>Log Out</Link></button>
          </div>
          <div id="contentBox-right">
            <div className="contains-post">
              <div className="align">
                <h1 className="text">Recent Bookmarks</h1>
              </div>
              <div className="item-table">
                <ItemPostingTable
                  id="recent-post"
                  items={recentBookmarks}
                  userId={userId}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditInfoPopUp
        userId={userId}
        show={showEditInfo}
        setShow={setShowEditInfo}
        userInfo={userInfo}
      />

    </div>
  );
}

MyProfilePage.propTypes = {
  userId: PropTypes.string.isRequired,
  setUserId: PropTypes.func.isRequired,
  setLoggedIn: PropTypes.func.isRequired,
};

export default MyProfilePage;
