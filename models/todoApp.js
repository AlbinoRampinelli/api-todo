const  mongoose = require('mongoose');


const  TodoApp = mongoose.model('TodoApp', {
    text: {
        type: String, 
        required: true, 
        minlength: 1, 
        trim: true
    },
    compelted: {
        tyoe: Boolean, 
        default: false
    },
    compeltedAt:{
        type: Number, 
        default: null
    }
});

module.exports = {
    TodoApp
}
