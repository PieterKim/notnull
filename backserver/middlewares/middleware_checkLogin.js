const Accounts = require('../models/model_accounts');

exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(200).json({message: 'need login',isLoggedIn:false});
    }
};
exports.isNotLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        next();
    }
    else{
        res.status(403).json({message:'already logged in'});
    }
};
exports.isAdmin = async (req,res,next)=>{
    try{
        if(!req.isAuthenticated()){
            res.status(402).json({message:'need login'});
        }
        const account = await Accounts.findOne({where:{email:req.user.email}});
        if(account.super_admin === true){
            next();
        }
        else{
            res.status(403).json({message:'not admin'});
        }
    }
    catch(error){
        console.log("관리자 권한 확인 실패",error);
        next(error);
    }
    

}