const { ObjectId } = require('mongodb');
const { getDB } = require('../DbOperations');

const postBookmark = async (userId, postId) => {
  try {
    const db = await getDB();

    const result = await db.collection('bookmarks').insertOne({
      _id: {
        userId: new ObjectId(userId),
        postId: new ObjectId(postId),
      },
    });

    return result;
  } catch (err) {
    // console.log(`error: ${err.message}`);
    return err;
  }
};

module.exports = {
  postBookmark,
};
