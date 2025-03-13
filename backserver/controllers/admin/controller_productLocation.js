const {sequelize} = require('../../models/model_index.js');
const ProductLocation = require('../../models/model_productLocations.js');

const getProductLocations = async (req,res) => {
    const locations = await ProductLocation.findAll();
    res.status(200).json(locations);
}

const addProductLocation = async (req,res) => {
    const location = req.body;
    await ProductLocation.create(location);
    res.status(201).send();
}

const modifyProductLocation = async (req,res) => {
    const location = req.body;
    await ProductLocation.update(location,{where:{id:location.id}});
    res.status(200).send();
}

const deleteProductLocation = async (req,res) => {
    const {id} = req.params;
    await ProductLocation.destroy({where:{id}});
    res.status(204).send();
}

module.exports = {getProductLocations,addProductLocation,modifyProductLocation,deleteProductLocation};