const mongoose = require('mongoose');

const databaseConnection = () => {
    mongoose.connect(process.env.DATABASE_URL)
    .then((res) => console.log(`Database successfully connected with ${res.connection.host}`))
    .catch((error) => console.log(`ERR: ${error.message}`))
}

module.exports = databaseConnection;