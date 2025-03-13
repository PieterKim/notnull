const express = require('express')
const router = express.Router();

const {sequelize} = require('../models/model_index')
// const Products = require('../models/model_products') // const {Products,ProductLocations} = require('../models/model_index') 오 불러오는중
// const ProductLocations = require('../models/model_productLocations')
const {Products,ProductLocations} = require('../models/model_index')
const {Op} = require('sequelize');
const Accounts = require ('../models/model_accounts');
const Carts = require ('../models/model_buckets');
const {isLoggedIn} = require('../middlewares/middleware_checkLogin.js');
const {updateRecentlyProduct,getRecentlyProductInfo} = require('../controllers/admin/controller_product.js');

// 최근 본 상품 업데이트
router.patch('/recently/:product_id',isLoggedIn,updateRecentlyProduct);

// 최근 본 상품 조회(순서 주의)
router.get('/recentlyProductInfo',isLoggedIn,getRecentlyProductInfo);

     // ##################  const wish = require ('') wish 모델은 어떻게 불러와야하지?? ////

router.get('/:product_id',async(req,res,next)=>{
    try{
        const {product_id} = req.params;
        const selectedProduct = await Products.findOne({where:{id:product_id}})
        res.status(200).json(selectedProduct)
        //console.log(`해당 프로덕트의 상세페이지 뷰를 보여줄거야. ${selectedProduct}`)
    }catch(err){
        console.error(err)
        next(err)
    }
});


router.get('/:product_id/recommend',async(req,res,next)=>{
    try{
        const {product_id} = req.params;
        //console.log(`레커멘드 기준이 될 product_id ${product_id}`);
        const currentProduct = await Products.findOne({
            where:{id:product_id},
            include:[
                {
                    model:ProductLocations,
                },
            ]
        });

        if(!currentProduct){
            return res.status(404).json({message:"상품이 존재하지 않습니다"})
        }

        const recommend = await Products.findAll({
            where: {
                product_kind: currentProduct.product_kind,
                id:{[Op.ne]:product_id} // 현재 상품 제외
            },
            limit: 4, // 4개만 가져오기
            attributes:['id','product_name','product_price','product_image'], // 필요한 속성만 가져오기
            order: sequelize.literal('rand()') // 랜덤으로 가져오기
        })
        res.status(200).json(recommend)
    }catch(err){
        console.error(err)
        next(err)
    }
});






module.exports = router;