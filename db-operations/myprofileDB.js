const { ObjectId } = require('mongodb');
const { getDB } = require('../DbOperations');

const fetchUserContact = async (userId) => {
  try {
    const db = await getDB();
    const result = await db.collection('users').findOne({ _id: new ObjectId(userId) });

    return result;
  } catch (err) {
    // console.log(err.message);
    return err;
  }
};

const getBookmarks = async (userId) => {
  try {
    const db = await getDB();
    // const result = await db.collection('bookmarks').find({
    //   '_id.userId': new ObjectId(userId)
    // }).toArray();

    const result = await db.collection('bookmarks').aggregate([
      {
        $match: {
          '_id.userId': new ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: 'posts',
          localField: '_id.postId',
          foreignField: '_id',
          as: 'post',
        },
      },
    ]).toArray();

    return result;
  } catch (err) {
    return err;
  }
};

module.exports = {
  fetchUserContact,
  getBookmarks,
};
