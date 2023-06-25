const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');

const {
  getLogin, getUsername, addUser, getForgot, editPassword,
} = require('../db-operations/loginDB');
const { authenticateUser } = require('../utils/auth');

const handleLogin = async (req, res) => {
  try {
    const {
      username,
      password,
    } = req.query;

    if (
      username === '' || password === ''
    ) {
      res.status(400).json({ message: 'INVALID LOGIN PARAMETERS' });
      return;
    }

    const results = await getLogin(
      username,
      password,
    );

    if (results instanceof Error) {
      res.status(500).json({ message: 'MONGODB ERROR' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ message: 'USER NOT FOUND' });
    } else {
      const token = authenticateUser(username, password);

      const resBody = {
        user: results,
        token,
      };

      res.status(200).json(resBody);
    }
  } catch (err) {
    // console.log(err.message);
    res.status(500).json({ message: 'INTERNAL SERVER ERROR' });
  }
};

const handleCheckid = async (req, res) => {
  try {
    const {
      username,
    } = req.query;

    if (
      username === ''
    ) {
      res.status(400).json({ message: 'INVALID USERNAME PARAMETER' });
      return;
    }

    const results = await getUsername(
      username,
    );

    if (results instanceof Error) {
      res.status(500).json({ message: 'MONGODB ERROR' });
      return;
    }

    // console.log(results)

    if (results.length !== 0) {
      res.status(409).json({ message: 'USERNAME ALREADY EXISTS' });
    } else {
      res.status(200).json({ message: 'SUCCESSFUL USERNAME' });
    }
  } catch (err) {
    // console.log(err.message);
    res.status(500).json({ message: 'INTERNAL SERVER ERROR' });
  }
};

const handleReg = async (req, res) => {
  try {
    const {
      username,
      password,
      firstName,
      lastName,
      email,
      question,
      answer,
      // header: {
      //   garagePhotoURL,
      //   garageDesc,
      //   moveoutDate,
      //   pickupLoc,
      //   avgRating,
      // },
    } = req.body;

    if (
      username === '' || password === '' || firstName === '' || lastName === ''
      || email === '' || question === '' || answer === ''
    ) {
      res.status(400).json({ message: 'INVALID PARAMETER' });
      return;
    }

    const results = await addUser(
      req.body,
    );
    // console.log(results);

    if (results instanceof Error) {
      res.status(500).json({ message: 'MONGODB ERROR' });
      return;
    }
    res.status(201).json(results);
  } catch (err) {
    // console.log(err.message);
    res.status(500).json({ message: 'INTERNAL SERVER ERROR' });
  }
};

const handleForgot = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
    } = req.query;

    if (
      firstName === '' || lastName === '' || email === ''
    ) {
      res.status(400).json({ message: 'INVALID USERNAME PARAMETER' });
      return;
    }

    const results = await getForgot(
      firstName,
      lastName,
      email,
    );

    if (results instanceof Error) {
      res.status(500).json({ message: 'MONGODB ERROR' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ message: 'USER INFO INCORRECT' });
    } else {
      res.status(200).json(results);
    }
  } catch (err) {
    // console.log(err.message);
    res.status(500).json({ message: 'INTERNAL SERVER ERROR' });
  }
};

const handlePwReset = async (req, res) => {
  try {
    // console.log(req);

    const {
      userID,
    } = req.params;

    const {
      password,
    } = req.body;

    if (
      userID === '' || password === ''
    ) {
      res.status(400).json({ message: 'INVALID USERNAME PARAMETER' });
      return;
    }

    const results = await editPassword(
      userID,
      password,
    );

    if (results instanceof Error) {
      res.status(500).json({ message: 'MONGODB ERROR' });
      return;
    }

    res.status(200).json({ message: 'SUCCESSFUL PASSWORD RESET' });
  } catch (err) {
    // console.log(err.message);
    res.status(500).json({ message: 'INTERNAL SERVER ERROR' });
  }
};

const handleVerifyToken = async (req, res) => {
  try {
    const {
      token,
      userId,
    } = req.body;

    if (!token || !userId) {
      res.sendStatus(400);
      return;
    }

    const decoded = jwt.verify(token, process.env.KEY);
    const user = await getLogin(decoded.username, decoded.password);

    if (user instanceof Error) {
      res.sendStatus(401);
    }

    if (user.length === 0) {
      res.sendStatus(401);
      // eslint-disable-next-line no-underscore-dangle
    } else if (user[0]._id.equals(new ObjectId(userId))) {
      res.sendStatus(200);
    } else {
      res.sendStatus(401);
    }
  } catch (err) {
    // console.log(err.message);
    res.sendStatus(500);
  }
};

module.exports = {
  handleLogin, handleCheckid, handleReg, handleForgot, handlePwReset, handleVerifyToken,
};
