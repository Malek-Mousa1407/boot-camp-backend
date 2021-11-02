const ProductModel = require('../models/ProductModel.js');

function getProducts(req, res){
    ProductModel.find()
    .then(dbDoc => {
        res.json(dbDoc);
    }).catch(err => {
        console.log(err);
    });
}

function createProduct(req, res){
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

module.exports = {
    getProducts,
    createProduct
}