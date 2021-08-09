const express = require('express');
// We only need the routing methods from express
const router = express.Router();
const bcryptjs = require('bcryptjs');
const UserModel = require('../models/UserModel.js');
const cloudinary = require('cloudinary').v2;

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
        // Check for email
        UserModel
        .findOne({ email: formData.email })
        .then(async(dbDocument) => {
                // Check if email exists
            if (dbDocument){
                res.send('Sorry, an account already exists :(');
                // If email is unique, create account
            } else{
                //If avatar is included, upload to cloudinary
                if(Object.values(req.files).length > 0){
                    const files = Object.values(req.files);
                    // upload to Cloudinary
                    await cloudinary.uploader.upload(
                        files[0].path,
                        (cloudinaryErr, cloudinaryResult) => {
                            if(cloudinaryErr){
                                console.log(cloudinaryErr);
                            }else{
                             // Include the image url in formData   
                              formData.avatar = cloudinaryResult.url;                                                                               
                            }
                        }
                    )
                }                
                
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
                            .then(dbDocument => res.json(dbDocument))
                            .catch(error => console.log(error));
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