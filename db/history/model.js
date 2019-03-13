const sequelize = require('../init')
const Sequelize = require('sequelize');

const History = sequelize.define('history', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
    primaryKey: true
  },
  type: {
    type: Sequelize.STRING
  },
  count: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE,
});

module.exports = History