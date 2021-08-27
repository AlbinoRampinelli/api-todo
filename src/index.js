const express = require('express');
const mongoose = require('mongoose');
//const { User } = require('../models/user');
//const { TodoApp } = require('../models/todoApp')
const bodyParser = require('body-parser');
const ObjectId = require('mongoose');
const _ = require('lodash');


const cors = require('cors');
require('dotenv').config()
const PORT = process.env.PORT || 3333;

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express())

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true,  useUnifiedTopology: true}, (err) => {
    if(err) return console.log('erro de conexão com o database');
    console.log('Connected to database')
});

// mongoose.connect(process.env.MONGO_URI, {userNewUrlParser: true, useUnifiedTopology: true}, () => {
//     console.log('Connected to Database')
// })
// mongoose.connect(process.env.MONGO_URI, {
//     useUnifiedTopology: true,
//     useNewUrlParser: true

// }, () => console.log('Connected to database'));


const UserSchema = new mongoose.Schema({ username: String });
const User = mongoose.model('User', UserSchema);

const TodoSchema = new mongoose.Schema({ decription: String, done:Boolean, user: {
    type: mongoose.Schema.Types.ObjectId,
     ref:'User'
}});
const Todo = mongoose.model('TodoApp', TodoSchema);

//let TodoApp = mongoose.model('TodoApp', UserSchema);

//    username: 'albino@dds.com.br'
// });

// newUser.slet newUser = new User({
// ave().then((results) => {
//     console.log('Saved user');
// }).catch((err) => {
//     console.log('Unable to save user', err)
// })

// let User = mongoose.model('User', {
//     email: {
//         type: String,
//         require: true,
//         trim: true,
//         minlenggth: 5
//     }
// });

// let newUser = new User({
//     email:"albino@example.com"
// });
// newUser.save().then((doc) => {
//     console.log('User saved !!!');
// }).catch((err) => {
//     console.log('Unable to save !!', err)
// })

app.post('/session', async (req,res) => {
    const { username } = req.body;
    let user =" ";
    try{
        user = await User.findOne({ username });
        if(!user) {
            user = await User.create({ username })
        }
        return res.status(200).send(user);
    }catch(err) {
        return res.status(400).send(err);
    }
     
});

app.post('/todo/:user_id', async (req,res) => {
    const { description, done } = req.body;
    const { user_id } = req.params;

    try{
        const newTodo = await Todo.create({ description, done, user: user_id });
        return res.status(200).send(newTodo)
    }catch(err) {
        return res.status(400).send(err)
    }

})

/* GET */

app.get('/todo/:user_id', async (req,res) =>{
    const { user_id } = req.params;
    try{
    const allTodos= await Todo.find({ user: user_id })
        res.status(200).send({allTodos});
    } catch(err) {
        res.status(400).send(err);
    }
})

app.patch('/todo/:user_id/:todo_id', async (req,res) => {
    const data = req.body;
    const { todo_id, user_id } = re.params;
    try{
        const belongsTodo = await Todo.findOne({ user: user_id });
        if(!belongsTodo) returnres.status(400).send('Operation is not allowed')
        const updateTodo = await Todo.findByIdAndUpdate(todo_id, data, { new: true});
        return res.status(200).send(updateTodo)
    } catch(err) {
        return res.status(400).send(err)
    }
})
app.delete('/todo/:user_id/:todo_id', async(req, res) => {
    const { todo_id, user_id } = req.params;
    try{
        const belongsTodo = await Todo.findOne({ user: user_id });
        if(!belongsTodo) returnres.status(400).send('Operation is not allowed');
        const deleteTodo = await Todo.findByIdAndDelete(todo_id, data);
        return res.status(200).send({
            message:'Todo deletado com sucesso', 
            deleteTodo
        })
    } catch (err) {
        return res.status(400).send(err);
    }
})
/* POST */
// app.post('/todos', (req,res) => {
//     let todoApp = new TodoApp({
//         text: req.body.text
//     });
//     console.log('todoApp:', todoApp)
//     todoApp.save().then((doc) =>{
//         res.status(200).send(doc);
//     }).catch((err) => {
//         res.status(400).send(err)
//     })
    
// });

// app.post('/todos/:user_id', async(req,res) => {
//     let { description, done } = req.body;
//     let { user_id } = req.params;
//     try{
//         const newTodo = await Todo.create({ description, done, user:user_id });
//         return res.status(200).send(newTodo)
//     }catch(err) {
//         return res.status(400).send(err)
//     }
// });

/* GET ONE */
// app.get('/todos/:todo_id', async(req,res) => {
//     let { todo_id } = req.params;

//     //if(!isValidObjectId(todo_id)) return res.status(400).send();

//     TodoApp.findById({ _id:todo_id }).then((todo)=> {
//         if(!todo) return res.status(400).send();
//         res.status(200).send({todo});
//     }).catch((err) => {
//         res.status(400).send(err);
//     });

//     // try{
//     //     let allTodos = await Todo.find({ user: user_id});
//     //     return res.status(200).send(allTodos)
//     // }catch(err){
//     //     return res.status(400).send(err)
//     // }

// });
// /* PATCH */
// app.patch('/todos/:todo_id', (req,res) => {
//     let body = _.pick(req.body, ['text', 'completed']);
//     let { todo_id } = req.params;
//     console.log('body:', body, 'todo_id:', todo_id)

//     if(_.isBoolean(body.completed) && body.completed){
//         body.completedAt = new Date().getTime();
//         console.log('CompletedAt:', body.completedAt)
//     }else {
//         body.completed = false;
//         body.completedAt = null;
//     }

//     TodoApp.findByIdAndUpdate(todo_id, {$set: body}, { new: true }).then((todo) =>{
//         if(!todo) return res.status(404).send();
//         res.send({todo})
//     }).catch((err) => {
//         res.status(400).send();
//     })

    // try{
        //let belongsToUser = await Todo.findOne({ user: user_id});
        //if(!belongsToUser) return res.status(400).send("Operation not allowed")

    //     let updateTodo = await TodoApp.findByIdAndUpdate(todo_id, data, {new:true});
    //     return res.status(200).send(updateTodo);
    // }catch(err) {
    //     return res.status(404).send(err);
    // } 
//});
/* DELETE */

// app.delete('/todos/:todo_id', (req,res) => {
//     let { todo_id } = req.params;

//     TodoApp.findByIdAndRemove(todo_id).then((todo)=> {
//         if(!todo) return res.status(404).send({todo});
//         res.status(200).send('todo deletado com sucesso...')
//     })

    //if(!ObjectID.isValid(todo_id)) return res.status(400).send();
    //try{
        //let belongsToUser = await TodoApp.findOne({ user: user_id});
        //if(!belongsToUser) return res.status(400).send("Operation not allowed")
    //     let deleteTodo = await TodoApp.findByIdAndRemove(todo_id);
    //     if(deleteTodo) return res.status(200).send({ 
    //         message: 'Todo deletado com sucesso',
    //         deleteTodo
    //     });
    // }catch(err) {
    //     return res.status(400).send(err);
    // }
//})
//mongodb+srv://<username>:<password>@todo.x32v4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));