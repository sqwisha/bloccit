'use strict';
module.exports = (sequelize, DataTypes) => {
  var Favorite = sequelize.define('Favorite', {
    userId: DataTypes.INTEGER,
    postId: DataTypes.INTEGER
  }, {});
  Favorite.associate = function(models) {
    Favorite.belongsTo(models.Post, {
      foreignKey: 'postId',
      onDelete: 'CASCADE'
    });
    Favorite.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Favorite.addScope('favoritesFor', (userId) => {
      return {
        include: [{
          model: models.Post
        }],
        where: {userId: userId},
        order: [['createdAt', 'DESC']]
      }
    });
  };
  return Favorite;
};
