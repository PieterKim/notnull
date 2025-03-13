const passport = require('passport');
const Accounts = require('../models/model_accounts.js');
const LocalStrategy = require('passport-local').Strategy;
const KakaoStrategy = require('passport-kakao').Strategy;
const NaverStrategy = require('passport-naver').Strategy;
const crypto = require('./crypto.js');

exports.passportSetting = ()=>{
    //인증 전략 
    passport.use(new LocalStrategy({ //passport-local 객체 생성, 이렇게 만들어서 아래 login 메서드에서 passport.authenticate('local')로 호출했을 때 이 객체가 호출되는 것.
        //인증 방식을 사용할 때 지금처럼 인증 객체를 생성해서 해당 객체를 통해 인증 방식을 사용할 수 있음.
        usernameField:'email', //사용자 id
        passwordField:'password', //사용자 password
        passReqToCallback:false, //callback 함수에 req 객체 전달 안함.
    },async (email,password,done)=>{//done-> passport 에서 next역할
        console.log('strategy email',email);
        console.log('strategy password',password);
        try{
            //id로 회원 찾기
            const user = await Accounts.findOne({where:{email:email}});//가입 회원 찾기
            console.log('strategy user',user);
            if(!user){
                return done(null,false,{message:'가입되지 않은 회원'});//passport내장 콜백 메서드 done(error(error|null), user(obj|false), info(obj|false))
            }

            //비밀번호 검증
            const hash = await crypto(password);
            if(user.password != hash){
                return done(null,false,{message:'비밀번호가 일치하지 않음'});
            }
            return done(null,user);
        }
        catch(error){
            console.error(error);
            return done(error);
        }
    }));

    passport.use( new KakaoStrategy({
        clientID: process.env.KAKAO_CLIENT_ID,
        callbackURL: process.env.KAKAO_REDIRECT_URI,
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            console.log('kakao profile',profile);
            // 카카오 계정 정보로 사용자 조회
            const exUser = await Accounts.findOne({
                where: { 
                    email: profile._json.kakao_account.email,
                }
            });

            if (exUser) {
                // 기존 사용자가 있다면 그대로 반환
                return done(null, exUser);
            } else {
                // 새로운 사용자 생성
                const newUser = await Accounts.create({
                    email: profile._json.kakao_account.email,
                    nickname: profile.displayName || profile._json.properties.nickname,
                });
                return done(null, newUser);
            }
        } catch(error) {
            console.error(error);
            return done(error);
        }
    }));

    passport.use(new NaverStrategy({
        clientID: process.env.NAVER_CLIENT_ID,
        clientSecret: process.env.NAVER_CLIENT_SECRET,
        callbackURL: process.env.NAVER_REDIRECT_URI,
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            console.log('naver profile',profile);
            // 네이버 계정 정보로 사용자 조회 또는 생성
            const exUser = await Accounts.findOne({
                where: { 
                    email: profile.emails[0].value,
                }
            });

            if (exUser) {
                // 기존 사용자가 있다면 그대로 반환
                return done(null, exUser);
            } else {
                // 새로운 사용자 생성
                const newUser = await Accounts.create({
                    email: profile.emails[0].value,
                    nickname: profile.displayName,
                });
                return done(null, newUser);
            }
        } catch(error) {
            console.error(error);
            return done(error);
        }
    })
    );

    //passport 세션 저장 및 복원
    passport.serializeUser((user, done) => {
        // 각 전략별로 이메일 필드 위치가 다를 수 있으므로 처리
        let email;
        if (user.provider === 'kakao') {
            email = user._json.kakao_account.email;
        } else if (user.provider === 'naver') {
            email = user.emails[0].value;
        } else {
            // local 전략의 경우
            email = user.email;
        }
        done(null, email);
    });
    // 세션에서 이메일을 기반으로 사용자 정보 복원
    passport.deserializeUser(async (email, done) => {
        try {
            // DB에서 해당 이메일로 사용자 조회
            // 예시: const user = await User.findOne({ email: email });
            // 실제 구현시에는 데이터베이스 조회 로직을 추가해야 합니다
            const user = { email: email };
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
}