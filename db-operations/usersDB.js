const { ObjectId } = require('mongodb');
const { getDB } = require('../DbOperations');

const fetchUserDB = async (userId) => {
  try {
    const db = await getDB();
    const result = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    return result;
  } catch (err) {
    return err;
  }
};

const updateUserDB = async (userId, patchObj) => {
  try {
    const db = await getDB();
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $set: patchObj },
    );
    return result;
  } catch (err) {
    return err;
  }
};

module.exports = {
  fetchUserDB,
  updateUserDB,
};
