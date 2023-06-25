// IMPORTANT:
// DO NOT ERASE ANY OF THE COMMENTED OUT CODES!!

// import S3 from 'react-aws-s3';
import React, { useState } from 'react';

// import React from 'react';
import PropTypes from 'prop-types';
// import Buffer from 'buffer';
// import { config } from '../utils/utils';
import './ProfileOverlay.css';

// window.Buffer = window.Buffer || Buffer;

export default function ProfileOverlay({ setDisplay, setUserProfilePicture }) {
  // const [uploadedFile, setUploadedFile] = useState(null);
  const [urlQuery, setUrlQuery] = useState('');

  // const handleFileInput = (e) => {
  //   //setUploadedFile(e.target.files[0]);
  //   setUserProfilePicture();
  // };

  const handleUrlChange = (e) => {
    // setPwQuery(e.target.value);
    setUrlQuery(e.target.value);
  };

  // const handleSave = async (file) => {
  const handleSave = async () => {
    // // TODO: un-comment the code below for uploading files for backend implementation

    // /* This is optional */
    // const newFileName = 'test-file';

    // const ReactS3Client = new S3(config);

    // // ReactS3Client
    // ReactS3Client.uploadFile(file, newFileName);
    // // console.log(file);
    // // .then((data) => console.log(data))
    // // .catch((err) => console.error(err));

    setUserProfilePicture(urlQuery);
    setDisplay(false);
  };

  return (
    <div id="layer">
      <input type="text" className="upload-popup" />
      <div id="addRevBox">
        <div className="avatar">
          {/* <input type="file" onChange={handleFileInput} /> */}
          <input
            type="text"
            name="profile-url-query"
            placeholder="input profile picture url here"
            value={urlQuery}
            onChange={handleUrlChange}
          />
          {/* <input type="file" /> */}
          <button
            id="upload-button"
            type="button"
            onClick={() => handleSave(uploadedFile)}
            // onClick={() => handleSave()}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

ProfileOverlay.propTypes = {
  setDisplay: PropTypes.func,
};

ProfileOverlay.defaultProps = {
  setDisplay: null,
};
