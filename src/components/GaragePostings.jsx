import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import ItemPostingTable from './ItemPostingTable';
import { createNewPost, editPost, deletePost } from '../api/posts';
import './GaragePostings.css';
import './AddPostPopUp.css';
import './EditPostPopUp.css';
import './DeletePostPopUp.css';
import './AddReviewPopUp.css';

/* eslint-disable no-underscore-dangle */

/**
 * *******************************************************
 * This stateless component defines the "Add Post" pop-up window,
 * activated from clicking the "Add Post" button.
 * *******************************************************
 */
function AddPostPopUp({
  ownerId, ownerName, currPostsArr, changePostsArr, changeView,
}) {
  const [urlQuery, setUrlQuery] = useState('');
  const [fixedQuery, setFixedQuery] = useState('');
  const [radioQuery, setRadioQuery] = useState('');
  const [dropdownQuery, setDropdownQuery] = useState('none');
  const [titleQuery, setTitleQuery] = useState('');
  const [dateQuery, setDateQuery] = useState('');
  const [descriptionQuery, setDescriptionQuery] = useState('');

  const handleUrlChange = (e) => {
    setUrlQuery(e.target.value);
  };

  const handleFixedChange = (e) => {
    setFixedQuery(e.target.value);
  };

  const handleRadioChange = (e) => {
    setRadioQuery(e.target.value);
  };

  const handleDropdownChange = (e) => {
    setDropdownQuery(e.target.value);
  };

  const handleTitleChange = (e) => {
    setTitleQuery(e.target.value);
  };

  const handleDateChange = (e) => {
    setDateQuery(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescriptionQuery(e.target.value);
  };

  // Event-handler: "Back" button.
  const backClick = () => {
    setUrlQuery('');
    setFixedQuery('');
    setRadioQuery('');
    setDropdownQuery('none');
    setTitleQuery('');
    setDateQuery('');
    setDescriptionQuery('');

    changeView(0);
  };

  // Event-handler: "Confirm Changes" button.
  const ccClick = async () => {
    // const formEl = document.getElementById('addPostForm');
    // console.log(e)
    // if (!document.querySelector('input[name="sellMethod"]:checked')) {
    //   // alert('A sell method must be selected.');
    //   return;
    // }

    // const sellMethod = document.querySelector('input[name="sellMethod"]:checked').value;

    // First check that the fields have been filled in.
    // Alternative: could add more stringent input checks in addition to non-empty.
    // const validBool = formEl.inputTitle.value && formEl.inputDesc.value
    //   && formEl.inputLink.value && formEl.inputSBD.value
    //   && sellMethod && (formEl.inputPrice.value || sellMethod === 'bid')
    //   && formEl.addPostCategory.value !== 'none';

    const validBool = (urlQuery !== '') && (descriptionQuery !== '')
      && (titleQuery !== '') && (dateQuery !== '')
      && (((radioQuery === 'fixed') && (fixedQuery !== '') && (Number(fixedQuery) > 0))
        || (radioQuery === 'bid'))
      && (dropdownQuery !== 'none');

    if (!validBool) {
      // alert('Fill out all of the fields before submitting.');
      return;
    }

    // changeView(0); // It's now safe to close the pop-up! (Could have done this later.)

    // Now handle the price. (Which should be 0 if the post is a bid.)
    let initPrice = 0;
    // if (sellMethod === 'fixed') {
    //   // Else, we keep initialize the price (a.k.a. the highest bid) as zero.
    //   initPrice = Number(formEl.inputPrice.value);
    // }

    if (radioQuery === 'fixed') {
      // Else, we keep initialize the price (a.k.a. the highest bid) as zero.
      // initPrice = Number(formEl.inputPrice.value);
      initPrice = Number(fixedQuery);
    }

    // We must also obtain the date (yyy-mm-dd) this post will be made.
    const currentDate = new Date().toISOString().split('T')[0];

    // Finally, create the new post object.
    const newPost = {
      sellerId: ownerId,
      seller: ownerName,
      // title: formEl.inputTitle.value,
      title: titleQuery,
      // description: formEl.inputDesc.value,
      description: descriptionQuery,
      // image: formEl.inputLink.value,
      image: urlQuery,
      // priceType: document.querySelector('input[name="sellMethod"]:checked').value,
      priceType: radioQuery,
      price: initPrice,
      postedOn: currentDate,
      // availableUntil: formEl.inputSBD.value,
      availableUntil: dateQuery,
      // category: formEl.addPostCategory.value,
      category: dropdownQuery,
    };

    // *************************************
    // *** Update the backend (API call) ***
    // *************************************
    let returnedId;

    const addNewPost = async (newPostObj) => {
      try {
        const insertedId = await createNewPost(newPostObj);
        returnedId = insertedId;
        // console.log('Post added.');
      } catch (err) {
        // console.error('error', err.message);
      }
    };

    // This will determine the backend ID of the post, which the view will need!
    await addNewPost(newPost);

    // **************************************
    // *** Update the view (modify state) ***
    // **************************************
    // Pass a new array of posts objects (now including this most recent object) through
    // the mutator of the posts array state. This will affect the view and update the backend.

    newPost._id = returnedId;

    // This is an in-place operation: we want the most recent post first.
    currPostsArr.unshift(newPost);
    changePostsArr(currPostsArr);

    backClick();
  };

  const undefinedPhoto = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/-Insert_image_here-.svg/1280px--Insert_image_here-.svg.png';

  // const fadeInEffect = () => {
  //   const outerDiv = document.getElementById('addPostDarken');
  //   outerDiv.style.opacity = '1';
  // };

  return (
    <div id="addPostBox">
      <img id="addPostPic" src={undefinedPhoto} alt="Undefined" width="352" height="352" />
      <form id="addPostForm">
        <p id="addPostPicLabel" className="addPostLabel"><b>Photo URL:</b></p>
        <input type="text" id="addPostPicLink" name="inputLink" placeholder="enter picture url here" value={urlQuery} onChange={handleUrlChange} />

        <p id="sellMethodText"><b>SELL METHOD</b></p>

        <p id="addPostPriceLabel" className="addPostLabel"><b>Fixed Price:</b></p>
        <input type="number" min="0" id="addPostPrice" name="inputPrice" placeholder="enter fixed price here" value={fixedQuery} onChange={handleFixedChange} />
        <input type="radio" id="fPriceRad" className="addPostRad" name="sellMethod" value="fixed" data-testid="fixed-radio-btn" onChange={handleRadioChange} />

        {/* <p id="addPostAucEndLabel" className="addPostLabel"><b>Auction End:</b></p> */}
        <p id="addPostAucEndLabel" className="addPostLabel"><b>Auction</b></p>
        <input type="radio" id="aucRad" className="addPostRad" name="sellMethod" value="bid" onChange={handleRadioChange} />

        <p id="addPostCategoryLabel" className="addPostLabel"><b>Category:</b></p>
        <select id="addPostCategories" name="addPostCategory" data-testid="categories" value={dropdownQuery} onChange={handleDropdownChange}>
          <option value="none" selected disabled hidden>Select a category</option>
          <option value="bedroom">Bedroom</option>
          <option value="bathroom">Bathroom</option>
          <option value="kitchen">Kitchen</option>
          <option value="office">Office</option>
          <option value="electronics">Electronics</option>
          <option value="furniture">Furniture</option>
          <option value="decor">Decor</option>
          <option value="other">Other</option>
        </select>

        <p id="addPostTitleLabel" className="addPostLabel"><b>Title:</b></p>
        <input type="text" id="addPostTitle" name="inputTitle" placeholder="enter title here" maxLength="50" value={titleQuery} onChange={handleTitleChange} />

        <p id="addPostSBDLabel" className="addPostLabel"><b>Sell-by Date:</b></p>
        <input type="date" id="addPostSBD" name="inputSBD" placeholder="yyyy-mm-dd" value={dateQuery} onChange={handleDateChange} />

        <p id="addPostDescLabel" className="addPostLabel"><b>Description:</b></p>
        <textarea type="text" id="addPostDesc" name="inputDesc" rows="4" cols="50" maxLength="240" placeholder="enter description here" value={descriptionQuery} onChange={handleDescriptionChange} />

      </form>
      <button className="popupBtnAddPost" id="addPostBackBtn" type="button" onClick={backClick}><b>Back</b></button>
      <button className="popupBtnAddPost" id="addPostCCBtn" type="button" onClick={ccClick}><b>Confirm Changes</b></button>
    </div>
  );
}

AddPostPopUp.propTypes = {
  ownerId: PropTypes.string,
  ownerName: PropTypes.string,
  currPostsArr: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.number,
      sellerId: PropTypes.number,
      seller: PropTypes.string,
      title: PropTypes.string,
      description: PropTypes.string,
      image: PropTypes.string,
      priceType: PropTypes.string,
      price: PropTypes.number,
      postedOn: PropTypes.string,
      availableUntil: PropTypes.string,
      category: PropTypes.string,
    }),
  ),
  changePostsArr: PropTypes.func,
  changeView: PropTypes.func,
};

AddPostPopUp.defaultProps = {
  ownerId: '',
  ownerName: '',
  currPostsArr: [],
  changePostsArr: {},
  changeView: {},
};

/**
 * *******************************************************
 * This stateless component defines the "Edit Post" pop-up window,
 * activated from clicking the "Edit Post" button.
 *
 * (Could re-factor this with AddPostPopUp into one component,
 * with an input "add/edit mode" prop.)
 * *******************************************************
 */
function EditPostPopUp({
  postObj, currPostsArr, changePostsArr, changeView,
}) {
  const [urlQuery, setUrlQuery] = useState('');
  const [fixedQuery, setFixedQuery] = useState('');
  // const [endQuery, setEndQuery] = useState('');
  const [radioQuery, setRadioQuery] = useState('');
  const [dropdownQuery, setDropdownQuery] = useState('none');
  const [titleQuery, setTitleQuery] = useState('');
  const [dateQuery, setDateQuery] = useState('');
  const [descriptionQuery, setDescriptionQuery] = useState('');

  useEffect(() => {
    setUrlQuery(postObj.image);
    setFixedQuery(postObj.price);
    // setEndQuery(postObj.availableUntil);
    setRadioQuery(postObj.priceType);
    setDropdownQuery(postObj.category);
    setTitleQuery(postObj.title);
    setDateQuery(postObj.availableUntil);
    setDescriptionQuery(postObj.description);
  }, [postObj]);

  const handleUrlChange = (e) => {
    setUrlQuery(e.target.value);
  };

  const handleFixedChange = (e) => {
    setFixedQuery(e.target.value);
  };

  // const handleEndChange = (e) => {
  //   setEndQuery(e.target.value);
  // };

  const handleRadioChange = (e) => {
    setRadioQuery(e.target.value);
  };

  const handleDropdownChange = (e) => {
    setDropdownQuery(e.target.value);
  };

  const handleTitleChange = (e) => {
    setTitleQuery(e.target.value);
  };

  const handleDateChange = (e) => {
    setDateQuery(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescriptionQuery(e.target.value);
  };

  // Event-handler: "Back" button.
  const backClick = () => {
    setUrlQuery('');
    setFixedQuery('');
    // setEndQuery('');
    setRadioQuery('');
    setDropdownQuery('none');
    setTitleQuery('');
    setDateQuery('');
    setDescriptionQuery('');

    changeView(0);
  };

  /*
  Much of the HTML is that of the AddPostPopUp component and uses its CSS:
  the assumption is that both components will not be rendered simultaneously.
  */

  // Event-handler: "Confirm Changes" button.
  const ccClick = () => {
    // const formEl = document.getElementById('addPostForm');

    // if (!document.querySelector('input[name="sellMethod"]:checked')) {
    // if (radioQuery === '') {
    //   // alert('A sell method must be selected.');
    //   return;
    // }

    // const sellMethod = document.querySelector('input[name="sellMethod"]:checked').value;

    // const sellMethod = radioQuery;

    // First check that the fields have been filled in.
    // Alternative: could add more stringent input checks in addition to non-empty.

    // const validBool = formEl.inputTitle.value && formEl.inputDesc.value
    //   && formEl.inputLink.value && formEl.inputSBD.value
    //   && sellMethod && (formEl.inputPrice.value || sellMethod === 'bid');

    const validBool = (urlQuery !== '') && (descriptionQuery !== '')
      && (titleQuery !== '') && (dateQuery !== '')
      && (((radioQuery === 'fixed') && (fixedQuery !== '') && (Number(fixedQuery) > 0))
        || (radioQuery === 'bid'))
      && (dropdownQuery !== 'none');

    if (!validBool) {
      // alert('Fill out all of the fields before submitting.');
      return;
    }

    // changeView(0); // It's now safe to close the pop-up! (Could have done this later.)

    // if (radioQuery === 'fixed') {
    //   setEndQuery('');
    // } else {
    //   setFixedQuery('');
    // }

    // Now handle the price. (Which should be 0 if the post is a bid.)
    let initPrice = 0;
    if (radioQuery === 'fixed') {
      // Else, we keep initialize the price (a.k.a. the highest bid) as zero.
      // initPrice = Number(formEl.inputPrice.value);
      initPrice = Number(fixedQuery);
    }

    // Finally, create the updated post object. (Some of the fields stay static.)
    const updatedPost = {
      _id: postObj._id,
      sellerId: postObj.sellerId,
      seller: postObj.seller,
      // title: formEl.inputTitle.value,
      title: titleQuery,
      // description: formEl.inputDesc.value,
      description: descriptionQuery,
      // image: formEl.inputLink.value,
      image: urlQuery,
      // priceType: document.querySelector('input[name="sellMethod"]:checked').value,
      priceType: radioQuery,
      price: initPrice,
      postedOn: postObj.postedOn,
      // availableUntil: formEl.inputSBD.value,
      availableUntil: dateQuery,
      // category: formEl.addPostCategory.value,
      category: dropdownQuery,
    };

    // **************************************
    // *** Update the view (modify state) ***
    // **************************************
    // Pass a new array of posts objects (now including this most recent object)
    // through the mutator of the posts array state.

    // Helper function: find the position of our edited post in the posts array state.
    const findPostIndex = (inputPostId, postObjArray) => {
      let solutionId = 0;

      for (let i = 0; i < postObjArray.length; i += 1) {
        const ithPost = postObjArray[i];

        if (inputPostId === ithPost._id) {
          break;
        }

        solutionId += 1;
      }

      return solutionId;
    };

    const postIdx = findPostIndex(postObj._id, currPostsArr);

    // Now modify the posts array state, in-place.
    /* eslint-disable no-param-reassign */ // To avoid the inefficiency of duplicating the array.
    currPostsArr[postIdx] = updatedPost;
    /* eslint-enable no-param-reassign */
    changePostsArr(currPostsArr);

    // *************************************
    // *** Update the backend (API call) ***
    // *************************************
    const editInputPost = async (updatedPostObj) => {
      try {
        await editPost(updatedPostObj._id, updatedPostObj);
        // console.log('Post edited.');
      } catch (err) {
        // console.error('error', err.message);
      }
    };

    editInputPost(updatedPost);

    backClick(); // close the popup and set all states to default
  };

  // const fadeInEffect = () => {
  //   const outerDiv = document.getElementById('addPostDarken');
  //   outerDiv.style.opacity = '1';
  // };

  return (
    <div id="addPostBox">
      <img id="editPostPic" src={postObj.image} alt="Post Img" width="352" height="352" />
      <form id="addPostForm">
        <p id="addPostPicLabel" className="addPostLabel"><b>Photo URL:</b></p>
        <input type="text" id="addPostPicLink" name="inputLink" value={urlQuery} onChange={handleUrlChange} />

        <p id="sellMethodText"><b>SELL METHOD</b></p>

        <p id="addPostPriceLabel" className="addPostLabel"><b>Fixed Price:</b></p>
        <input type="number" min="0" id="addPostPrice" name="inputPrice" value={fixedQuery} onChange={handleFixedChange} />
        <input type="radio" id="fPriceRad" className="addPostRad" name="sellMethod" value="fixed" defaultChecked={(postObj.priceType === 'fixed')} onChange={handleRadioChange} />

        <p id="addPostAucEndLabel" className="addPostLabel"><b>Auction</b></p>
        <input type="radio" id="aucRad" className="addPostRad" name="sellMethod" value="bid" defaultChecked={(postObj.priceType === 'bid')} onChange={handleRadioChange} />

        <p id="addPostCategoryLabel" className="addPostLabel"><b>Category:</b></p>
        <select id="addPostCategories" name="addPostCategory" defaultValue={postObj.category} onChange={handleDropdownChange}>
          {/* <option value="none" selected disabled hidden> Category: </option> */}
          <option value="bedroom">Bedroom</option>
          <option value="bathroom">Bathroom</option>
          <option value="kitchen">Kitchen</option>
          <option value="office">Office</option>
          <option value="electronics">Electronics</option>
          <option value="furniture">Furniture</option>
          <option value="decor">Decor</option>
          <option value="other">Other</option>
        </select>

        <p id="addPostTitleLabel" className="addPostLabel"><b>Title:</b></p>
        <input type="text" id="addPostTitle" name="inputTitle" maxLength="50" value={titleQuery} onChange={handleTitleChange} />

        <p id="addPostSBDLabel" className="addPostLabel"><b>Sell-by Date:</b></p>
        <input type="date" id="addPostSBD" name="inputSBD" value={dateQuery} onChange={handleDateChange} />

        <p id="addPostDescLabel" className="addPostLabel"><b>Description:</b></p>
        <textarea type="text" id="addPostDesc" name="inputDesc" rows="4" cols="50" maxLength="240" value={descriptionQuery} onChange={handleDescriptionChange} />

      </form>
      <button className="popupBtnAddPost" id="addPostBackBtn" type="button" onClick={backClick}><b>Back</b></button>
      <button className="popupBtnAddPost" id="addPostCCBtn" type="button" onClick={ccClick}><b>Confirm Changes</b></button>
    </div>
  );
}

EditPostPopUp.propTypes = {
  postObj: PropTypes.shape({
    _id: PropTypes.string,
    sellerId: PropTypes.string,
    seller: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    image: PropTypes.string,
    priceType: PropTypes.string,
    price: PropTypes.number,
    postedOn: PropTypes.string,
    availableUntil: PropTypes.string,
    highestBidderId: PropTypes.number,
    category: PropTypes.string,
  }),
  currPostsArr: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      sellerId: PropTypes.string,
      seller: PropTypes.string,
      title: PropTypes.string,
      description: PropTypes.string,
      image: PropTypes.string,
      priceType: PropTypes.string,
      price: PropTypes.number,
      postedOn: PropTypes.string,
      availableUntil: PropTypes.string,
      category: PropTypes.string,
    }),
  ),
  changePostsArr: PropTypes.func,
  changeView: PropTypes.func,
};

EditPostPopUp.defaultProps = {
  postObj: {},
  currPostsArr: [],
  changePostsArr: {},
  changeView: {},
};

/**
 * *******************************************************
 * This stateless component defines the "Delete Post" pop-up window,
 * activated from clicking the "Delete Post" button.
 * *******************************************************
 */
function DeletePostPopUp({
  postObj, currPostsArr, changePostsArr, changeView,
}) {
  // Event-handler: "Back" button.
  const backClick = () => {
    changeView(0);
  };

  // Event-handler: "Confirm Delete" button.
  const cdClick = () => {
    changeView(0);

    // **************************************
    // *** Update the view (modify state) ***
    // **************************************
    // Pass a new array of posts objects (now excluding this deleted post)
    // through the mutator of the posts array state.

    // Helper function: find the position of our post in the posts array state.
    const findPostIndex = (inputPostId, postObjArray) => {
      let solutionId = 0;

      for (let i = 0; i < postObjArray.length; i += 1) {
        const ithPost = postObjArray[i];

        if (inputPostId === ithPost._id) {
          break;
        }

        solutionId += 1;
      }

      return solutionId;
    };

    const postIdx = findPostIndex(postObj._id, currPostsArr);
    // console.log('this is your post index', postIdx);

    // Now modify the posts array state, in-place.
    currPostsArr.splice(postIdx, 1);
    changePostsArr(currPostsArr);

    // *************************************
    // *** Update the backend (API call) ***
    // *************************************
    const deleteTargetPost = async (postId) => {
      try {
        await deletePost(postId);
        // console.log('Post deleted.');
      } catch (err) {
        // console.error('error', err.message);
      }
    };

    deleteTargetPost(postObj._id);
  };

  /*
  Some of the HTML emulates the AddReviewPopUp component and uses its CSS:
  the assumption is that both components will not be rendered simultaneously.
  */

  // const fadeInEffect = () => {
  //   const outerDiv = document.getElementById('addRevDarken');
  //   outerDiv.style.opacity = '1';
  // };

  return (
    <div id="addRevBox">
      <img id="delPostPic" src={postObj.image} alt="Post Pic" width="352" height="352" />
      <p id="delPostText">Are you sure you wish to delete this post?</p>
      <button className="popupBtnAddRev" id="revBackBtn" type="button" onClick={backClick}><b>Back</b></button>
      <button className="popupBtnAddRev" id="revCCBtn" type="button" onClick={cdClick}><b>Confirm Delete</b></button>
    </div>
  );
}

DeletePostPopUp.propTypes = {
  postObj: PropTypes.shape({
    _id: PropTypes.string,
    sellerId: PropTypes.string,
    seller: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    image: PropTypes.string,
    priceType: PropTypes.string,
    price: PropTypes.number,
    postedOn: PropTypes.string,
    availableUntil: PropTypes.string,
    highestBidderId: PropTypes.number,
    category: PropTypes.string,
  }),
  currPostsArr: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      sellerId: PropTypes.string,
      seller: PropTypes.string,
      title: PropTypes.string,
      description: PropTypes.string,
      image: PropTypes.string,
      priceType: PropTypes.string,
      price: PropTypes.number,
      postedOn: PropTypes.string,
      availableUntil: PropTypes.string,
      category: PropTypes.string,
    }),
  ),
  changePostsArr: PropTypes.func,
  changeView: PropTypes.func,
};

DeletePostPopUp.defaultProps = {
  postObj: {},
  currPostsArr: [],
  changePostsArr: {},
  changeView: {},
};

/**
 * *******************************************************
 * This stateful component is the parent of the Add/Edit/Delete-PostPopUp's:
 * it defines everything in the "posts" section of a Garage page.
 *
 * ownerPostArr is an array of post objects.
 * *******************************************************
 */
function GaragePostings({
  ownerBool, ownerId, ownerName, ownerPostArr,
}) {
  const [view, setView] = useState(0);
  const [postsArr, setPostsArr] = useState(ownerPostArr);

  // A reference to the post object we are currently editing/deleting. (If applicable.)
  const postOfInterest = useRef({});

  const manageView = (viewInput) => {
    if (viewInput === 1) {
      return (
        <AddPostPopUp
          ownerId={ownerId}
          ownerName={ownerName}
          currPostsArr={postsArr}
          changePostsArr={setPostsArr}
          changeView={setView}
        />
      );
    }

    if (viewInput === 2) {
      return (
        <EditPostPopUp
          postObj={postOfInterest.current}
          currPostsArr={postsArr}
          changePostsArr={setPostsArr}
          changeView={setView}
        />
      );
    }

    if (viewInput === 3) {
      return (
        <DeletePostPopUp
          ownerId={ownerId}
          ownerName={ownerName}
          postObj={postOfInterest.current}
          currPostsArr={postsArr}
          changePostsArr={setPostsArr}
          changeView={setView}
        />
      );
    }

    return (<div />);
  };

  // Event-handler: "Add Post" button.
  const addPostClick = () => {
    setView(1);
  };

  // Event-handler: "Edit Post" button.
  const editPostClick = (postObj) => {
    postOfInterest.current = postObj;
    setView(2);
  };

  // Event-handler: "Delete Post" button.
  const deletePostClick = (postObj) => {
    postOfInterest.current = postObj;
    setView(3);
  };

  function managePermissions(ownerBoolVal) {
    if (ownerBoolVal) {
      return (<button id="addPostBtn" type="button" onClick={addPostClick}><span><b>Add Post</b></span></button>);
    }
    return (<div />);
  }

  return (
    <div>
      <p id="postingsSortTitle">
        Recent Postings
      </p>
      {managePermissions(ownerBool)}
      <div id="postSection">
        <ItemPostingTable
          userId={ownerId}
          items={postsArr}
          editable={ownerBool}
          onClickEditPost={editPostClick}
          onClickDeletePost={deletePostClick}
        />
      </div>
      {manageView(view)}
    </div>
  );
}

GaragePostings.propTypes = {
  ownerBool: PropTypes.bool,
  ownerId: PropTypes.string,
  ownerName: PropTypes.string,
  ownerPostArr: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.number,
      sellerId: PropTypes.number,
      seller: PropTypes.string,
      title: PropTypes.string,
      description: PropTypes.string,
      image: PropTypes.string,
      priceType: PropTypes.string,
      price: PropTypes.number,
      postedOn: PropTypes.string,
      availableUntil: PropTypes.string,
      highestBidderId: PropTypes.number,
      category: PropTypes.string,
    }),
  ),
};

GaragePostings.defaultProps = {
  ownerBool: false,
  ownerId: '',
  ownerName: '',
  ownerPostArr: [],
};

export default GaragePostings;
