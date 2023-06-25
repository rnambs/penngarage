const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const dbURL = `mongodb+srv://setdavid:${process.env.MONGODB_PASSWORD}@cluster0.wkfv26l.mongodb.net/Penn_Garage?retryWrites=true&w=majority`;

let MongoConnection;
const connect = async () => {
  try {
    MongoConnection = (await MongoClient.connect(
      dbURL,
      { useNewUrlParser: true, useUnifiedTopology: true },
    ));

    // console.log(`connected to db: ${MongoConnection.db().databaseName}`);
    return MongoConnection;
  } catch (err) {
    // console.log(err.message);
    return err;
  }
};

const getDB = async () => {
  if (!MongoConnection) {
    await connect();
  }
  return MongoConnection.db();
};

const closeMongoDBConnection = async () => {
  await MongoConnection.close();
};

module.exports = {
  closeMongoDBConnection,
  getDB,
  connect,
};
