const sequelize = require('../init')
const Sequelize = require('sequelize');

const history = sequelize.define('history', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
    primaryKey: true
  },
  count: {type: Sequelize.BIGINT, defaultValue: 1 },
  type: {type: Sequelize.STRING, defaultValue: ''},
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE,
});

module.exports = history