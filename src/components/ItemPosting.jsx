import React, { useEffect, useRef, useState } from 'react';
import './ItemPosting.css';
import { Link, useNavigate } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import Alert from 'react-bootstrap/Alert';
import Overlay from 'react-bootstrap/Overlay';
import Tooltip from 'react-bootstrap/Tooltip';
import createNewBookmark from '../api/bookmarks';
import { updateBid } from '../api/posts';

function ItemPosting(props) {
  let { item } = props;
  const {
    userId,
    editable,
    onClickEditPost,
    onClickDeletePost,
  } = props;

  item = item ?? {
    id: null,
    sellerId: null,
    seller: null,
    title: null,
    description: null,
    image: null,
    priceType: null,
    price: null,
    postedOn: null,
    availableUntil: null,
    highestBidderId: null,
  };

  const [itemObj, setItemObj] = useState({});

  const {
    id,
    sellerId,
    seller,
    title,
    description,
    image,
    priceType,
    price,
    postedOn,
    availableUntil,
    highestBidderId,
  } = itemObj;

  useEffect(() => {
    setItemObj(item);
  }, [item]);

  const navigate = useNavigate();

  // 0: no alert, 1: success alert, 2: already exists alert
  const [bookmarkAlertStatus, setBookmarkAlertStatus] = useState(0);
  const [showPostOptions, setShowPostOptions] = useState(false);
  const [showBidPopup, setShowBidPopup] = useState(false);
  const [newBid, setNewBid] = useState('');
  const [newBidErrMsg, setNewBidErrMsg] = useState('');
  const postOptionsTooltipRef = useRef(null);

  useEffect(() => {
    if (bookmarkAlertStatus !== 0) {
      window.setTimeout(() => {
        setBookmarkAlertStatus(0);
      }, 5000);
    }
  }, [bookmarkAlertStatus]);

  const showBookmarkAlert = () => {
    let returnComp;

    if (bookmarkAlertStatus === 1) {
      returnComp = (
        <Alert className="item-posting-bookmark-alert" variant="success">
          <Alert.Heading>Successfully added bookmark</Alert.Heading>
        </Alert>
      );
    } else if (bookmarkAlertStatus === 2) {
      returnComp = (
        <Alert className="item-posting-bookmark-alert" variant="warning">
          <Alert.Heading>Item already bookmarked</Alert.Heading>
        </Alert>
      );
    } else {
      returnComp = '';
    }

    return returnComp;
  };

  const handleCloseBidPopup = () => {
    setShowBidPopup(false);
    setNewBid('');
    setNewBidErrMsg('');
  };

  const handleChangeNewBid = (e) => {
    const number = Number(e.target.value);

    if (Number.isInteger(number)) {
      setNewBid(number.toString());
    }
  };

  const handleSubmitNewBid = async (e) => {
    e.preventDefault();

    const number = Number(newBid);

    if (Number.isInteger(number)) {
      if (number > 0) {
        if (number > price) {
          const response = await updateBid(id, number, userId);

          if (response.status === 200) {
            setItemObj({ ...itemObj, price: number, highestBidderId: userId });
            handleCloseBidPopup();
          }
        } else {
          setNewBidErrMsg('YOUR BID IS NOT GREATER THAN THE CURRENT BID');
        }
      } else {
        setNewBidErrMsg('INVALID BID');
      }
    } else {
      setNewBidErrMsg('INVALID BID');
    }
  };

  const bidPopupComp = () => {
    let returnComp;

    if (showBidPopup) {
      returnComp = (
        <div className="item-posting-bid-popup">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.5rem"
            height="1.5rem"
            fill="currentColor"
            className="bi bi-x-lg"
            viewBox="0 0 16 16"
            onClick={() => handleCloseBidPopup()}
          >
            <title>Close Bid Popup Button</title>
            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
          </svg>
          <div>
            <div className="row">
              <div className="col-12 item-posting-bid-popup-current-bid">
                {`Current Bid: $${price}`}
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <form className="new-bid-form" onSubmit={handleSubmitNewBid}>
                  <div> Enter Your Bid: </div>
                  <input type="text" name="new-bid" placeholder="Enter Bid" value={newBid} onChange={handleChangeNewBid} />
                  <button type="submit">
                    Submit Bid
                  </button>
                </form>
                <div className="item-posting-bid-popup-err-msg">
                  {newBidErrMsg !== ''
                    ? newBidErrMsg
                    : ''}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      returnComp = '';
    }

    return returnComp;
  };

  const onClickBookmark = async () => {
    const response = await createNewBookmark(userId, id);

    if (response.status === 201) {
      setBookmarkAlertStatus(1);
    } else if (response.status === 409) {
      setBookmarkAlertStatus(2);
    }
  };

  const showSeller = () => {
    let returnComp;

    if (!sellerId) {
      returnComp = (
        <div>
          {seller}
        </div>
      );
    } else if (userId !== sellerId) {
      returnComp = (
        <Link to={`/garage/${sellerId}`}>
          {seller}
        </Link>
      );
    } else {
      returnComp = (
        <Link to="/garage">
          {seller}
        </Link>
      );
    }

    return returnComp;
  };

  return (
    <div className="item-posting">
      {showBookmarkAlert()}
      {bidPopupComp()}
      <div className="row">
        <div className="item-posting-image col-12">
          <img src={image} alt="item-posting" />
        </div>
      </div>
      <div className="row">
        <div className="item-posting-title col-8">
          <h5>
            {title}
          </h5>
        </div>
        <div className="item-posting-price col-4">
          <div>
            $
            {price}
          </div>
        </div>
      </div>
      <div className="row">
        <div className="item-posting-seller col-12">
          <div>
            Seller:&nbsp;
          </div>
          {showSeller()}
        </div>
      </div>
      <div className="row">
        <div className="item-posting-posted-date col-12">
          <div>
            Posted:&nbsp;
          </div>
          <div>
            {postedOn}
          </div>
        </div>
      </div>
      <div className="row">
        <div className="item-posting-available-until-date col-12">
          <div>
            Available&nbsp;Until:&nbsp;
          </div>
          <div>
            {availableUntil}
          </div>
        </div>
      </div>
      <div className="row">
        <div className="item-posting-description col-12">
          {priceType === 'bid' ? '(item is up for auction)' : ''}
          <p>
            {description}
          </p>
        </div>
      </div>
      <div className="row">
        <div className="item-posting-icons col-12">
          <div>
            {userId && id && userId !== sellerId
              ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.5rem"
                  height="1.5rem"
                  fill="currentColor"
                  className="bi bi-bookmark"
                  viewBox="0 0 16 16"
                  onClick={() => onClickBookmark()}
                >
                  <title>Bookmark Item Button</title>
                  <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z" />
                </svg>
              ) : ''}
            {userId && sellerId && userId !== sellerId
              ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.5rem"
                  height="1.5rem"
                  fill="currentColor"
                  className="bi bi-chat"
                  viewBox="0 0 16 16"
                  onClick={() => navigate(`/messages/${sellerId}`)}
                >
                  <title>Message Seller Button</title>
                  <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z" />
                </svg>
              ) : ''}
            {userId && userId === sellerId && editable && priceType === 'bid' && highestBidderId
              ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.5rem"
                  height="1.5rem"
                  fill="currentColor"
                  className="bi bi-chat"
                  viewBox="0 0 16 16"
                  onClick={() => navigate(`/messages/${highestBidderId}`)}
                >
                  <title>Message Highest Bidder Button</title>
                  <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z" />
                </svg>
              ) : ''}
            {userId && id && userId !== sellerId && priceType === 'bid' ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1.5rem"
                height="1.5rem"
                fill="currentColor"
                className="bi bi-arrow-up"
                viewBox="0 0 16 16"
                onClick={() => setShowBidPopup(true)}
              >
                <title>Bid Item Button</title>
                <path fillRule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z" />
              </svg>
            ) : ''}
          </div>
          <div>
            {userId && userId === sellerId && editable
              ? (
                <>
                  <svg
                    ref={postOptionsTooltipRef}
                    onClick={() => setShowPostOptions(!showPostOptions)}
                    xmlns="http://www.w3.org/2000/svg"
                    width="1.5rem"
                    height="1.5rem"
                    fill="currentColor"
                    className="bi bi-three-dots-vertical"
                    viewBox="0 0 16 16"
                  >
                    <title>Item Options Button</title>
                    <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                  </svg>
                  <Overlay target={postOptionsTooltipRef.current} show={showPostOptions} placement="left">
                    <Tooltip className="item-posting-edit-tooltip">
                      <div
                        role="button"
                        onClick={() => {
                          setShowPostOptions(false);
                          onClickEditPost(item);
                        }}
                        onKeyDown={() => {
                          setShowPostOptions(false);
                          onClickEditPost(item);
                        }}
                        tabIndex={0}
                      >
                        Edit Post
                      </div>
                      <hr />
                      <div
                        role="button"
                        onClick={() => {
                          setShowPostOptions(false);
                          onClickDeletePost(item);
                        }}
                        onKeyDown={() => {
                          setShowPostOptions(false);
                          onClickDeletePost(item);
                        }}
                        tabIndex={0}
                      >
                        Delete Post
                      </div>
                    </Tooltip>
                  </Overlay>
                </>
              ) : ''}
          </div>

        </div>
      </div>
    </div>
  );
}

export default ItemPosting;

ItemPosting.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number,
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
  }).isRequired,
  userId: PropTypes.number.isRequired,
  editable: PropTypes.bool,
  onClickEditPost: PropTypes.func,
  onClickDeletePost: PropTypes.func,
};

ItemPosting.defaultProps = {
  editable: false,
  onClickEditPost: () => { },
  onClickDeletePost: () => { },
};
