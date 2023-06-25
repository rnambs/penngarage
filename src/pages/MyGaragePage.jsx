import React from 'react';
import PropTypes from 'prop-types';
import GaragePage from './GaragePage';

function MyGaragePage(props) {
  const { userId } = props;

  return (
    <GaragePage activeUser={userId} />
  );
}

MyGaragePage.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default MyGaragePage;
