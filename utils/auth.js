/**
 * This module contains authentication and session functions
 */

// import JWT
const jwt = require('jsonwebtoken');

// import the env variables
require('dotenv').config();

// import DB function
const { getLogin } = require('../db-operations/loginDB');

/**
 * Create a JWT containing the username
 * @param {string} username
 * @param {string} password
 * @returns the token
 */
const authenticateUser = (username, password) => {
  try {
    const token = jwt.sign({ username, password }, process.env.KEY, { expiresIn: '120s' });
    // console.log('token', token);
    return token;
  } catch (err) {
    // console.log('error', err.message);
    return err;
  }
};

/**
 * Verify a token. Check if the user is valid
 * @param {*} token
 * @returns true if the user is valid
 */
const verifyUser = async (token) => {
  try {
    // decoded contains the paylod of the token
    const decoded = jwt.verify(token, process.env.KEY);
    // console.log('payload', decoded);
    // check that the payload contains a valid user
    const user = await getLogin(decoded.username, decoded.password);

    if (user instanceof Error) {
      return false;
    }

    if (user.length === 0) {
      return false;
    }

    return true;
  } catch (err) {
    // invalid token
    // console.log('error', err.message);
    return false;
  }
};

module.exports = { authenticateUser, verifyUser };
