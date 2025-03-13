const express = require('express')
const router = express.Router();
const multer = require('multer');
const Accounts = require ('../models/model_accounts');
const Carts = require ('../models/model_buckets');
const Products = require ('../models/model_products');
const Wishes = require ('../models/model_wishes');
const Orders = require ('../models/model_orders');
const HasCoupon = require('../models/model_haveCoupons.js');
const Ratings = require('../models/model_ratings');

const OrderStatuses = require('../models/model_orderStatuses');
const {Op} = require('sequelize');
const {modifyOrder, cancelOrder} = require('../controllers/admin/controller_order');

// http://localhost:3000/orders


//마이 페이지 post 를 받아오는 라우터 작성 1월5일 동진
router.post('/', async(req,res,next)=>{
    try{
        const {id,email,nickname,ratingPoint,rating_id} = req.body // 마이페이지에서 post로 보낸 data 를 파싱
        // 파싱한 data 를 req.session.user 객체에 저장하여 세션에 유지
        req.session.user = {id,email,nickname,ratingPoint,rating_id}; 
        res.status(200).json({message:'유저 정보 저장 완료'})
    }catch(err){
        console.error(err)
        next(err)
    }
})

//오더뷰 에서 유저 정보를 받아오는 get 라우터 작성 1월 5일 동진
router.get('/',async(req,res,next)=>{
    try{
        //세션에 저장된 유저 정보를 가져와 해당 변수에 저장
        const sessionUser = req.session.user;
        // Accounts 테이블에서 세션에 저장된 email 기준으로 유저 정보를 조회
        const user = await Accounts.findOne({where:{email:sessionUser.email}})
        res.status(200).json(user)
    }catch(err){
        console.error(err)
        next(err)
    }
})

// Wishes CREATE
router.post('/wish', async (req, res, next) =>{
    const {userId, product_Id} = req.body;
    try {
    //FK값이 해당 테이블에 데이터 있는지 확인
        
        const user = await Accounts.findByPk(userId);
        const targetProduct = await Products.findByPk(product_Id);
        //console.log(`######################백 라우터.포스트.userId : ${user}, product_Id: ${targetProduct}`)
        if(!user || !targetProduct) {
            return res.status(404).json({message:"없는 유저거나 없는 상품임"})
        }
    
        // wishes 테이블에 데이터 들어가는거 확인! 

            // 여기서 user과 targetProduct의 조합이 고유하지 않은 경우 ""중복이기때문에 오류""남. 여기서 오류 잡아줘.
        const duplicateErrorCatch = await Wishes.findOne({
            where : {
                account_id : user.id,
                product_id: targetProduct.id,
            } });
        if(duplicateErrorCatch) {
            return res.status(409).json({message : '이미 찜한거라고'});
        }
            // Wishes DB 에 product data 추가
        await Wishes.create({
            account_id: user.id,
            product_id: targetProduct.id, 
        });
        return res.status(201).json({message: "찜에 추가됨"});
                //201 : 찜 데이터 생성 성공 (Created)

    }catch(err){
        console.error(err);
        next(err);
    }
})

// Wishes (-Products) READ
// user의 wish에 있는 product id를 찾고, 해당 id에 맞는 product data를 프론트로 던지기
router.get('/wish/:userid', async (req, res, next) => {
    try{
        //1. user의 wish DB 가져오기기
        const {userid} = req.params;
        const userWishes = await Wishes.findAll({where : {account_id : userid}});// userid에 해당하는 wishes 객체 모두 불러오기
        
        //2. 거기서 product id 뽑고, 일치하는 product data를 front에 전달.
        const productPromises = userWishes.map(async (userWish) => {
            return await Products.findOne({where : {id : userWish.product_id}}) 
            // 모든 Wishes 객체와 연계된 product객체를 찾기. (map 함수 :각 배열의 요소에 함수를 적용하여 새로운 배열 반환.)
            //ProductPromises는 (findOne은 비동기함수) promise 상태를 반환(pending, fulfilled, rejected중 하나.)
        })
        const wishedProducts = await Promise.all(productPromises); //promise.all() 함수는 각 Promise가 해결될 때까지 기다리고 이행 후 결괏값을 가져옴.
        res.status(200).json(wishedProducts); 

    } catch(err){
        console.error(err);
        next(err);
    }
})


// Wishes DELETE
router.delete('/wish/:productid', async (req, res, next) => {
    try {
        const {productid} = req.params;
        const result = await Wishes.destroy({where : {product_id : productid}});
        res.status(200).json(result);
    }catch(err) {
        console.error(err);
        next(err);
    }
})

//Cart UPDATE

//Cart CREATE + UPDATE
router.post('/cart', async(req, res, next) => {
    // userId, product_Id, quantity 받았는지 확인
    const {userId, product_Id, quantity} = req.body;
    console.log(`##########################userId${userId},product_Id ${product_Id},quantity${quantity}`)
    try{
        //FK값이 해당 테이블에 데이터 있는지 확인
        const user = await Accounts.findByPk(userId);
        console.log(`##########################user${JSON.stringify(user)}`)
        const CartProduct = await Products.findByPk(product_Id);
        if(!user || !CartProduct) {
            return res.status(404).json({message:"없는 유저거나 없는 상품임"})
        }

        //cart 테이블에 데이터 생성
        const duplicateCatch = await Carts.findOne({where : {product_id : product_Id, account_id : userId }});
        if(!duplicateCatch){
            await Carts.create({
                account_id : user.id,
                product_id : CartProduct.id,
                count : quantity,
                total_price : CartProduct.product_price * quantity,
            });
            res.status(201).json({message: "장바구니 추가됐다. 장바구니 갈래?"})
        }else{
            //count 업데이트
            const updatedCount = duplicateCatch.count + quantity;
            const updatedTotal = updatedCount * CartProduct.product_price;
            await Carts.update(
                {count : updatedCount, total_price: updatedTotal},
                {where : {product_id : product_Id}}
            );
            res.status(200).json({message:"장바구니에 같은 제품이 있어 수량이 추가되었습니다."})
        }


    }catch(err){
        console.error(err);
        next(err);
}
})

//Cart READ
router.get('/cart/:userid', async(req, res, next) => {
    try{
        const{userid} = req.params;
        const cartList = await Carts.findAll({where : {account_id : userid}, include:{model:Products, attributes : ['id', 'product_name', 'product_price', 'product_image']}});
        const addCartIdCartList = cartList.map(cartItem => {
            cartItem.cart_id = cartItem.id; // id를 cart_id로 변경
            return cartItem;
        });

       
        res.status(200).json(addCartIdCartList);
    }catch(err) {
        console.error(err);
        next(err);
    }
})

//Cart DELETE
router.delete('/cart', async (req, res, next) =>{
    try{
        const {ids} = req.body; 
        console.log(`##################cartedProduct_id${ids}`)
        const result = await Carts.destroy({where : {id : ids}});
        res.status(200).json(result);

    }catch(err) {
        console.error(err);
        next(err);
    }
})

// MAKE ordering List FROM product view
router.get('/ordering/:infoFromProductView', async (req, res, next)=>{
    try{
        const {infoFromProductView} = req.params; //{"id":9,"count":1}
        const parsedInfo = JSON.parse(infoFromProductView);
        const result = await Products.findOne({where : {id :parsedInfo.id}})
        parsedInfo.Product = result;
        res.status(200).json(parsedInfo);
    }catch(err){
        console.error(err);
        next(err);
    }
})

// Order CREATE
router.post('/order', async (req, res, next) => {
    let transaction; // transaction 변수를 try-catch 블록 외부에서 선언
    try {
        const orderInfos = req.body.orderInfos;
        const hasCoupon = req.body.hasCouponId;
        const totalPaymentAmount = req.body.totalPaymentAmount;
        console.log("##########################totalPaymentAmount",totalPaymentAmount);
        const user = await Accounts.findOne({where : {email : req.user.email}});
        const UserRating = await Ratings.findOne({where : {id : user.rating_id}});
        const saveMoney = Math.ceil(totalPaymentAmount * UserRating.saved_money_rate);
        console.log("##########################saveMoney",saveMoney);
        for(const info of orderInfos){
            if (!info.count || !info.account_id || !info.product_id || !info.address) {
                throw new Error("누락된 필수 주문 정보가 있습니다.");
            }
            if(info.cart_id){
                await Carts.destroy({where : {id : info.cart_id}})
            }
            await Orders.create({
                count : info.count,
                account_id : info.account_id,
                product_id : info.product_id,
                address : info.address,              
                addressDetail : info.addressDetail,
                addressNumber : info.addressNumber,
                orderMessage : info.orderMessage,
                payment_id : info.payment_id,
            });
            const cartId = await Carts.findOne({where : {account_id : info.account_id, product_id : info.product_id}});
            if(cartId){
                await Carts.destroy({where : {id : cartId.id}});
            }
        }
        if(hasCoupon){
            await HasCoupon.destroy({where : {coupon_id : hasCoupon.coupon_id,account_id : hasCoupon.account_id}});
        }
        if(req.body.usePoint > 0){
            console.log("usePoint:",req.body.usePoint);
            
            const changedPoint = user.savedMoney - req.body.usePoint + saveMoney;
            console.log("changedPoint:",changedPoint);
            await Accounts.update({savedMoney : changedPoint}, {where : {email : req.user.email}});
        }
        else{
            const changedPoint = user.savedMoney + saveMoney;
            console.log("changedPoint:",changedPoint);
            await Accounts.update({savedMoney : changedPoint}, {where : {email : req.user.email}});
        }
        res.status(201).json({ message: "모든 주문이 성공적으로 처리되었습니다." });
        
    }catch(err){
        if (transaction) {
            await transaction.rollback(); 
        }
        console.error(err);
        next(err);
    }
})

//Order READ
router.get('/order/:userid', async (req, res, next) => {
    try {
        const {userid} = req.params;

        
        const orderList = await Orders.findAll(
            {where : {account_id : userid},
            include : [
                {model:Products, attributes : ['product_name', 'product_image', 'product_price']},
                {model: OrderStatuses, attributes : ['status']},
            ]
        }); 
        

        res.status(200).json(orderList);
    }catch(err){
        console.error(err);
        next(err);
    }
})

//Order UPDATE
router.patch('/cancelledOrder/:userid', async (req, res, next) => {
    try{
        const {cancelingOrderId} = req.body;

        await Orders.update ({status_id : 6, updateted_at : new Date()}, {where : {id : cancelingOrderId }});
        res.status(200).json()
    }catch(err){
        console.error(err);
        next(err);
    }
})



//Order - cancelled READ
router.get('/cancelledOrder/:userid', async (req, res, next) => {
    try {
        const {userid} = req.params;
        const orderList = await Orders.findAll(
            {where : {account_id : userid},
            include : [{model:Products, attributes : ['product_name', 'product_image', 'product_price']},{model: OrderStatuses, attributes : ['status', 'id']},
            ],
        }); 
        res.status(200).json(orderList);
    }catch(err){
        console.error(err);
        next(err);
    }
})

// Order UPDATE
router.patch('/modify', modifyOrder);

// Order CANCEL
router.patch('/cancel', cancelOrder);



module.exports = router;