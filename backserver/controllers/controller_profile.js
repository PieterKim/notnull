const Accounts = require('../models/model_accounts');
const Orders = require('../models/model_orders');
const Ratings = require('../models/model_ratings');
const crypto = require('../methods/crypto.js');


exports.getProfile = async (req,res,next)=>{
    try{
        const {email} = req.user;
        const user = await Accounts.findOne({where:{email}});
        res.status(200).json(user);
    }catch(error){
        console.error(error);
        next(error);
    }
}

exports.getOrders = async (req,res,next)=>{
    try{
        const {email} = req.user;
        const userID = await Accounts.findOne({where:{email}});
        const user = await Orders.findAll({where:{account_id:userID.id}, order: [['created_at', 'DESC']]});
        res.status(200).json(user);
    }catch(error){
        console.error(error);
        next(error);
    }
}

exports.modifyPassword = async (req,res,next)=>{
    try{
        if(!req.body.password){
            return res.status(400).json({message:"비밀번호를 입력해주세요."});
        }
        const {password} = req.body;
        const user = await Accounts.findOne({where:{email:req.user.email}});
        const hashedPassword = await crypto(password);
        if(user.password === hashedPassword){
            return res.status(400).json({message:"기존 비밀번호와 동일합니다."});
        }
        await Accounts.update({password:hashedPassword},{where:{email:req.user.email}});
        res.status(200).json({message:"비밀번호 변경 완료"});
    }catch(error){
        console.error(error);
        next(error);
    }
}

