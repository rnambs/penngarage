const app = require('./server');

// update port

const port = process.env.PORT || 8080;

/* eslint-disable no-console */
app.listen(port, () => {
  console.log('Server running on port', port);
});
