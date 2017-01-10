module.exports = function(Sequelize, sequelize) {
    return sequelize.define('result', {
        // createdAt - automatic field
        uuid: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        location: Sequelize.GEOMETRY('POINT'), // { type: 'Point', coordinates: [lat, lng]}
        rtt: Sequelize.INTEGER,
        country: Sequelize.STRING,
        country_abbreviation: Sequelize.STRING,
        continent: Sequelize.STRING
    });
};
