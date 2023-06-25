const { ObjectId } = require('mongodb');
const {
  addPostDB, editPostDB, removePostDB, fetchUsersPostsDB, updateBidDB,
} = require('../db-operations/postsDB');

// *** Helper method ***
// patchBool = 1 => PATCH, patchBool = 0 => POST
// Could refactor to return message.
const isPostObjValid = (postObj, patchBool) => {
  //* **************************************************
  // Does the input object have the correct prop names?
  //* **************************************************
  const inputProps = Object.getOwnPropertyNames(postObj);

  const expectedPostProps = ['sellerId', 'title', 'seller', 'description', 'image',
    'priceType', 'price', 'postedOn', 'availableUntil', 'category'];

  const validPropNames = inputProps.every((val) => expectedPostProps.includes(val));

  if (!validPropNames) {
    return 0; // INVALID (Case 0)
  }

  // We must ensure that each field is present when *POST'ing* a post!
  if (!patchBool && inputProps.length !== 10) {
    return -1; // INVALID (Case 1)
  }

  //* **************************************************
  // Does the input object have the correct prop types?
  //* **************************************************
  const categoryArr = ['bedroom', 'bathroom', 'kitchen', 'office', 'electronics', 'furniture', 'decor', 'other'];
  const stringValProps = ['title', 'sellerId', 'seller', 'description', 'image',
    'priceType', 'postedOn', 'availableUntil', 'category'];

  /* eslint-disable no-restricted-syntax */
  for (const prop of inputProps) {
    const val = postObj[prop]; // prop is a string, not a symbol.

    if (stringValProps.includes(prop) && !(typeof val === 'string' || val instanceof String)) {
      return -2; // INVALID (Case 2)
    } if (prop === 'priceType' && (val !== 'fixed' && val !== 'bid')) {
      return -3; // INVALID (Case 3)
    } if (prop === 'price' && Number.isNaN(Number(val))) {
      return -4; // INVALID (Case 4)
    } if (prop === 'price' && (val < 0)) {
      return -5; // INVALID (Case 5)
    } if (prop === 'category' && (!categoryArr.includes(val))) {
      return -6; // INVALID (Case 6)
    }
    // Could add more checks soon. See below.
    // if (val.length > 50) {
    //  validProps = false;
    // }

    // Additionally, could check date format.
  }
  return 1; // Valid input!
};

const handleAddPost = async (req, res) => {
  try {
    const inputObj = req.body;

    if (Object.keys(inputObj).length === 0) {
      res.status(400).json({ message: 'NO INFORMATION PROVIDED' });
      return;
    }

    const validityNum = isPostObjValid(inputObj, 0);

    if (validityNum === 0) {
      res.status(400).json({ message: 'OBJECT PROPERTIES NOT VALIDLY NAMED' });
      return;
    }
    if (validityNum === -1) {
      res.status(400).json({ message: 'OBJECT MISSING REQUIRED PROPERTIES' });
      return;
    }
    if (validityNum === -2) {
      res.status(400)
        .json({ message: 'STRING PROP NOT GIVEN STRING INPUT (NOTE: ID\'s ARE STRINGS)' });
      return;
    }
    if (validityNum === -3) {
      res.status(400).json({ message: 'PRICETYPE NOT \'fixed\' OR \'bid\' (TYPE SENSITIVE)' });
      return;
    }
    if (validityNum === -4) {
      res.status(400).json({ message: 'PRICE IS NOT A NUMBER' });
      return;
    }
    if (validityNum === -5) {
      res.status(400).json({ message: 'PRICE IS NEGATIVE' });
      return;
    }
    if (validityNum === -6) {
      res.status(400).json({ message: 'INVALID CATEGORY (TYPE SENSITIVE)' });
      return;
    }

    // Modify the sellerId field appropriately.
    inputObj.sellerId = new ObjectId(inputObj.sellerId);

    const result = await addPostDB(inputObj);
    res.status(201).json({ insertedId: result.insertedId });
  } catch (err) {
    res.status(500).json({ message: 'INTERNAL SERVER ERROR' });
  }
};

const handleEditPost = async (req, res) => {
  try {
    const inputPostId = req.params.postId;

    // if (Number.isNaN(Number(inputPostId))) {
    //   res.status(400).json({ message: 'POST ID NOT A NUMBER' });
    //   return;
    // }

    const inputObj = req.body;

    if (Object.keys(inputObj).length === 0) {
      res.status(400).json({ message: 'NO INFORMATION PROVIDED' });
      return;
    }

    const validityNum = isPostObjValid(inputObj, 1);
    if (validityNum === 0) {
      res.status(400).json({ message: 'OBJECT PROPERTIES NOT VALIDLY NAMED' });
      return;
    }
    if (validityNum === -2) {
      res.status(400).json({ message: 'STRING PROP NOT GIVEN STRING INPUT' });
      return;
    }
    if (validityNum === -3) {
      res.status(400).json({ message: 'PRICETYPE NOT \'fixed\' OR \'bid\' (TYPE SENSITIVE)' });
      return;
    }
    if (validityNum === -4) {
      res.status(400).json({ message: 'PRICE IS NOT A NUMBER' });
      return;
    }
    if (validityNum === -5) {
      res.status(400).json({ message: 'PRICE IS NEGATIVE' });
      return;
    }
    if (validityNum === -6) {
      res.status(400).json({ message: 'INVALID CATEGORY (TYPE SENSITIVE)' });
      return;
    }

    const result = await editPostDB(inputPostId, inputObj);

    if (result.matchedCount === 0) {
      res.status(404).json({ message: 'POST NOT FOUND' });
      return;
    }

    res.status(200).json({ modifiedCount: result.modifiedCount });
  } catch (err) {
    res.status(500).json({ message: 'INTERNAL SERVER ERROR' });
  }
};

const handleRemovePost = async (req, res) => {
  try {
    const inputPostId = req.params.postId;

    // if (Number.isNaN(Number(inputPostId))) {
    //   res.status(400).json({ message: 'POST ID NOT A NUMBER' });
    //   return;
    // }

    const result = await removePostDB(inputPostId);

    if (result.deletedCount === 0) {
      res.status(404).json({ message: 'POST NOT FOUND' });
      return;
    }

    res.status(200).json({ deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ message: 'INTERNAL SERVER ERROR' });
  }
};

const handleFetchUsersPosts = async (req, res) => {
  try {
    const { sellerId } = req.query;

    // if (Number.isNaN(Number(sellerId))) {
    //   res.status(400).json({ message: 'SELLER ID NOT A NUMBER' });
    //   return;
    // }

    const results = await fetchUsersPostsDB(sellerId);

    if (results.length === 0 || Object.keys(results).length === 0) {
      // res.status(404).json({ data: [], message: 'NO POSTS FOUND' });
      res.status(404).json([]);
      return;
    }

    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ message: 'INTERNAL SERVER ERROR' });
  }
};

const handleUpdateBid = async (req, res) => {
  try {
    const { postId } = req.params;
    const { price, highestBidderId } = req.body;

    if (!postId || !price || !highestBidderId) {
      res.status(400).json({ message: 'INVALID REQUEST' });
      return;
    }

    const results = await updateBidDB(postId, price, highestBidderId);

    if (results instanceof Error) {
      res.status(500).json({ message: `MONGODB ERROR: ${results.message}` });
      return;
    }

    res.sendStatus(200);
  } catch (err) {
    // console.log(err.message);
    res.status(500).json({ message: `INTERNAL SERVER ERROR: ${err.message}` });
  }
};

module.exports = {
  handleAddPost,
  handleEditPost,
  handleRemovePost,
  handleFetchUsersPosts,
  handleUpdateBid,
};
