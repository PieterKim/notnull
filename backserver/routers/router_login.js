const express = require('express');
const router = express.Router();
const Accounts = require('../models/model_accounts.js');
const {isNotLoggedIn,isLoggedIn} = require('../middlewares/middleware_checkLogin.js');
const {localLogin,logout} = require('../controllers/auth/controller_login.js');
const {kakaoLogin,kakaoCallback} = require('../controllers/auth/controller_kakaoLogin.js');
const {naverLogin,naverCallback} = require('../controllers/auth/controller_naverLogin.js');
const {addAccount} = require('../controllers/admin/controller_account.js');

//회원가입
router.post('/signup',isNotLoggedIn,addAccount);

//로컬 로그인
router.post('/',isNotLoggedIn,localLogin);

//로그인 상태 체크
router.get('/check',async (req, res) => {
    // 세션 상태를 로그로 확인
    if (req.isAuthenticated() && req.user) {
        const account = await Accounts.findOne({where:{email: req.user.email}});
        const sendData = {
            isLoggedIn: true,
            isAdmin: account.super_admin,
            user: req.user,
        };
        res.status(200).json(sendData);
    } else {
        res.status(200).json({
            isLoggedIn: false,
            isAdmin: false,
            user: null
        });
    }
});


//카카오 로그인
router.get('/kakao',isNotLoggedIn,kakaoLogin);
router.get('/kakao/callback',kakaoCallback);

//네이버 로그인
router.get('/naver',isNotLoggedIn,naverLogin);
router.get('/naver/callback',naverCallback);

//로그아웃
router.post('/logout',isLoggedIn,logout);


module.exports = router;
