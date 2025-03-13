const Replies = require('../../models/model_replies');
const Accounts = require('../../models/model_accounts');
const Likes = require('../../models/model_likes');

exports.addReplyLike = async (req,res,next)=>{
    try{
        const {reply_id} = req.params;
        const reply = await Replies.findOne({where:{id:reply_id}});
        const allLikers = await Likes.findAll({where:{reply_id}});
        if(allLikers.some(liker=>liker.who_liked === req.user.email)){
            res.status(400).json({message:"이미 좋아요를 누르셨습니다."});
        }
        else{
            await Likes.create({who_liked:req.user.email,reply_id:reply_id});
            await Replies.update({ like_count: reply.like_count + 1 },{ where: { id:reply_id } });
            res.status(200).json({likeCount:reply.like_count,isLoggedIn:true});
        }
    }catch(error){
        console.error(error);
        next(error);
    }
}

exports.addReply = async (req,res,next)=>{
    try{
        const post_id = req.params.id;
        let newReply = req.body;
        const account_email = req.user.email;
        const account = await Accounts.findOne({where:{email:account_email}});
        const account_id = account.id;
        newReply.account_id = account_id;
        newReply.post_id = post_id;
        newReply.created_at = new Date();
        newReply.updated_at = new Date();
        const reply = await Replies.create(newReply);
        res.status(200).json(reply);
    }catch(error){
        console.error(error);
        next(error);
    }
}



exports.modifyReply = async (req,res,next)=>{
    try{
        const reply_id = req.params.reply_id;
        const reply_content = req.body.reply_content;
        const updated_at = new Date();
        await Replies.update({reply_content,updated_at},{where:{id:reply_id}});
        res.status(200).json({message:"댓글 수정 완료"});
    }catch(error){
        console.error(error);
        next(error);
    }
}

exports.deleteReply = async (req,res,next)=>{
    try{
        const reply_id = req.params.reply_id;
        await Replies.destroy({where:{id:reply_id}});
        await Replies.destroy({where:{reply_reply_id:reply_id}});
        res.status(200).json({message:"댓글 삭제 완료"});
    }catch(error){
        console.error(error);
        next(error);
    }
}

