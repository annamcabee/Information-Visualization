var Sequelize = require('sequelize');
var PG_URL = process.env.DATABASE_URL || 'postgres://localhost:5432/latency';
var sequelize = new Sequelize(PG_URL, {
    dialectOptions: {
        ssl: true
    }
});

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
};
