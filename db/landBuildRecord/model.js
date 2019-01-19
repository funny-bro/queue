const sequelize = require('../init')
const Sequelize = require('sequelize');
const SectionModel = require('../section/model')

const LandBuildRecord = sequelize.define('landBuildRecord', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
    primaryKey: true
  },
  landBuild: {type: Sequelize.STRING, allowNull: false },
  data: {type: Sequelize.STRING, defaultValue: ''},
  html: {type: Sequelize.STRING, defaultValue: ''},
  preData: {type: Sequelize.STRING, defaultValue: ''},
  status: {type: Sequelize.STRING, defaultValue: ''},
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE,
});

LandBuildRecord.belongsTo(SectionModel)

module.exports = LandBuildRecord