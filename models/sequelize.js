const Sequelize = require('sequelize');

////////////////////// SQl
const sequelize = new Sequelize('calendly', 'root', 'root123', {
    host: 'localhost',
    dialect: 'mysql'
});
sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });
sequelize.sync();
//////////////////////////////////

module.exports = sequelize;