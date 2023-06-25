const { fetchUserContact, getBookmarks } = require('../db-operations/myprofileDB');

const handleFetchUserContact = async (req, res) => {
  try {
    const result = await fetchUserContact(req.params.userId);
    res.status(200).json(result);
  } catch (err) {
    res.status(404).json({ message: 'user not in database' });
  }
};

const handleGetBookmarks = async (req, res) => {
  try {
    const results = await getBookmarks(req.params.userId);

    if (results instanceof Error) {
      res.status(500).json({ message: `MONGODB ERROR: ${results.message}` });
      return;
    }

    const resBody = results
      .filter((bookmark) => bookmark.post.length > 0)
      .map((bookmark) => bookmark.post[0]);

    res.status(200).json(resBody);
  } catch (err) {
    res.status(500).json({ message: `INTERNAL SERVER ERROR: ${err.message}` });
  }
};

module.exports = {
  handleFetchUserContact,
  handleGetBookmarks,
};
