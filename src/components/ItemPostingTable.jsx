import React from 'react';
import PropTypes from 'prop-types';
import ItemPosting from './ItemPosting';
import './ItemPostingTable.css';

/* eslint-disable no-underscore-dangle */

function ItemPostingTable(props) {
  const {
    userId,
    items,
    editable,
    onClickEditPost,
    onClickDeletePost,
  } = props;

  const itemsComp = () => {
    let i = 0;

    return items.map((item) => {
      i += 1;

      return (
        <div key={i} className="col-lg-4 col-12">
          <ItemPosting
            userId={userId}
            item={{ ...item, id: item._id }}
            editable={editable}
            onClickEditPost={onClickEditPost}
            onClickDeletePost={onClickDeletePost}
          />
        </div>
      );
    });
  };

  return (
    <div className="item-posting-table row">
      {itemsComp()}
    </div>
  );
}

export default ItemPostingTable;

ItemPostingTable.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
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
  })).isRequired,
  userId: PropTypes.number.isRequired,
  editable: PropTypes.bool,
  onClickEditPost: PropTypes.func,
  onClickDeletePost: PropTypes.func,
};

ItemPostingTable.defaultProps = {
  editable: false,
  onClickEditPost: () => { },
  onClickDeletePost: () => { },
};
