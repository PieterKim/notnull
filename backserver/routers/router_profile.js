const express = require('express');
const router = express.Router();
const {isLoggedIn} = require('../middlewares/middleware_checkLogin.js');
const {getProfile,modifyPassword} = require('../controllers/controller_profile.js');
const {getRatings,getSpecificUserRating} = require('../controllers/admin/controller_ratings.js');
const {getSpecificUserPosts} = require('../controllers/post/controller_post.js');
const {dropOutUser,modifyUser,cancleDropOut} = require('../controllers/admin/controller_account.js');
const {getSpecificUserCoupons} = require('../controllers/coupon/controller_coupon.js');

router.get('/',isLoggedIn,getProfile);
router.get('/ratings',isLoggedIn,getRatings);
router.get('/userRating',isLoggedIn,getSpecificUserRating);
router.get('/posts',isLoggedIn,getSpecificUserPosts);
router.get('/coupons',isLoggedIn,getSpecificUserCoupons);
router.patch('/dropOut',isLoggedIn,dropOutUser);
router.patch('/cancleDropOut',isLoggedIn,cancleDropOut);
router.patch('/modifyUser',isLoggedIn,modifyUser);
router.patch('/modifyPassword',isLoggedIn,modifyPassword);

module.exports = router;
