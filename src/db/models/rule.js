'use strict';
module.exports = (sequelize, DataTypes) => {
  var Rule = sequelize.define('Rule', {
    description: DataTypes.STRING,
    ruleId: {
      type: DataTypes.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'Topics',
        key: 'id',
        as: 'topicId'
      }
    }
  }, {});
  Rule.associate = function(models) {
    Rule.belongsTo(models.Topic, {
      foreignKey: 'ruleId',
      onDelete: 'CASCADE'
    });
  };
  return Rule;
};