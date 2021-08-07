const express = require('express');
// We only need the routing methods from express
const router = express.Router();
const ProductModel = require('../models/ProductModel.js');

router.get('/', 
(req,res) =>{
    ProductModel.find()
    .then(dbDoc => {
        res.json(dbDoc);
    }).catch(err => {
        console.log(err);
    });
});

router.post('/create',
    (req,res) =>{
        // UserModel to create a new document
        ProductModel.create({
            brand: req.body.brand,
            model: req.body.model,
            origin: req.body.origin,
            description: req.body.description,
            color: req.body.color,
            price: req.body.price
        }).then((dbDocument) => res.json(dbDocument))
          .catch((err) => console.log(err));
    }
);

module.exports = router;