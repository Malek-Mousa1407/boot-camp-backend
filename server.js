// Import the express function.
const express = require('express');
// This will make 'server' an object with methods 
// for server operations
const server = express();
// Tell express to accept external HTTP requests
const cors = require('cors');
// dotenv will allow express to access enviroment variables
require('dotenv').config();
// Import application routes 
const userRoutes = require('./routes/user-routes');
const productRoutes = require('./routes/product-routes.js');

server.use(express.urlencoded({extended: false}));
server.use(express.json());
server.use(cors()); 

const mongoose = require('mongoose');
const connectionString = process.env.MONGODB_CONNECTION_STRING;
const connectionConfig = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

mongoose.connect(connectionString,connectionConfig).then(() => {
    console.log('DB is connected!')
}).catch((error) => {
    console.log('error occured',error);
});

// A method to process a GET HTTP request.
// server.get(route, callbackFunction)
server.get('/', (req, res) =>  res.send("<h1>Welcome Home</h1>"));

server.use('/users', userRoutes);
server.use('/products', productRoutes);

// The .listen() will connect the server to an available Port
// server.listen(portNumber, callbackFunction)
const PORT = process.env.PORT || 5000;
server.listen(
    PORT,
    () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    }
)