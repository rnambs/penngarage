const { ObjectId } = require('mongodb');
const { getDB } = require('../DbOperations');

const addPostDB = async (postObj) => {
  try {
    const db = await getDB();
    const result = await db.collection('posts').insertOne(postObj);
    return result;
  } catch (err) {
    return err;
  }
};

const editPostDB = async (postId, patchObj) => {
  try {
    const db = await getDB();
    const result = await db.collection('posts').updateOne(
      { _id: new ObjectId(postId) },
      { $set: patchObj },
    );
    return result;
  } catch (err) {
    return err;
  }
};

const removePostDB = async (postId) => {
  try {
    const db = await getDB();
    const result = await db.collection('posts').deleteOne({ _id: new ObjectId(postId) });
    return result;
  } catch (err) {
    return err;
  }
};

const fetchUsersPostsDB = async (inputSellerId) => {
  try {
    const db = await getDB();
    // The sellerId field will not be wrapped in an ObjectId.
    const result = await db.collection('posts').find({ sellerId: new ObjectId(inputSellerId) }).sort({ postedOn: -1 }).toArray();
    return result;
  } catch (err) {
    return err;
  }
};

const updateBidDB = async (postId, price, highestBidderId) => {
  try {
    const db = await getDB();
    const result = await db.collection('posts').updateOne(
      { _id: new ObjectId(postId) },
      {
        $set: {
          price,
          highestBidderId,
        },
      },
    );
    return result;
  } catch (err) {
    return err;
  }
};

module.exports = {
  addPostDB,
  editPostDB,
  removePostDB,
  fetchUsersPostsDB,
  updateBidDB,
};
