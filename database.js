const mongoose = require('mongoose');

const connectToMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB);
        console.log('Successfully connected to the Database');
    }
    catch (error) {
        console.log('Error while connecting to the Database', error);
    }
}

module.exports = connectToMongoDB;