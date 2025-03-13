const express = require('express');
const router = express.Router();
const {getUsers,modifyUser,deleteUser,addAccount} = require('../controllers/admin/controller_account.js');
const {getProducts,modifyProduct,deleteProduct,addProduct,getSpecificProduct,getProductLocations,getSupplyFactories,uploadDescriptionImage,uploadProductImage} = require('../controllers/admin/controller_product.js');
const {descriptionUpload,productUpload} = require('../middlewares/middlewares_imgUpload.js');
const {getOrders} = require('../controllers/admin/controller_order.js');
const {addProductLocation,modifyProductLocation,deleteProductLocation} = require('../controllers/admin/controller_productLocation.js');
const {addSupplyFactory,modifySupplyFactory,deleteSupplyFactory} = require('../controllers/admin/controller_supplyFactory.js');
const {isAdmin} = require('../middlewares/middleware_checkLogin.js');
const {modifyUserRating,deleteUserRating,addUserRating} = require('../controllers/admin/controller_ratings.js');
const {addCoupon,modifyCoupon,deleteCoupon,getCoupons} = require('../controllers/admin/controller_coupon.js');

//사용자 관리
router.get('/users',isAdmin,getUsers);
router.patch('/users',isAdmin,modifyUser);
router.delete('/users/:id',isAdmin,deleteUser);
router.post('/addAccount',isAdmin,addAccount);



//상품 관리(라우터 순서 신경써야함.)
router.get('/products/locations',isAdmin,getProductLocations);
router.get('/products/supplyFactories',isAdmin,getSupplyFactories);

//특정 상품 조회
router.get('/products/:id',getSpecificProduct);

router.get('/products',isAdmin,getProducts);
router.patch('/modifyProduct',isAdmin,modifyProduct);
router.delete('/products/:id',isAdmin,deleteProduct);
router.post('/addProduct',isAdmin,addProduct);

//상품 설명 이미지 업로드
router.post('/upload/descriptionImg',isAdmin,descriptionUpload.single('image'),uploadDescriptionImage);
//상품 이미지 업로드
router.post('/upload/productImg',isAdmin,productUpload.single('image'),uploadProductImage);

//주문 관리
router.get('/orders',isAdmin,getOrders);

//원산지 관리
router.post('/addProductLocation',isAdmin,addProductLocation);
router.patch('/modifyProductLocation',isAdmin,modifyProductLocation);
router.delete('/deleteProductLocation/:id',isAdmin,deleteProductLocation);

//공급처 관리
router.post('/addSupplyFactory',isAdmin,addSupplyFactory);
router.patch('/modifySupplyFactory',isAdmin,modifySupplyFactory);
router.delete('/deleteSupplyFactory/:id',isAdmin,deleteSupplyFactory);

//등급 관리
router.patch('/modifyUserRating',isAdmin,modifyUserRating);
router.delete('/deleteUserRating/:id',isAdmin,deleteUserRating);
router.post('/addUserRating',isAdmin,addUserRating);

//쿠폰 관리
router.get('/coupons',isAdmin,getCoupons);
router.post('/addCoupon',isAdmin,addCoupon);
router.patch('/modifyCoupon',isAdmin,modifyCoupon);
router.delete('/deleteCoupon/:id',isAdmin,deleteCoupon);

module.exports = router;
