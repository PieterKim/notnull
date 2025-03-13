const express = require('express');
const router = express.Router();
const Accounts = require('../models/model_accounts');

router.post('/',async(req,res,next)=>{
    try{
        const {id,email,name,nickname,address,addressNumber,addressDetail} =req.body
        req.session.user = {id,email,name,nickname,address,addressNumber,addressDetail}
        res.status(200).json({message:'유저 정보 저장 완료'})
    }catch(err){
        console.error(err)
        next(err)
    } 
})

router.get('/',async(req,res,next)=>{
    try{
        const sessionUser = req.session.user;
        const user = await Accounts.findOne({where:{email:sessionUser.email}})
        res.status(200).json(user)
    }catch(err){
        console.error(err)
        next(err)
    }
})



module.exports = router;