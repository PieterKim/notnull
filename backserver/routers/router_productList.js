const express = require('express')
const router = express.Router();
const {getProducts,getProductKind,searchProducts,getDrinkTpye,searchDrinks} =require('../controllers/productList/controller_productList')

//전체 상품리스트 조회
router.get('/liqueur',getProducts);

//주류별 상품리스트 조회
router.get('/liqueur/:drink_type',getDrinkTpye);

//상품 품목별 상품리스트 조회
router.get('/:product_kind',getProductKind);

//검색결과 상품리스트 조회
router.get('/liqueur/search',searchProducts);

module.exports = router;
