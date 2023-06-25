import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { NAVBAR_HEIGHT } from '../utils/utils';
import './CategoryFilter.css';

function CategoryFilter(props) {
  const {
    show,
    handleClose,
    filters,
    setFilters,
  } = props;

  const [filtersState, setFiltersState] = useState({});

  useEffect(() => {
    setFiltersState(filters);
  }, [filters, show]);

  const handleChangeSortBy = (e) => {
    setFiltersState({ ...filtersState, sortBy: e.target.value });
  };

  const priceRangeValueToObj = (value) => {
    switch (value) {
      case 'all':
        return {
          priceRangeLow: 0,
          priceRangeHigh: 99999,
        };
      case '0-25':
        return {
          priceRangeLow: 0,
          priceRangeHigh: 25,
        };
      case '25-50':
        return {
          priceRangeLow: 25,
          priceRangeHigh: 50,
        };
      case '50-100':
        return {
          priceRangeLow: 50,
          priceRangeHigh: 100,
        };
      case '100-200':
        return {
          priceRangeLow: 100,
          priceRangeHigh: 200,
        };
      case '200+':
        return {
          priceRangeLow: 200,
          priceRangeHigh: 99999,
        };
      default:
        return {};
    }
  };

  const handleChangePrice = (e) => {
    setFiltersState({ ...filtersState, ...priceRangeValueToObj(e.target.value) });
  };

  const handleChangeCategory = (e) => {
    setFiltersState({ ...filtersState, category: e.target.value });
  };

  const handleSubmit = () => {
    setFilters(filtersState);
    handleClose();
  };

  const handleReset = () => {
    setFiltersState({
      sortBy: 'urgent',
      priceRangeLow: 0,
      priceRangeHigh: 99999,
      category: 'all',
    });
  };

  const modalCustomStyle = {
    maxHeight: `calc(100vh - ${NAVBAR_HEIGHT})`,
    top: `${NAVBAR_HEIGHT}`,
  };

  return (
    <Modal
      show={show}
      onHide={() => handleClose(false)}
      centered
      backdrop="static"
      size="xl"
      style={modalCustomStyle}
    >
      <Modal.Header closeButton>
        <Modal.Title>Apply Filters</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <div className="row category-filter">
            <div className="col-lg-3 col-12 sort-by-radio-btns">
              <h5>
                Sort By
              </h5>
              <div className="sort-by-radio-btn">
                <input
                  type="radio"
                  value="urgent"
                  checked={filtersState.sortBy === 'urgent'}
                  onChange={handleChangeSortBy}
                />
                <span>Highest Urgency</span>
              </div>
              <div className="sort-by-radio-btn">
                <input
                  type="radio"
                  value="recent"
                  checked={filtersState.sortBy === 'recent'}
                  onChange={handleChangeSortBy}
                  data-testid="recent-radio-btn"
                />
                <span>Recent Items</span>
              </div>
              <div className="sort-by-radio-btn">
                <input
                  type="radio"
                  value="price_asc"
                  checked={filtersState.sortBy === 'price_asc'}
                  onChange={handleChangeSortBy}
                />
                <span>Price: Low to High</span>
              </div>
              <div className="sort-by-radio-btn">
                <input
                  type="radio"
                  value="price_desc"
                  checked={filtersState.sortBy === 'price_desc'}
                  onChange={handleChangeSortBy}
                />
                <span>Price: High to Low</span>
              </div>
            </div>
            <div className="col-lg-3 col-12 price-radio-btns">
              <h5>
                Price
              </h5>
              <div className="price-radio-btn">
                <input
                  type="radio"
                  value="all"
                  checked={filtersState.priceRangeLow === 0
                    && filtersState.priceRangeHigh === 99999}
                  onChange={handleChangePrice}
                />
                <span>All Prices</span>
              </div>
              <div className="price-radio-btn">
                <input
                  type="radio"
                  value="0-25"
                  checked={filtersState.priceRangeLow === 0
                    && filtersState.priceRangeHigh === 25}
                  onChange={handleChangePrice}
                  data-testid="0-25-radio-btn"
                />
                <span>Under $25</span>
              </div>
              <div className="price-radio-btn">
                <input
                  type="radio"
                  value="25-50"
                  checked={filtersState.priceRangeLow === 25
                    && filtersState.priceRangeHigh === 50}
                  onChange={handleChangePrice}
                  data-testid="25-50-radio-btn"
                />
                <span>$25 to $50</span>
              </div>
              <div className="price-radio-btn">
                <input
                  type="radio"
                  value="50-100"
                  checked={filtersState.priceRangeLow === 50
                    && filtersState.priceRangeHigh === 100}
                  onChange={handleChangePrice}
                  data-testid="50-100-radio-btn"
                />
                <span>$50 to $100</span>
              </div>
              <div className="price-radio-btn">
                <input
                  type="radio"
                  value="100-200"
                  checked={filtersState.priceRangeLow === 100
                    && filtersState.priceRangeHigh === 200}
                  onChange={handleChangePrice}
                  data-testid="100-200-radio-btn"
                />
                <span>$100 to $200</span>
              </div>
              <div className="price-radio-btn">
                <input
                  type="radio"
                  value="200+"
                  checked={filtersState.priceRangeLow === 200
                    && filtersState.priceRangeHigh === 99999}
                  onChange={handleChangePrice}
                  data-testid="200+-radio-btn"
                />
                <span>$200 and Above</span>
              </div>
            </div>
            <div className="col-lg-6 col-12 category-radio-btns">
              <h5>
                Category
              </h5>
              <div className="row">
                <div className="col-lg-6 col-12">
                  <div className="category-radio-btn">
                    <input
                      type="radio"
                      value="all"
                      checked={filtersState.category === 'all'}
                      onChange={handleChangeCategory}
                    />
                    <span>All</span>
                  </div>
                  <div className="category-radio-btn">
                    <input
                      type="radio"
                      value="bedroom"
                      checked={filtersState.category === 'bedroom'}
                      onChange={handleChangeCategory}
                      data-testid="bedroom-radio-btn"
                    />
                    <span>Bedroom</span>
                  </div>
                  <div className="category-radio-btn">
                    <input
                      type="radio"
                      value="bathroom"
                      checked={filtersState.category === 'bathroom'}
                      onChange={handleChangeCategory}
                    />
                    <span>Bathroom</span>
                  </div>
                  <div className="category-radio-btn">
                    <input
                      type="radio"
                      value="kitchen"
                      checked={filtersState.category === 'kitchen'}
                      onChange={handleChangeCategory}
                    />
                    <span>Kitchen</span>
                  </div>
                  <div className="category-radio-btn">
                    <input
                      type="radio"
                      value="office"
                      checked={filtersState.category === 'office'}
                      onChange={handleChangeCategory}
                    />
                    <span>Office</span>
                  </div>
                </div>
                <div className="col-lg-6 col-12">
                  <div className="category-radio-btn">
                    <input
                      type="radio"
                      value="electronics"
                      checked={filtersState.category === 'electronics'}
                      onChange={handleChangeCategory}
                    />
                    <span>Electronics</span>
                  </div>
                  <div className="category-radio-btn">
                    <input
                      type="radio"
                      value="furniture"
                      checked={filtersState.category === 'furniture'}
                      onChange={handleChangeCategory}
                    />
                    <span>Furniture</span>
                  </div>
                  <div className="category-radio-btn">
                    <input
                      type="radio"
                      value="decor"
                      checked={filtersState.category === 'decor'}
                      onChange={handleChangeCategory}
                    />
                    <span>Decor</span>
                  </div>
                  <div className="category-radio-btn">
                    <input
                      type="radio"
                      value="other"
                      checked={filtersState.category === 'other'}
                      onChange={handleChangeCategory}
                    />
                    <span>Other</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleReset}>
          Reset Filters
        </Button>
        <Button variant="dark" onClick={handleSubmit}>
          Apply Filters
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CategoryFilter;

CategoryFilter.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  filters: PropTypes.shape({
    sortBy: PropTypes.string.isRequired,
    priceRangeLow: PropTypes.number.isRequired,
    priceRangeHigh: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
  }).isRequired,
  setFilters: PropTypes.isRequired,
};
