const bcrypt = require('bcrypt');

const bcryptData = (data) => {
  bcrypt.hash(data, 10, (err, hash) => {
    if (err) {
      return false;
    }
    return hash;
  });
};

const bcryptVerify = (data, password) => {
  bcrypt.compare(data, password, (err, result) => {
    if (err) {
      return false;
    }
    return result;
  });
};

module.exports = {
  bcryptData,
  bcryptVerify,
};
