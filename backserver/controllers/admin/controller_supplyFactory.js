const {sequelize} = require('../../models/model_index.js');
const SupplyFactory = require('../../models/model_supplyFactory.js');

const getSupplyFactories = async (req,res) => {
    const factories = await SupplyFactory.findAll();
    res.status(200).json(factories);
}

const addSupplyFactory = async (req,res) => {
    const factory = req.body;
    await SupplyFactory.create(factory);
    res.status(201).send();
}

const modifySupplyFactory = async (req,res) => {
    const factory = req.body;
    await SupplyFactory.update(factory,{where:{id:factory.id}});
    res.status(200).send();
}

const deleteSupplyFactory = async (req,res) => {
    const {id} = req.params;
    await SupplyFactory.destroy({where:{id}});
    res.status(204).send();
}

module.exports = {getSupplyFactories,addSupplyFactory,modifySupplyFactory,deleteSupplyFactory};
