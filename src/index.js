const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config()
const PORT = process.env.PORT || 3333;
const app = express();
app.use(express.json());
app.use(cors());

// mongoose.connect(process.env.MONGO_URI, {userNewUrlParser: true, useUnifiedTopology: true}, () => {
//     console.log('Connected to Database')
// })
mongoose.connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true

}, () => console.log('Connected to database'));


const UserSchema = new mongoose.Schema({ username: String });
const User = mongoose.model('User', UserSchema);

const TodoSchema = new mongoose.Schema({ decription: String, done:Boolean, user: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'User'
}});

const Todo = mongoose.model('Todo', TodoSchema);


app.get('/', (req,res) =>{
    console.log('Hello world')
})
app.post('/session', async(req,res) => {
    let { username } = req.body;
    let user = '';
    console.log('username:', username);

    try{
        const user = await User.findOne({ username })
        if(!user){
            user = await User.create( {username} )
        }
        return res.status(200).send(User);
    }catch(err){   
        return res.status(400).send(err)
    }; 
});

app.post('/todo/:user_id', async(req,res) => {
    let { description, done } = req.body;
    let { user_id } = req.params;
    try{
        const newTodo = await Todo.create({ description, done, user:user_id });
        return res.status(200).send(newTodo)
    }catch(err) {
        return res.status(400).send(err)
    }
});

app.get('/todo/:user_id', async(req,res) => {
    let { user_id } = req.params;
    try{
        let allTodos = await Todo.find({ user: user_id});
        return res.status(200).send(allTodos)
    }catch(err){
        return res.status(400).send(err)
    }

});

app.patch('/todo/:user_id/:todo_id', async(req,res) => {
    let data = req.body;
    let { todo_id, user_id } = req.params;
    try{
        let belongsToUser = await Todo.findOne({ user: user_id});
        if(!belongsToUser) return res.status(400).send("Operation not allowed")
        let updateTodo = await Todo.findByIdAndUpdate(todo_id, data, {new:true});
        return res.starus(200).send(updateTodo);
    }catch(err) {
        return res.status(400).send(err);
    } 
});

app.delete('/todo/:user_id/:todo_id', async(req,res) => {
    let { todo_id, user_id } = req.params;
    try{
        let belongsToUser = await Todo.findOne({ user: user_id});
        if(!belongsToUser) return res.status(400).send("Operation not allowed")
        let deleteTodo = await Todo.findByIdAndRemove(todo_id);
        if(deleteTodo) return res.status(200).send({ 
            message: 'Todo deletado com sucesso',
            deleteTodo
        });
    }catch(err) {
        return res.status(400).send(err);
    }
})
//mongodb+srv://<username>:<password>@todo.x32v4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

app.listen(3333, () => console.log(`Server running on port ${PORT}`));