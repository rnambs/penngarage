const { getDB } = require('../DbOperations');

const getSearchPosts = async (
  searchQuery,
  page,
  limit,
  sortBy,
  priceRangeLow,
  priceRangeHigh,
  category,
) => {
  try {
    let sortField = 'availableUntil';
    let sortDirection = 1;

    if (sortBy === 'recent') {
      sortField = 'postedOn';
      sortDirection = -1;
    } else if (sortBy === 'price_asc') {
      sortField = 'price';
      sortDirection = 1;
    } else if (sortBy === 'price_desc') {
      sortField = 'price';
      sortDirection = -1;
    }

    const db = await getDB();

    // const result = await db.collection('posts').find({
    //   title: new RegExp(`.*${searchQuery}.*`, 'i'),
    //   category: new RegExp(`${category}`),
    //   price: { $lte: priceRangeHigh, $gte: priceRangeLow },
    // })
    //   .sort({ [sortField]: sortDirection, _id: 1 })
    //   .skip((page - 1) * limit)
    //   .limit(limit)
    //   .toArray();

    const result = await db.collection('posts').aggregate([
      {
        $match: {
          title: new RegExp(`.*${searchQuery}.*`, 'i'),
          category: new RegExp(`${category}`),
          price: { $lte: priceRangeHigh, $gte: priceRangeLow },
        },
      },
      {
        $facet: {
          results: [
            { $sort: { [sortField]: sortDirection, _id: 1 } },
            { $skip: (page - 1) * limit },
            { $limit: limit }],
          totalCount: [{
            $count: 'count',
          }],
        },
      },
    ]).toArray();
    // console.log(`Posts: ${JSON.stringify(result)}`);
    return result;
  } catch (err) {
    // console.log(`error: ${err.message}`);
    return err;
  }
};

module.exports = {
  getSearchPosts,
};
