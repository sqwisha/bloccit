const Flair = require('../db/models').Flair;

module.exports = {
  createFlair(newFlair, callback) {
    return Flair.create(newFlair)
    .then((flair) => {
      callback(null, flair);
    })
    .catch((err) => {
      callback(err);
    });
  },
  getFlair(id, callback) {
    return Flair.findById(id)
    .then((flair) => {
      if(!flair) {
        return 'Not found';
      }
      callback(null, flair);
    })
    .catch((err) => {
      callback(err);
    });
  },
  getAllFlair(postId, callback) {
    return Flair.findAll({ where: {postId} })
    .then((flairs) => {
      callback(null, flairs);
    })
    .catch((err) => {
      callback(err);
    });
  },
  destroyFlair(id, callback) {
    return Flair.destroy({ where: { id: id } })
    .then(() => {
      callback(null);
    })
    .catch((err) => {
      callback(err);
    });
  },
  updateFlair(id, updatedFlair, callback) {
    return Flair.findById(id)
    .then((flair) => {
      if (!flair) {
        return callback('Flair not found');
      }
      flair.update(updatedFlair, {
        fields: Object.keys(updatedFlair)
      })
      .then(() => {
        callback(null, flair);
      })
      .catch((err) => {
        callback(err);
      });
    });
  }
};