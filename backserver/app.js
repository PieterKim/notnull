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
    origin: process.env.FRONT_URL,
    credentials: true,
    optionsSuccessStatus: 200
};//cors 설정
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


//라우터 
app.use('/',indexRouter); //mainPage Router
app.use('/admin',adminRouter); //adminPage Router
app.use('/products',productRouter);// 1월1일 productRouter 추가
app.use('/auth',loginRouter); // << 1월4일 /login -> /auth 로 변경 (동진)
app.use('/liqueur',productListRouter);
app.use('/etc',productListRouter);
app.use('/orders',orderRouter);// 1월2일 orderRouter 추가 (누리)
app.use('/profile',profileRouter);
app.use('/post',postRouter);
app.use('/modify',modifyRouter); // 1월7일 추가 동진
app.use('/hdj_verify',hdj_verifyRouter);



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

