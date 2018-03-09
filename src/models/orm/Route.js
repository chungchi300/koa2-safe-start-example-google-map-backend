const Sequelize = require('sequelize');
const validator = require('validator');

module.exports = (sequelize, Sequelize) => {
  const model = {
    id: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
    },
  };
  var SequelizeUser = sequelize.define('route', model);

  return SequelizeUser;
};
