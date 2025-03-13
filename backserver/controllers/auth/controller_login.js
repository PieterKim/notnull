const dotenv = require('dotenv');
dotenv.config();
const passport = require('passport');

exports.localLogin = async (req,res,next)=>{ //여기서 받은 데이터를 
    if(req.body.email === '' || req.body.password === '' || !req.body.email || !req.body.password){
        return res.status(401).json({message:'login failed, 이메일과 비밀번호를 모두 입력해주세요'});
    }
    passport.authenticate('local',(authError,user,info)=>{//여기서 우리가 만든 local이라는 로그인 인증 방식으로 가서 확인 후에 done에 있는 파라미터가 여기에(authError,user,info) 똑같이 들어옴.
                                //passport 를 통한 로그인. 첫번째 인자는 전략(우리가 만들어줘야 함. 예를 들어 암호화 등을 어떻게 처리했는지 적용해 줘야함.), 두번째 인자는 콜���함수()
        console.log('login user',user);
        if(authError){//에러 발생 시 처리문
            console.error(authError);
            return next(authError);
        }
        if(!user){//login에 필요한 유저 정보가 없는 경우 처리문
            return res.status(401).json({message:info.message});
        }
        return req.login(user,(loginError)=>{//로그인이 돼서 로그인 정보가 있으면 로그인 정보를 세션에 저장해줌.
            if(loginError){
                return next(loginError);
            }
            return res.status(200).json({message:'login success'});
        });
    })(req,res,next);
}


//로그아웃
exports.logout = (req, res) => {
    req.logout((error) => {
        if(error) {
            console.error(error);
            return res.status(401).json({message:'logout failed'});
        }
        req.session.destroy((err) => {
            if(err) {
                console.error(err);
                return res.status(401).json({message:'session destroy failed'});
            }
            res.clearCookie('connect.sid')  // 세션 쿠키 제거
                .status(200).json({message:'logout success'});  // 메서드 체이닝으로 리다이렉트
        });
    });
}