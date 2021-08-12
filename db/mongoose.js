const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, () => console.log('Connected to database'));

module.exports = {
    mongoose
}