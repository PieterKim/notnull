const dotenv = require('dotenv');
dotenv.config();

//module import
const express = require('express');
const {sequelize} = require('./models/model_index.js');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const passportSetting = require('./methods/passportSetting.js');
const schedule = require('node-schedule');
const { Op } = require('sequelize');
//router import
const indexRouter = require('./routers/router_index.js');
const adminRouter = require('./routers/router_admin.js');
const productRouter = require('./routers/router_products.js');// 1월1일 productRouter 추가
const productListRouter = require('./routers/router_productList.js');
const loginRouter = require('./routers/router_login.js');
const orderRouter = require('./routers/router_orders.js');// 1월2일 orderRouter 추가 (누리)
const profileRouter = require('./routers/router_profile.js');
const postRouter = require('./routers/router_post.js');
const modifyRouter = require('./routers/router_modiuser.js') // 1월7일 유저 정보 수정 router 추가
const Accounts = require('./models/model_accounts.js');
const hdj_verifyRouter = require('./routers/router_hdjVerify.js');


//서번 생성
const app = express();
app.set('port',process.env.PORT);

//데이터베이스 연결
sequelize.sync({force:false})
.then(()=>{
    console.log('데이터베이스 연결 성공');
    // 매 자정마다 실행되도록 수정
    schedule.scheduleJob('0 0 * * *', async () => {
        try {
            const currentDate = new Date();
            await Accounts.destroy({
                where: {
                    delete_time: {
                        [Op.lt]: currentDate
                    }
                }
            });
            console.log('만료된 데이터 삭제 완료:', currentDate);
        } catch (error) {
            console.error('스케줄러 실행 중 오류 발생:', error);
        }
    });
})
.catch((error)=>{
    console.log('데이터베이스 연결 실패');
    console.error(error);
});

//미들웨어 
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use('/',express.static(path.join(__dirname,'uploads')));
const corsOptions = {
    origin: process.env.FRONT_URL || "http://54.180.150.135",  // 기본값 추가
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
passportSetting.passportSetting();
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave:false,
    saveUninitialized:false,
    secret:process.env.COOKIE_SECRET,
    cookie:{
        httpOnly:true,
        secure:false,
        maxAge:60*1000*60*24,//1day
    }
}));//session 설정
app.use(passport.initialize());
app.use(passport.session());


// 라우터 설정 (API 엔드포인트 수정)
app.use('/api', indexRouter);  // MainPage Router
app.use('/api/admin', adminRouter);  // AdminPage Router
app.use('/api/products', productRouter);  // Product API (1월1일 추가)
app.use('/api/auth', loginRouter);  // 로그인 API (1월4일 /login -> /auth 변경)
app.use('/api/liqueur', productListRouter);  // 상품 리스트
app.use('/api/etc', productListRouter);  // 기타 상품
app.use('/api/orders', orderRouter);  // 주문 API (1월2일 추가)
app.use('/api/profile', profileRouter);  // 유저 프로필
app.use('/api/post', postRouter);  // 게시판 API
app.use('/api/modify', modifyRouter);  // 유저 정보 수정 API (1월7일 추가)
app.use('/api/hdj_verify', hdj_verifyRouter);  // 추가 인증 관련 API




//404 에러 처리
app.use((req,res,next)=>{
    res.status(404).send('Router Not Found');
});

//500 에러 처리
app.use((err,req,res,next)=>{
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});


app.listen(app.get('port'),()=>{
    console.log(app.get('port'),'번 포트에서 대기중');
});

