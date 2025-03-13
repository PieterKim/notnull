const Coupons = require('../../models/model_coupons.js');

exports.getCoupons = async (req,res,next)=>{
    try{
        const coupons = await Coupons.findAll();
        res.status(200).json(coupons);
    }catch(error){
        console.error(error);
        next(error);
    }
}

exports.addCoupon = async (req,res,next)=>{
    try{
        const {coupon_name,coupon_discount_rate,end_date} = req.body;
        const create_at = new Date();
        await Coupons.create({coupon_name,coupon_discount_rate,end_date,create_at});
        res.status(200).json({message:"쿠폰 추가 완료"});
    }catch(error){
        console.error(error);
        next(error);
    }
}

exports.modifyCoupon = async (req,res,next)=>{
    try{
        const {id,coupon_name,coupon_discount_rate,end_date} = req.body;
        const update_at = new Date();
        await Coupons.update({coupon_name,coupon_discount_rate,end_date,update_at},{where:{id}});
        res.status(200).json({message:"쿠폰 수정 완료"});
    }catch(error){
        console.error(error);
        next(error);
    }
}

exports.deleteCoupon = async (req,res,next)=>{
    try{
        const {id} = req.params;
        await Coupons.destroy({where:{id}});
        res.status(200).json({message:"쿠폰 삭제 완료"});
    }catch(error){
        console.error(error);
        next(error);
    }
}   