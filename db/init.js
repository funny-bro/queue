const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    dialect: 'mysql',
    // mode: 0 = normal, 1 = dev
    logging:
      process.env.developEnv === 'beta' && process.env.mode === '1'
        ? console.log
        : false,
    timezone: '+00:00',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialectOptions: {
      multipleStatements: true
    },
    pool: {
      max: 1,
      min: 0,
      handleDisconnects: true
    }
  }
)

module.exports = sequelize