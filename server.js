const express = require('express');
const cors = require('cors');
// import path
const path = require('path');
const { handleSearchPosts } = require('./route-handlers/search');
const {
  handleLogin, handleCheckid, handleReg, handleForgot, handlePwReset, handleVerifyToken,
} = require('./route-handlers/login');
const { getMessageHandler, addMessageHandler, getReceiverHandler } = require('./route-handlers/messages');
const { handleGetBookmarks, handleFetchUserContact } = require('./route-handlers/myprofileHandler');
const { handleCreateBookmark } = require('./route-handlers/bookmarks');
const { handleUpdateUser } = require('./route-handlers/users');
const {
  handleAddPost, handleEditPost, handleRemovePost, handleFetchUsersPosts, handleUpdateBid,
} = require('./route-handlers/posts');
const { verifyUser } = require('./utils/auth');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, './client/build')));

app.use(async (req, res, next) => {
  if (req.method !== 'GET' && !req.originalUrl.includes('/login')) {
    if (await verifyUser(req.get('authorization'))) {
      next();
    } else {
      res.status(401).json({ message: 'UNAUTHORIZED' });
    }
  } else {
    next();
  }
});

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the Penn Garage API!' });
});

app.get('/posts/search', handleSearchPosts);
app.post('/posts', handleAddPost);
app.patch('/posts/:postId', handleEditPost);
app.delete('/posts/:postId', handleRemovePost);
app.get('/posts', handleFetchUsersPosts);
app.patch('/posts/bid/:postId', handleUpdateBid);

app.get('/messages', getMessageHandler);
app.post('/messages', addMessageHandler);
app.get('/messages/recipients', getReceiverHandler);

// app.get('/users/:userId', handleFetchUser);
app.patch('/users/:userId', handleUpdateUser);
app.get('/users/:userId', handleFetchUserContact);
app.get('/users/:userId/bookmarks', handleGetBookmarks);
app.post('/users/:userId/bookmarks', handleCreateBookmark);

app.get('/login', handleLogin);
app.get('/login/new-user', handleCheckid);
app.post('/login/new-user', handleReg);
app.get('/login/forgot', handleForgot);
app.put('/login/forgot/:userID', handlePwReset);
app.post('/login/verify-token', handleVerifyToken);

// add wildcard endpoint
app.get('*', (req, res) => {
  res.send(path.join(__dirname, './client/build/index.html'));
});

module.exports = app;
