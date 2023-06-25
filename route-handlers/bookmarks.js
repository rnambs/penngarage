const { postBookmark } = require('../db-operations/bookmarkDB');

const handleCreateBookmark = async (req, res) => {
  try {
    const { userId } = req.params;
    const { postId } = req.body;

    if (!userId || !postId) {
      res.status(400).json({ message: 'INVALID REQUEST' });
      return;
    }

    const results = await postBookmark(userId, postId);

    if (results instanceof Error) {
      if (results.code === 11000) {
        res.status(409).json({ message: 'BOOKMARK ALREADY EXISTS' });
      } else {
        res.status(500).json({ message: `MONGODB ERROR: ${results.message}` });
      }

      return;
    }

    res.status(201).send();
  } catch (err) {
    // console.log(err.message);
    res.status(500).json({ message: `INTERNAL SERVER ERROR: ${err.message}` });
  }
};

module.exports = {
  handleCreateBookmark,
};
