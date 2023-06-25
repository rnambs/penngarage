const { fetchUserDB, updateUserDB } = require('../db-operations/usersDB');

const handleFetchUser = async (req, res) => {
  try {
    const inputUserId = req.params.userId;
    // if (Number.isNaN(Number(inputUserId))) {
    //   res.status(400).json({ message: 'USER ID NOT A NUMBER' });
    //   return;
    // }
    const results = await fetchUserDB(inputUserId);

    if (results === null || Object.keys(results).length === 0) {
      res.status(404).json({ message: 'USER NOT FOUND' });
      return;
    }

    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ message: 'INTERNAL SERVER ERROR' });
  }
};

const handleUpdateUser = async (req, res) => {
  try {
    const inputUserId = req.params.userId;

    // if (Number.isNaN(Number(inputUserId))) {
    //   res.status(400).json({ message: 'USER ID NOT A NUMBER' });
    //   return;
    // }

    const inputObj = req.body;
    const inputHeaderObj = inputObj.header; // Could be undefined!

    if (Object.keys(inputObj).length === 0) {
      res.status(400).json({ message: 'NO INFORMATION PROVIDED' });
      return;
    }

    //* **************************************************
    // Does the input object have the correct prop names?
    //* **************************************************
    const inputProps = Object.getOwnPropertyNames(inputObj);

    const expectedUserProps = ['username', 'firstName', 'lastName', 'email', 'password',
      'phone', 'question', 'answer', 'profilePicture', 'header'];

    const expectedHeaderProps = ['garagePhotoURL', 'garageDesc', 'moveoutDate', 'pickupLoc', 'avgRating'];

    let validHeaderProps = true;

    if (inputHeaderObj) {
      const inputHeaderProps = Object.getOwnPropertyNames(inputHeaderObj); // Could be undefined!

      validHeaderProps = (inputHeaderProps.every((val) => expectedHeaderProps.includes(val)))
        && (inputHeaderProps.length === 5);

      if (!validHeaderProps) {
        res.status(400).json({ message: 'INVALID/MISSING HEADER PROPERTY NAMES' });
        return;
      }
    }

    const validProps = inputProps.every((val) => expectedUserProps.includes(val))
      && validHeaderProps;

    if (!validProps) {
      res.status(400).json({ message: 'INVALID OBJECT PROPERTY NAMES' });
      return;
    }

    //* **************************************************
    // Does the input object have the correct prop types?
    //* **************************************************
    /* eslint-disable no-restricted-syntax */
    for (const prop of inputProps) {
      const val = inputObj[prop]; // prop is a string, not a symbol.

      if (prop === 'phone') {
        if (val.toString().length > 12) {
          // Current: is it of the form? xxx-xxx-xxxx?
          // Future: are all of the x's integers, with two separating hyphens?
          res.status(400).json({ message: 'PHONE NUMBER TOO LARGE' });
          return;
        }
      } else if (prop === 'header') {
        const goodHeader = (typeof val.garagePhotoURL === 'string'
            || val.garagePhotoURL instanceof String)
            && (typeof val.garageDesc === 'string' || val.garageDesc instanceof String)
            && (typeof val.moveoutDate === 'string' || val.moveoutDate instanceof String)
            && (typeof val.pickupLoc === 'string' || val.pickupLoc instanceof String)
            && (!Number.isNaN(Number(val.avgRating)) && val.avgRating >= 0 && val.avgRating <= 5);

        if (!goodHeader) {
          res.status(400).json({ message: 'HEADER PROPS HAVE INVALID VALUE' });
          return;
        }
      } else if (!(typeof val === 'string' || val instanceof String)) {
        // Could add more checks soon. See below.
        // if (val.length > 50) {
        //  validProps = false;
        // }

        // Additionally, could check date format.
        res.status(400).json({ message: 'STRING PROPS HAVE INVALID VALUE' });
        return;
      }
    }

    if (!validProps) {
      res.status(400).json({ message: 'OBJECT PROPERTIES OF INVALID FORMAT' });
      return;
    }

    //* ******************************************************************
    // Finally, prepare the patch request using only the provided fields.
    //* ******************************************************************
    const result = await updateUserDB(inputUserId, inputObj);

    if (result.matchedCount === 0) {
      res.status(404).json({ message: 'USER NOT FOUND' });
      return;
    }

    res.status(200).json({ modifiedCount: result.modifiedCount });
  } catch (err) {
    // res.status(500).json({ message: 'INTERNAL SERVER ERROR' });

    // "[ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client" issues
  }
};

module.exports = {
  handleFetchUser,
  handleUpdateUser,
};
