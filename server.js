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
// Passport and Passport-JWT for user authetication
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwtSecret = process.env.JWT_SECRET;

// This will tell passport where to find the JWT
// and how to extract the payload
const passportJwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtSecret,
}

// This function will tell passport how what to do
// with the payload.
const passportJwt = (passport) => {
    passport.use(
        new JwtStrategy(
            passportJwtOptions,
            (jwtPayload, done) => {
                // Tell passport what to do with payload
                UserModel
                .findOne({ _id: jwtPayload._id })
                .then(
                    (dbDocument) => {
                        // The done() function will pass the 
                        // dbDocument to Express. The user's 
                        // document can then be access via req.user
                        return done(null, dbDocument)
                    }
                )
                .catch(
                    (err) => {
                        // If the _id or anything is invalid,
                        // pass 'null' to Express.
                        if(err) console.log(err);                        
                        return done(null, null)
                    }
                )
            }
        )
    )
};
passportJwt(passport);

// Middleware
// Parse urlencoded bodies and where the Content-Type header matches the type option
server.use(express.urlencoded({extended: false}));
// Tell express to parse JSON data
server.use(express.json());
// Tell express about external HTTP requests
server.use(cors()); 
// Tell express about express-form-data
server.use(expressFormData.parse());

const mongoose = require('mongoose');
const UserModel = require('./models/UserModel');
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
const PORT = process.env.PORT || 5000;
server.listen(
    PORT, () => {
        console.log(`Server is live on http://localhost:${PORT}`);
    }
)