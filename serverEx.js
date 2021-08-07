// Import the express function.
const express = require('express');
// This will make 'server' an object with methods 
// for server operations

const server = express();
const ProductModel = require('./models/ProductModel.js');
const mongoose = require('mongoose');

const connectionString = "mongodb+srv://admin01:Malek2006@cluster0.hjhnv.mongodb.net/astro_jul2021?retryWrites=true&w=majority";
const connectionConfig = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

mongoose.connect(connectionString,connectionConfig)
.then(() => {
    console.log('DB is connected!');
}).catch((err) =>{
    console.log(err);
});

server.post('/products', (req,res) => {
    ProductModel.create({
        brand: "Sony",
        model: "Playstation",
        description: "Best gaming console!",
        color: "White",
        origin: "Japan",
        price: 4000
    })
    .then((doc) => {
        res.send(doc);
    })
    .catch((err) =>{
        console.log(err);
    });
});

server.listen(5000, () =>{
    console.log('Server is live on http://localhost:5000');
});