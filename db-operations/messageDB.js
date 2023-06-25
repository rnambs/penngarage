const { ObjectId } = require('mongodb');
const { getDB } = require('../DbOperations');

const getMessages = async (
  userId,
  receiverId,
) => {
  try {
    const db = await getDB();
    const messages = await db.collection('messages').find({
      $or: [
        { userId: new ObjectId(userId), receiverId: new ObjectId(receiverId) },
        { userId: new ObjectId(receiverId), receiverId: new ObjectId(userId) },
      ],
    }).toArray();
    return messages;
  } catch (err) {
    return err;
  }
};

const addMessage = async (
  userId,
  receiverId,
  userMessage,
) => {
  try {
    const db = await getDB();
    const messageToAdd = await db.collection('messages').insertOne({
      userId: new ObjectId(userId),
      receiverId: new ObjectId(receiverId),
      userMessage,
      timestamp: new Date(),
    });
    return messageToAdd;
  } catch (err) {
    return err;
  }
};

const getRecipients = async (
  userId,
) => {
  try {
    const db = await getDB();
    const messages = await db.collection('messages').aggregate([
      {
        $match: {
          $or: [
            { userId: new ObjectId(userId) },
            { receiverId: new ObjectId(userId) },
          ],
        },
      },
      {
        $group: {
          _id: {
            userId: '$userId',
            receiverId: '$receiverId',
          },
        },
      },
      {
        $project: {
          _id: 0,
          recipient: {
            $cond: {
              if: {
                $eq: ['$_id.userId', new ObjectId(userId)],
              },
              then: '$_id.receiverId',
              else: '$_id.userId',
            },
          },
        },
      },
      {
        $group: {
          _id: '$recipient',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: {
          path: '$user',
        },
      },
      {
        $project: {
          _id: 0,
          id: '$user._id',
          firstName: '$user.firstName',
          lastName: '$user.lastName',
        },
      },
    ]).toArray();
    // console.log(messages);
    return messages;
  } catch (err) {
    return err;
  }
};

module.exports = {
  getMessages,
  addMessage,
  getRecipients,
};
