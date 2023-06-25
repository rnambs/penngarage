import React from 'react';
import './CategorySearch.css';
import PropTypes from 'prop-types';

function CategorySearchBox(props) {
  const {
    imgSrc,
    title,
    category,
    setFilters,
    setSubmittedQuery,
  } = props;

  const handleClick = () => {
    setSubmittedQuery('.*');
    setFilters({
      sortBy: 'urgent',
      priceRangeLow: 0,
      priceRangeHigh: 99999,
      category,
    });
  };

  return (
    <div className="col-lg-3 col-md-4 col-sm-6 col-12">
      <div role="button" tabIndex={0} onKeyDown={handleClick} onClick={handleClick} className="category-search-box">
        <div className="category-search-image">
          <img src={imgSrc} alt="item-posting" />
        </div>
        <h5>{title}</h5>
      </div>
    </div>
  );
}

CategorySearchBox.propTypes = {
  imgSrc: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  setFilters: PropTypes.func.isRequired,
  setSubmittedQuery: PropTypes.func.isRequired,
};

function CategorySearch(props) {
  const {
    setFilters,
    setSubmittedQuery,
  } = props;

  return (
    <div id="category-search" className="row">
      <div className="col-12">
        <div className="row">
          <CategorySearchBox
            setFilters={setFilters}
            setSubmittedQuery={setSubmittedQuery}
            imgSrc="https://www.decorilla.com/online-decorating/wp-content/uploads/2022/07/Organic-modern-bedroom-House-and-Hold.jpg"
            title="Bedroom"
            category="bedroom"
          />
          <CategorySearchBox
            setFilters={setFilters}
            setSubmittedQuery={setSubmittedQuery}
            imgSrc="https://fbcremodel.com/wp-content/uploads/2022/09/3257-Wood-Duck-Dr-NW-Prior-Lake-MN-55372-4-scaled.jpg"
            title="Bathroom"
            category="bathroom"
          />
          <CategorySearchBox
            setFilters={setFilters}
            setSubmittedQuery={setSubmittedQuery}
            imgSrc="https://hips.hearstapps.com/hmg-prod/images/kips-bay-dallas-2021-kitchen-studio6f-1632327008.jpg"
            title="Kitchen"
            category="kitchen"
          />
          <CategorySearchBox
            setFilters={setFilters}
            setSubmittedQuery={setSubmittedQuery}
            imgSrc="https://media.architecturaldigest.com/photos/56b524de4ac3d842677b9ac0/master/w_2323,h_1548,c_limit/home-office-01.jpg"
            title="Office"
            category="office"
          />
          <CategorySearchBox
            setFilters={setFilters}
            setSubmittedQuery={setSubmittedQuery}
            imgSrc="https://blog.playstation.com/tachyon/2022/03/af8d7dc5880d606f6a92ae4b089d598b34a41ec5.jpg"
            title="Electronics"
            category="electronics"
          />
          <CategorySearchBox
            setFilters={setFilters}
            setSubmittedQuery={setSubmittedQuery}
            imgSrc="https://m.media-amazon.com/images/W/IMAGERENDERING_521856-T1/images/I/612ve5I8tfL._AC_UF894,1000_QL80_.jpg"
            title="Furniture"
            category="furniture"
          />
          <CategorySearchBox
            setFilters={setFilters}
            setSubmittedQuery={setSubmittedQuery}
            imgSrc="https://i.pinimg.com/550x/cc/52/f5/cc52f548a55d46ad2ddb8ddc3d488019.jpg"
            title="Decor"
            category="decor"
          />
          <CategorySearchBox
            setFilters={setFilters}
            setSubmittedQuery={setSubmittedQuery}
            imgSrc="https://images.unsplash.com/photo-1504609773096-104ff2c73ba4"
            title="Other"
            category="other"
          />
        </div>
      </div>
    </div>
  );
}

export default CategorySearch;

CategorySearch.propTypes = {
  setFilters: PropTypes.func.isRequired,
  setSubmittedQuery: PropTypes.func.isRequired,
};
