const sequelize = require('../init')
const Sequelize = require('sequelize');

const section = sequelize.define('section', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
    primaryKey: true
  },
  cityCode: {type: Sequelize.STRING, allowNull: false },
  townCode: {type: Sequelize.STRING, allowNull: false },
  sectCode: {type: Sequelize.STRING, allowNull: false },
  landBuildMax: {type: Sequelize.BIGINT, defaultValue: 1 },
  project: {type: Sequelize.STRING, allowNull: false },
  createdAt: Sequelize.DATE,
  executedAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE,
});

module.exports = section