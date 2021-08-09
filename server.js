// Import the express function.
const express = require('express');
// This will make 'server' an object with methods 
// for server operations
const server = express();
// Tell express to accept external HTTP requests
const cors = require('cors');
// dotenv will allow express to access enviroment variables
require('dotenv').config();
// Cloudinary is the CDN (Content Delivery Network)service
const cloudinary = require('cloudinary').v2;
// express-form-data will allow files to be sent
const expressFormData = require('express-form-data');
// Import application routes 
const userRoutes = require('./routes/user-routes');
const productRoutes = require('./routes/product-routes.js');

// Parse urlencoded bodies and where the Content-Type header matches the type option
server.use(express.urlencoded({extended: false}));
// Tell express to parse JSON data
server.use(express.json());
// Tell express about external HTTP requests
server.use(cors()); 
// Tell express about express-form-data
server.use(expressFormData.parse());

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

// Configure cloudinary
cloudinary.config(
    {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_SECRET
    }
)


// A method to process a GET HTTP request.
// server.get(route, callbackFunction)
server.get('/', (req, res) =>  res.send("<h1>Welcome Home</h1>"));

server.use('/users', userRoutes);
server.use('/products', productRoutes);

// The .listen() will connect the server to an available Port
// server.listen(portNumber, callbackFunction)
const PORT = process.env.PORT || 3001;
server.listen(
    PORT,
    () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    }
)