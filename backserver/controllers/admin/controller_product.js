const {sequelize} = require('../../models/model_index.js');
const Products = require('../../models/model_products.js');
const ProductLocations = require('../../models/model_productLocations.js');
const SupplyFactories = require('../../models/model_supplyFactory.js');
const Accounts = require('../../models/model_accounts.js');
const { Op } = require('sequelize');


exports.getProducts = async(req,res,next)=>{
    try{
        const products = await Products.findAll({
            order: [['created_at', 'DESC']]
        });
        res.status(200).json(products);
    }
    catch(error){
        console.log("상품 목록을 불러오는데 실패했습니다.",error);
        next(error);
    }

};

exports.getSpecificProduct = async(req,res,next)=>{
    try{
        const productID = req.params.id;
        const product = await Products.findByPk(productID);
        res.status(200).json(product);
    }
    catch(error){
        console.log("상품 조회에 실패했습니다.",error);
        next(error);
    }
};

exports.modifyProduct = async(req,res,next)=>{
    try{
        const product = req.body;
        product.updated_at = new Date();
        const result = await Products.update(product,{where:{id:product.id}});
        res.status(200).json(result);
    }
    catch(error){
        console.log("상품 수정에 실패했습니다.",error);
        next(error);
    }
};

exports.deleteProduct = async(req,res,next)=>{
    try{
        const product = req.params.id;
        const result = await Products.destroy({where:{id:product}});
        res.status(200).json(result);
    }
    catch(error){
        console.log("상품 삭제에 실패했습니다.",error);
        next(error);
    }
};

exports.addProduct = async(req,res,next)=>{
    try{
        const product = req.body;
        if(!product.created_at){
            product.created_at = new Date();
        }
        if(!product.updated_at){
            product.updated_at = new Date();
        }
        const result = await Products.create(product);
        res.status(200).json(result);
    }
    catch(error){
        console.log("상품 추가에 실패했습니다.",error);
        next(error);
    }
};

exports.getProductLocations = async(req,res,next)=>{
    try{
        const productLocations = await ProductLocations.findAll();
        res.status(200).json(productLocations);
    }
    catch(error){
        console.log("상품 원산지 조회에 실패했습니다.",error);
        next(error);
    }
};

exports.getSupplyFactories = async(req,res,next)=>{
    try{
        const supplyFactories = await SupplyFactories.findAll();
        res.status(200).json(supplyFactories);
    }
    catch(error){
        console.log("상품 공급처 조회에 실패했습니다.",error);
        next(error);
    }
};

exports.uploadDescriptionImage = async(req,res,next)=>{
    try{
        console.log("start uploadDescriptionImage");
        console.log("req.file",req.file);
        const imageUrl = `http://localhost:3000/product_description_imgs/${req.file.filename}`;
        res.status(200).json({imageUrl});
    }
    catch(error){
        console.log("상품 설명 이미지 업로드에 실패했습니다.",error);
        next(error);
    }
};

exports.uploadProductImage = async(req,res,next)=>{
    try{
        console.log("start uploadProductImage");
        const imageUrl = `http://localhost:3000/product_imgs/${req.file.filename}`;
        res.status(200).json({imageUrl});
    }
    catch(error){
        console.log("상품 이미지 업로드에 실패했습니다.",error);
        next(error);
    }
};

exports.updateRecentlyProduct = async(req,res,next)=>{
    try{
        const user = await Accounts.findOne({where:{email:req.user.email}});
        const checkedProduct = req.params.product_id;
        const recentlyProduct = [user.recently_product_1,user.recently_product_2,user.recently_product_3,user.recently_product_4,user.recently_product_5];
        // recentlyProduct에 checkedProduct가 포함되어 있는지 검사
        if (!recentlyProduct.includes(Number(checkedProduct))) {
            // 최근 본 상품 업데이트
            const updatedRecentlyProduct = [checkedProduct, ...recentlyProduct.slice(0, 4)];
            await Accounts.update({recently_product_1:updatedRecentlyProduct[0],recently_product_2:updatedRecentlyProduct[1],recently_product_3:updatedRecentlyProduct[2],recently_product_4:updatedRecentlyProduct[3],recently_product_5:updatedRecentlyProduct[4]},{where:{email:req.user.email}});
            res.status(200).json({message:"최근 본 상품에 추가되었습니다."});
        }
        else{
            res.status(200).json({message:"이미 최근 본 상품에 포함되어 있습니다."});
        }
    }
    catch(error){
        console.log("최근 본 상품 업데이트에 실패했습니다.",error);
        next(error);
    }
};

exports.getRecentlyProductInfo = async(req,res,next)=>{
    try {
        const ids = [req.query.id1, req.query.id2, req.query.id3, req.query.id4, req.query.id5]
            .filter(id => id !== '0');
        console.log('ids',ids);
        if(ids.length === 0){
            res.status(200).send({ message: 'Success', products: [] });
        }
        else{
            const products = await Products.findAll({
                where: {
                    id: {
                        [Op.or]: ids
                    }
                }
            });
            res.status(200).send({ message: 'Success', products });
        }
    } catch (error) {
        console.error(error);
        res.status(400).send({ message: 'Invalid data format' });
    }
};
