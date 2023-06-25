const { ObjectId } = require('mongodb');
const { getDB } = require('../DbOperations');

// works with verifyLogin
const getLogin = async (
  username,
  password,
) => {
  try {
    const db = await getDB();

    const result = await db.collection('users').find({
      username,
      password,
    }).toArray();
    return result;
  } catch (err) {
    // console.log(`error: ${err.message}`);
    return err;
  }
};

// works with verifyId
const getUsername = async (
  username,
) => {
  try {
    const db = await getDB();

    const result = await db.collection('users').find({
      username,
    }).toArray();
    return result;
  } catch (err) {
    // console.log(`error: ${err.message}`);
    return err;
  }
};

// works with registerUser
const addUser = async (
  newUser,
) => {
  try {
    const db = await getDB();

    const result = await db.collection('users').insertOne(newUser);

    return result;
  } catch (err) {
    // console.log(`error: ${err.message}`);
    return err;
  }
};

// works with verifyForgot
const getForgot = async (
  firstName,
  lastName,
  email,
) => {
  try {
    const db = await getDB();

    const result = await db.collection('users').find({
      firstName,
      lastName,
      email,
    }).toArray();
    return result;
  } catch (err) {
    // console.log(`error: ${err.message}`);
    return err;
  }
};

// works with resetPassword
const editPassword = async (userID, newPw) => {
  try {
    const db = await getDB();

    // console.log(newPw);

    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(userID) },
      { $set: { password: newPw } },
    );

    return result;
  } catch (err) {
    // console.log(`error: ${err.message}`);
    return err;
  }
};

module.exports = {
  getLogin, getUsername, addUser, getForgot, editPassword,
};
