const Ratings = require('../../models/model_ratings');
const Accounts = require('../../models/model_accounts');

exports.getRatings = async (req,res,next)=>{
    try{
        const ratings = await Ratings.findAll();
        res.status(200).json(ratings);
    }catch(error){
        console.error(error);
        next(error);
    }
}

exports.getSpecificUserRating = async (req,res,next)=>{
    try{
        const {email} = req.user;
        const userId = await Accounts.findOne({where:{email}});
        const rating = await Ratings.findOne({where:{id:userId.rating_id}});
        res.status(200).json({rating:rating.rating_name});
    }catch(error){
        console.error(error);
        next(error);
    }
}

exports.modifyUserRating = async (req,res,next)=>{
    try{
        const {id,rating_name,saved_money_rate} = req.body;
        await Ratings.update({rating_name,saved_money_rate},{where:{id}});
        res.status(200).json({message:"등급 수정 완료"});
    }catch(error){
        console.error(error);
        next(error);
    }
}

exports.deleteUserRating = async (req,res,next)=>{
    try{
        const {id} = req.params;
        await Ratings.destroy({where:{id}});
        res.status(200).json({message:"등급 삭제 완료"});
    }catch(error){
        console.error(error);
        next(error);
    }
}

exports.addUserRating = async (req,res,next)=>{
    try{
        if(!req.body.rating_name || !req.body.saved_money_rate){
            return res.status(400).json({message:"등급명과 적립 금액을 입력해주세요."});
        }
        const {rating_name,saved_money_rate} = req.body;
        const checkRating = await Ratings.findOne({where:{rating_name}});
        if(checkRating){
            return res.status(400).json({message:"이미 존재하는 등급명입니다."});
        }
        await Ratings.create({rating_name,saved_money_rate});
        res.status(200).json({message:"등급 추가 완료"});
    }catch(error){
        console.error(error);
        next(error);
    }
}