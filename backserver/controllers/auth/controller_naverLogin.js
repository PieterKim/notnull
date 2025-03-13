const passport = require('passport');

exports.naverLogin = passport.authenticate('naver');

exports.naverCallback = passport.authenticate('naver', {
    successRedirect: 'http://localhost:8080?success=true',
    failureRedirect: 'http://localhost:8080?success=false',
});