const { getSearchPosts } = require('../db-operations/searchDB');

const handleSearchPosts = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 15,
      priceRangeLow = 0,
      priceRangeHigh = 99999,
      category = 'all',
    } = req.query;

    const {
      searchQuery,
      sortBy = 'urgent',
    } = req.query;

    page = Number.parseInt(page, 10);
    limit = Number.parseInt(limit, 10);
    priceRangeLow = Number.parseInt(priceRangeLow, 10);
    priceRangeHigh = Number.parseInt(priceRangeHigh, 10);

    if (category === 'all') {
      category = '.*';
    }

    if (
      (!searchQuery)
      || (Number.isNaN(page) || page < 1)
      || (Number.isNaN(limit) || limit < 0)
      || !(sortBy === 'urgent' || sortBy === 'recent' || sortBy === 'price_asc' || sortBy === 'price_desc')
      || (Number.isNaN(priceRangeLow) || priceRangeLow < 0)
      || (Number.isNaN(priceRangeHigh) || priceRangeHigh < 0 || priceRangeLow > priceRangeHigh)
      || !(category === 'bedroom' || category === 'bathroom' || category === 'kitchen' || category === 'office'
        || category === 'electronics' || category === 'furniture' || category === 'decor' || category === 'other' || category === '.*')
    ) {
      res.status(400).json({ message: 'INVALID SEARCH PARAMETERS' });
      return;
    }

    const results = await getSearchPosts(
      searchQuery,
      page,
      limit,
      sortBy,
      priceRangeLow,
      priceRangeHigh,
      category,
    );

    if (results instanceof Error) {
      res.status(500).json({ message: `MONGODB ERROR: ${results.message}` });
      return;
    }

    const resultData = results[0];

    res.set('Access-Control-Expose-Headers', 'x-total-count');

    if (resultData.totalCount.length === 0) {
      res.set('x-total-count', 0);
      res.status(404).json(resultData.results);
    } else {
      res.set('x-total-count', resultData.totalCount[0].count);
      res.status(200).json(resultData.results);
    }
  } catch (err) {
    // console.log(err.message);
    res.status(500).json({ message: `INTERNAL SERVER ERROR: ${err.message}` });
  }
};

module.exports = {
  handleSearchPosts,
};
