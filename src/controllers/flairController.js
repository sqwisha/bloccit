const Flair = require('../db/models').Flair;
const flairQueries = require('../db/queries.flair.js');

module.exports = {
  new(req, res, next) {
    res.render('flair/new', {topicId: req.params.topicId, postId: req.params.postId});
  },
  create(req, res, next) {
    flairQueries.createFlair({
      name: req.body.name,
      color: req.body.color,
      postId: req.params.postId
    }, (err, flair) => {
      if (err) {
        res.redirect(500, `/topics/${req.params.topicId}/posts/${req.params.postId}`);
      } else {
        res.redirect(303, `/topics/${req.params.topicId}/posts/${req.params.postId}`);
      }
    });
  },
  destroy(req, res, next) {
    flairQueries.destroyFlair(req.params.flairId, (err) => {
      if (err) {
        res.redirect(500, `/topics/${req.params.topicId}/posts/${req.params.postId}`);
      } else {
        res.redirect(303, `/topics/${req.params.topicId}/posts/${req.params.postId}`);
      }
    });
  },
  edit(req, res, next) {
    flairQueries.getFlair(req.params.flairId, (err, flair) => {
      if (err || flair == null) {
        res.redirect(404, `/topics/${req.params.topicId}/posts/${req.params.postId}`);
      } else {
        res.render('flair/edit', {flair, topicId: req.params.topicId, postId: req.params.postId});
      }
    });
  },
  update(req, res, next) {
    flairQueries.updateFlair(req.params.flairId, req.body, (err, flair) => {
      if (err || flair == null) {
        res.redirect(404, `/topics/${req.params.topicId}/posts/${req.params.postId}/flair/${req.params.flairId}/edit`);
      } else {
        res.redirect(303, `/topics/${req.params.topicId}/posts/${req.params.postId}`);
      }
    });
  }
};