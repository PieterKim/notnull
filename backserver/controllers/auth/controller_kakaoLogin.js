const passport = require('passport');

exports.kakaoLogin = passport.authenticate('kakao');

exports.kakaoCallback = passport.authenticate('kakao', {
    successRedirect: 'http://localhost:8080?success=true',
    failureRedirect: 'http://localhost:8080?success=false',
});