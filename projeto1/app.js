require("dotenv").config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

mongoose.connect(`mongodb+srv://ephemmerus000:${process.env.password}@cluster0.l40s0f9.mongodb.net/?retryWrites=true&w=majority`,{
    useNewUrlParser: true,
    useUnifiedTopology:true
});

//SCHEMA books
const bookSchema = new mongoose.Schema({
    title:{type: String, required: true},
    author:{type: String, required: true},
    pageCount:{type: Number, required:true},
});

const Book = mongoose.model('Book', bookSchema);


//JSON

app.get('/', (req,res) => {
    const currentDate = new Date().toISOString();
    const message = 'Hello World';
    res.status(200).json({message,date: currentDate});
});

app.get('/books', async (req,res) => {
    try{
        const books = await Book.find();
        res.json(books);

    }catch(erro){
        res.status(401).json({message: erro.message});
    }
});

app.get('/books/:id',async (req,res) =>{
    try{
        const book = await Book.findById(req.params.id);
        if(!book){
            return res.status(404).json({message: 'Book not found'});
        }
        res.json(book);
    } catch(error){
        res.status(400).json({message: error.message});
    }
});

app.delete('/books/:id', async (req,res) =>{
    try{
        await Book.findByIdAndDelete(req.params.id);
        res.json({message:'Book Deleted'});
    } catch(error){
        res.status(400).json({message: error.message});
    }
});

//middleware
app.use(bodyParser.json());

app.post('/books',async (req,res) =>{
    try{
        const {title, author, pageCount} = req.body;
        const book = new Book({title,author,pageCount});
        await book.save();
        res.status(201).json(book);

    } catch(error){
        res.status(400).json({message: error.message});
    }

});

app.listen(port,() =>{
    console.log('Server is running');
});



