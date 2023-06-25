import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import searchItem from '../api/search';
import ItemPostingTable from '../components/ItemPostingTable';
import { SEARCH_PAGE_ITEMS_PER_PAGE } from '../utils/utils';
import './SearchPage.css';
import CategoryFilter from '../components/CategoryFilter';
import CategorySearch from '../components/CategorySearch';

function SearchPage(props) {
  const { userId } = props;

  const defaultFilters = {
    sortBy: 'urgent',
    priceRangeLow: 0,
    priceRangeHigh: 99999,
    category: 'all',
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [page, setPage] = useState(1);
  const [numResults, setNumResults] = useState(0);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [filters, setFilters] = useState(defaultFilters);

  const {
    sortBy,
    priceRangeLow,
    priceRangeHigh,
    category,
  } = filters;

  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (searchQuery !== '') {
      const response = await searchItem(
        searchQuery,
        1,
        SEARCH_PAGE_ITEMS_PER_PAGE,
      );

      if (response.status === 200 || response.status === 404) {
        setFilters(defaultFilters);
        setPage(1);
        setNumResults(parseInt(response.headers['x-total-count'], 10));
        setSubmittedQuery(searchQuery);
        setSearchResults(response.data);
      }
    }
  };

  const handleApplyFilters = async () => {
    const response = await searchItem(
      submittedQuery,
      1,
      SEARCH_PAGE_ITEMS_PER_PAGE,
      sortBy,
      priceRangeLow,
      priceRangeHigh,
      category,
    );

    if (response.status === 200 || response.status === 404) {
      setPage(1);
      setNumResults(parseInt(response.headers['x-total-count'], 10));
      setSearchResults(response.data);
    }
  };

  useEffect(() => {
    if (submittedQuery !== '') {
      handleApplyFilters();
    }
  }, [filters]);

  const handleNextPage = async () => {
    const newPage = page + 1;
    const response = await searchItem(
      submittedQuery,
      newPage,
      SEARCH_PAGE_ITEMS_PER_PAGE,
      sortBy,
      priceRangeLow,
      priceRangeHigh,
      category,
    );

    if (response.status === 200 || response.status === 404) {
      setPage(newPage);
      setNumResults(parseInt(response.headers['x-total-count'], 10));
      setSearchResults(response.data);
    }
  };

  const handlePrevPage = async () => {
    const newPage = page - 1;
    const response = await searchItem(
      submittedQuery,
      newPage,
      SEARCH_PAGE_ITEMS_PER_PAGE,
      sortBy,
      priceRangeLow,
      priceRangeHigh,
      category,
    );

    if (response.status === 200 || response.status === 404) {
      setPage(newPage);
      setNumResults(parseInt(response.headers['x-total-count'], 10));
      setSearchResults(response.data);
    }
  };

  const resultsIndexLower = () => (page - 1) * SEARCH_PAGE_ITEMS_PER_PAGE + 1;

  const resultsIndexUpper = () => (page - 1) * SEARCH_PAGE_ITEMS_PER_PAGE + searchResults.length;

  const showingResults = () => {
    let returnComp;

    if (numResults === 0) {
      returnComp = `No results for "${submittedQuery}"`;
    } else if (numResults === 1) {
      returnComp = `Showing 1 result for "${submittedQuery}"`;
    } else {
      returnComp = `Showing items ${resultsIndexLower()}-${resultsIndexUpper()} of ${numResults} results for "${submittedQuery}"`;
    }

    return returnComp;
  };

  return (
    <div id="search-page" className="container-lg">
      <div id="search-bar" className="row">
        <div className="col-12">
          <form id="search-bar-form" onSubmit={handleSubmit}>
            <input type="text" name="search-query" placeholder="Search" value={searchQuery} onChange={handleChange} />
            <svg onClick={handleSubmit} xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
              <title>Search Button</title>
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
            </svg>
          </form>
        </div>
      </div>
      {submittedQuery !== '' ? (
        <div id="showing-results" className="row">
          <div className="col-9">
            {showingResults()}
          </div>
          <div className="col-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1.5rem"
              height="1.5rem"
              fill="currentColor"
              className="bi bi-filter-square"
              viewBox="0 0 16 16"
              onClick={() => setShowCategoryFilter(true)}
            >
              <title>Filter Button</title>
              <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
              <path d="M6 11.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z" />
            </svg>
          </div>
        </div>
      ) : (
        <CategorySearch
          setFilters={setFilters}
          setSubmittedQuery={setSubmittedQuery}
        />
      )}
      <CategoryFilter
        show={showCategoryFilter}
        handleClose={() => setShowCategoryFilter(false)}
        filters={filters}
        setFilters={setFilters}
      />
      <ItemPostingTable userId={userId} items={searchResults} />
      {numResults > SEARCH_PAGE_ITEMS_PER_PAGE
        ? (
          <div id="search-page-arrows" className="row">
            <div className="col-12">
              {page !== 1
                ? (
                  <svg onClick={handlePrevPage} xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" fill="currentColor" className="bi bi-caret-left-fill" viewBox="0 0 16 16">
                    <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z" />
                  </svg>
                ) : <div className="search-page-arrows-block" />}
              <div id="page-number">
                {page}
              </div>
              {page < Math.ceil(numResults / SEARCH_PAGE_ITEMS_PER_PAGE)
                ? (
                  <svg onClick={handleNextPage} xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" fill="currentColor" className="bi bi-caret-right-fill" viewBox="0 0 16 16">
                    <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
                  </svg>
                ) : <div className="search-page-arrows-block" />}
            </div>
          </div>
        ) : ''}
    </div>
  );
}

export default SearchPage;

SearchPage.propTypes = {
  userId: PropTypes.string.isRequired,
};
