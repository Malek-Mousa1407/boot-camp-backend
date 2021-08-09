const express = require('express');
// We only need the routing methods from express
const router = express.Router();
const bcryptjs = require('bcryptjs');
const UserModel = require('../models/UserModel.js');

router.get('/',
    (req, res) => {
        UserModel.find().then((dbDocument) => {
            res.json(dbDocument);
        }).catch(() => {
            console.log('user not found')
        });
    }
);

router.post('/create',
    (req, res) => { 
        const formData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            phoneNumber: req.body.phoneNumber
        }
        // If email is unique, create account
        UserModel
        .findOne({ email: formData.email })
        .then((dbDocument) => {
                // Check if email exists
            if (dbDocument){
                res.send('Sorry, an account already exists :(');
                // Otherwise, reject the request
            } else{
                // Generate a salt
                bcryptjs.genSalt(
                    (err, theSalt) => {
                    // Combine the user's password + Salt to hash the password
                    bcryptjs.hash(
                        formData.password,
                        theSalt,
                        (err, hashedPassword) => {
                            // Replace the password in the form with the hash
                            formData.password = hashedPassword;
                            // Create a new user account with hashed password
                            UserModel
                            .create(formData)
                            .then((dbDocument) => res.json(dbDocument))
                            .catch((error) => console.log(error));
                        }
                    )
                });              
            }
        }).catch((err) =>{
            console.log(err);   
        });
    }
);

module.exports = router;