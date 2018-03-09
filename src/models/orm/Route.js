const Sequelize = require('sequelize');

const validator = require('validator');
module.exports = (sequelize, Sequelize) => {
  const model = {
    id: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
    },
    locations: {
      type: Sequelize.JSON,
      allowNull: false,
    },
  };
  var SequelizeUser = sequelize.define('route', model, {
    validate: {
      locationsValid() {
        if (!Array.isArray(this.locations)) {
          throw new Error('Locations must be array');
        }
        if (!this.locations.every(location => Array.isArray(location))) {
          throw new Error('Every location must be array');
        }
        if (
          !this.locations.every(location =>
            location.every(latOrLon => validator.isDecimal(latOrLon))
          )
        ) {
          throw new Error('Every location must be number array');
        }
      },
    },
  });

  return SequelizeUser;
};
