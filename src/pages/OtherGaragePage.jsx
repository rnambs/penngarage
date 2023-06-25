import React from 'react';
import PropTypes from 'prop-types';
import GaragePage from './GaragePage';

function OtherGaragePage(props) {
  const { userId } = props;

  return (
    <GaragePage activeUser={userId} />
  );
}

export default OtherGaragePage;

OtherGaragePage.propTypes = {
  userId: PropTypes.string.isRequired,
};
