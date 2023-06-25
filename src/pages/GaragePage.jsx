import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { fetchUserInfo } from '../api/users';
import { fetchAllUsersPosts } from '../api/posts';
import { GarageHeader } from '../components/GarageHeader';
import GaragePostings from '../components/GaragePostings';
import './GaragePage.css';

// ownerBool determines whether or not edit/delete permissions should be granted.
function GaragePage({ activeUser }) {
  // Only load the children components if the data is ready!!
  const [loading, setLoading] = useState(true);

  const ownerBool = useRef(false);
  const ownerFullName = useRef('');
  const ownerId = useRef(0);
  const paramId = useParams().userId; // '/garage/{userId}'

  if (paramId === undefined || paramId === activeUser) {
    ownerId.current = activeUser;
    ownerBool.current = true;
  } else {
    // ownerId.current = Number(paramId);
    ownerId.current = paramId;
    ownerBool.current = false;
  }

  const [headerInfoObj, setHeaderObj] = useState({});
  const [ownerPostObjArr, setPostsArr] = useState([]);

  // Fetch the GaragePage data for ownerId. (Empty dependency array => only runs once.)
  useEffect(() => {
    // Fetches an object containing an array of the owners postId's,
    // along with all of the information necessary to construct their garage header.
    const getOwnerInfo = async () => {
      try {
        const response = await fetchUserInfo(ownerId.current);
        // console.log('User info fetched.');
        setHeaderObj(response.header);
        ownerFullName.current = `${response.firstName} ${response.lastName}`;
      } catch (err) {
        // console.error('error in getOwnerInfo:', err.message);
      }
    };

    // Fetches a list of objects which represent the item posts under this owner.
    const getPostInfos = async () => {
      try {
        const response = await fetchAllUsersPosts(ownerId.current);
        // console.log('Post info fetched.');
        setPostsArr(response);
        return response;
      } catch (err) {
        // console.error('error in getPostInfos:', err.message);
        return err;
      }
    };

    // Put it all together.
    const getGarageInfo = async () => {
      await getOwnerInfo();
      await getPostInfos();
      setLoading(false);
    };

    // This call finalizes our headerInfoArr and ownerPostObjArr variables.
    getGarageInfo();
  }, []);

  // const fadeInEffect = () => {
  //   const outerDiv = document.getElementById('garagePageRoot');
  //   outerDiv.style.opacity = '1';
  // };

  const doneLoadingReturn = () => (
    <div>
      <GarageHeader
        ownerBool={ownerBool.current}
        ownerId={ownerId.current}
        ownerName={ownerFullName.current}
        headerInfoObjInput={headerInfoObj}
      />
      <GaragePostings
        ownerBool={ownerBool.current}
        ownerId={ownerId.current}
        ownerName={ownerFullName.current}
        ownerPostArr={ownerPostObjArr}
      />
    </div>
  );

  // return (
  //   <object id="garagePageRoot" onLoad={fadeInEffect}>
  //     {loading ? <p> Loading...</p> : doneLoadingReturn() }
  //   </object>
  // );

  return (
    loading
      ? <p> Loading...</p>
      : doneLoadingReturn()
  );
}

GaragePage.propTypes = {
  activeUser: PropTypes.string,
};

GaragePage.defaultProps = {
  activeUser: '',
};

export default GaragePage;
