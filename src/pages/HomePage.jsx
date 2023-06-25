import { React, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { displayRecent, displayUrgent } from '../api/home';
import './HomePage.css';
import './MyProfilePage.css';
import ItemPostingTable from '../components/ItemPostingTable';
import { HOME_ITEM_PER_PAGE } from '../utils/utils';

function HomePage(props) {
  const { userId } = props;
  const [recentResults, setRecentResults] = useState([]);
  const [urgentResults, setUrgentResults] = useState([]);
  const [pageRecent, setPageRecent] = useState(1);
  const [pageUrgent, setPageUrgent] = useState(1);
  const [numRecentResults, setNumRecentResults] = useState(0);
  const [numUrgentResults, setNumUrgentResults] = useState(0);

  useEffect(() => {
    const callDisplayRecent = async () => {
      const responseRecent = await displayRecent(pageRecent);
      if (responseRecent.status === 200 || responseRecent.status === 404) {
        setPageRecent(1);
        setNumRecentResults(parseInt(responseRecent.headers['x-total-count'], 10));
        setRecentResults(responseRecent.data);
      }
    };

    const callDisplayUrgent = async () => {
      const responseUrgent = await displayUrgent(pageUrgent);
      if (responseUrgent.status === 200 || responseUrgent.status === 404) {
        setPageUrgent(1);
        setNumUrgentResults(parseInt(responseUrgent.headers['x-total-count'], 10));
        setUrgentResults(responseUrgent.data);
      }
    };

    callDisplayRecent();
    callDisplayUrgent();
  }, []);

  const handleRecentNextPage = async () => {
    const newPage = pageRecent + 1;
    const response = await displayRecent(newPage);
    if (response.status === 200 || response.status === 404) {
      setPageRecent(newPage);
      setNumRecentResults(parseInt(response.headers['x-total-count'], 10));
      setRecentResults(response.data);
    }
  };

  const handleRecentPrevPage = async () => {
    const newPage = pageRecent - 1;
    const response = await displayRecent(newPage);

    if (response.status === 200 || response.status === 404) {
      setPageRecent(newPage);
      setNumRecentResults(parseInt(response.headers['x-total-count'], 10));
      setRecentResults(response.data);
    }
  };

  const handleUrgentNextPage = async () => {
    const newPage = pageUrgent + 1;
    const response = await displayUrgent(newPage);

    if (response.status === 200 || response.status === 404) {
      setPageUrgent(newPage);
      setNumUrgentResults(parseInt(response.headers['x-total-count'], 10));
      setUrgentResults(response.data);
    }
  };
  const handleUrgentPrevPage = async () => {
    const newPage = pageUrgent - 1;
    const response = await displayUrgent(newPage);

    if (response.status === 200 || response.status === 404) {
      setPageUrgent(newPage);
      setNumUrgentResults(parseInt(response.headers['x-total-count'], 10));
      setUrgentResults(response.data);
    }
  };

  return (
    <div id="home-page" className="container-lg">
      <div id="new-content-box" className="row">
        <h2 id="new-items-text" className="row">New Items</h2>
        <div className="col-12">
          <ItemPostingTable
            id="recent-post"
            items={recentResults}
            userId={userId}
          />
          {numRecentResults > HOME_ITEM_PER_PAGE
            ? (
              <div id="home-page-arrows-recent" className="row">
                <div className="col-12">
                  {pageRecent !== 1
                    ? (
                      <svg onClick={handleRecentPrevPage} xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" fill="currentColor" className="bi bi-caret-left-fill" viewBox="0 0 16 16">
                        <title>prevRecent</title>
                        <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z" />
                      </svg>
                    ) : <div className="home-page-arrows-block" />}
                  {pageRecent}
                  {pageRecent < Math.ceil(numRecentResults / HOME_ITEM_PER_PAGE)
                    ? (
                      <svg onClick={handleRecentNextPage} xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" fill="currentColor" className="bi bi-caret-right-fill" viewBox="0 0 16 16">
                        <title>nextRecent</title>
                        <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
                      </svg>
                    ) : <div className="home-page-arrows-block" />}
                </div>
              </div>
            ) : ''}
        </div>
      </div>
      <div id="urgent-content-box" className="row">
        <h2 id="new-items-text" className="row">Urgent Items</h2>
        <div className="col-12">
          <ItemPostingTable
            id="urgent-post"
            items={urgentResults}
            userId={userId}
          />
          {numUrgentResults > HOME_ITEM_PER_PAGE
            ? (
              <div id="home-page-arrows-urgent" className="row">
                <div className="col-12">
                  {pageUrgent !== 1
                    ? (
                      <svg onClick={handleUrgentPrevPage} xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" fill="currentColor" className="bi bi-caret-left-fill" viewBox="0 0 16 16">
                        <title>prevUrgent</title>
                        <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z" />
                      </svg>
                    ) : <div className="home-page-arrows-block" />}
                  {pageUrgent}
                  {pageUrgent < Math.ceil(numUrgentResults / HOME_ITEM_PER_PAGE)
                    ? (
                      <svg onClick={handleUrgentNextPage} xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" fill="currentColor" className="bi bi-caret-right-fill" viewBox="0 0 16 16">
                        <title>nextUrgent</title>
                        <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
                      </svg>
                    ) : <div className="home-page-arrows-block" />}
                </div>
              </div>
            ) : ''}
        </div>
      </div>
    </div>
  );
}

export default HomePage;

HomePage.propTypes = {
  userId: PropTypes.string.isRequired,
};
