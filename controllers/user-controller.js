const bcryptjs = require('bcryptjs');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;
const UserModel = require('../models/UserModel.js');
const cloudinary = require('cloudinary').v2;

function getUsers(req, res){
    UserModel.find().then((dbDocument) => {
        res.json(dbDocument);
    }).catch(() => {
        console.log('user not found')
    });
}

function createUser(req, res){
    const formData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        phoneNumber: req.body.phoneNumber
    }

    UserModel
        .findOne({ email: formData.email }) // for example: jondoe@gmail.com
        .then(
        async (dbDocument) => {
        // If email exists, reject request
        if (dbDocument) {
            res.json({
                status: "unsuccesful",
                message: "Sorry, an account with this email already exists"
            });
        }
        // Otherwise, create the account
        else {
            // If avatar file is included...
            if (Object.values(req.files).length > 0) {
                const files = Object.values(req.files);
                // upload to Cloudinary
                await cloudinary.uploader.upload(
                    files[0].path,
                    (cloudinaryErr, cloudinaryResult) => {
                        if (cloudinaryErr) {
                            console.log(cloudinaryErr);
                        } else {
                            // Include the image url in formData
                            formData.avatar = cloudinaryResult.url;
                        }
                    }
                )
            };

        // Generate a Salt
        bcryptjs.genSalt(
           async (err, theSalt) => {
                // Combine user's password + Salt to hash the password
                await bcryptjs.hash(
                    formData.password,  // first ingredient
                    theSalt,    // second ingredient
                    (err, hashedPassword) => {
                        // Replace the password in the form with the hash
                        formData.password = hashedPassword;
                        // Create the document
                        // Use the UserModel to create a new document
                        UserModel
                        .create(formData)
                        .then(dbDocument => {
                            res.json({
                                dbDocument: dbDocument,
                                status: "successful"
                            });
                        })
                        .catch(error => {
                            console.log(error);
                            res.json({
                                status: "unsuccessful"
                            })
                        });
                    }
                );
            }
        );
    }})
    .catch(err => {
        console.log(err);
        res.json({
            status: "unsuccessful"
        })
    });
}

function loginUser(req, res){
    // Capture form data
    const formData = {
        email: req.body.email,
        password: req.body.password,
    }

    // Check if email exists
    UserModel
    .findOne({ email: formData.email })
    .then(
        (dbDocument) => {
            // If email exists
            if(dbDocument) {
                // Compare the password sent againt password in database
                bcryptjs.compare(
                    formData.password,          // password user sent
                    dbDocument.password         // password in database
                )
                .then(
                    (isMatch) => {
                        // If passwords match...
                        if(isMatch) {
                            // Generate the Payload
                            const payload = {
                                _id: dbDocument._id,
                                email: dbDocument.email
                            }
                            // Generate the jsonwebtoken
                            jwt
                            .sign(
                                payload,
                                jwtSecret,
                                (err, jsonwebtoken) => {
                                    if(err) {
                                        res.json(
                                            {
                                                status: "unsuccessful",
                                            }
                                        );
                                    }
                                    else {
                                        // Send the jsonwebtoken to the client
                                        res.json(
                                            {
                                                status: "successful",
                                                jsonwebtoken: jsonwebtoken,
                                                firstName: dbDocument.firstName,
                                                lastName: dbDocument.lastName,
                                                email: dbDocument.email,
                                                avatar: dbDocument.avatar
                                            }
                                        );
                                    }
                                }
                            )
                        }
                        // If passwords don't match, reject login
                        else {
                            res.send("Wrong email or password");
                        }
                    }
                )
                .catch(
                    (err) => {
                        res.json(
                            {
                                status: "unsuccessful",
                                erorr : err
                            }
                        );
                    }
                )
            }
            // If email does not exist
            else {
                // reject the login
                res.send("Wrong email or password");
            }
        }
    )
    .catch(
        (err) => {
            console.log(err)
        }
    )
}

module.exports = {
    getUsers,
    createUser,
    loginUser
}