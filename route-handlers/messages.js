const { getMessages, addMessage, getRecipients } = require('../db-operations/messageDB');

// Get messages
const getMessageHandler = async (req, res) => {
  try {
    const {
      userId,
      receiverId,
    } = req.query;
    const results = (await getMessages(userId, receiverId));
    if (results instanceof Error) {
      res.status(500).json({ message: 'MONGODB ERROR' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ message: 'No data found' });
      return;
    }
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ message: 'INTERNAL SERVER ERROR' });
  }
};

// Add message
const addMessageHandler = async (req, res) => {
  try {
    const { userId, receiverId, userMessage } = req.body;
    const results = await addMessage(userId, receiverId, userMessage);

    if (results instanceof Error) {
      res.status(500).json({ message: 'MONGODB ERROR' });
      return;
    }
    res.status(201).json(results);
  } catch (err) {
    res.status(500).json({ message: 'INTERNAL SERVER ERROR' });
  }
};

// get chat recipients
const getReceiverHandler = async (req, res) => {
  try {
    const { userId } = req.query;
    const results = (await getRecipients(userId));
    if (results instanceof Error) {
      res.status(500).json({ message: `MONGODB ERROR: ${results.message}` });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ message: 'No data found' });
      return;
    }
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ message: 'INTERNAL SERVER ERROR' });
  }
};

module.exports = {
  getMessageHandler,
  addMessageHandler,
  getReceiverHandler,
};
