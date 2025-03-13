const express = require('express');
const router = express.Router();
const {getPosts,getSpecificKindPostList,selectedPost,getSpecificPostReplyList,deletePost,uploadPostImage,modifyPost,addPost,addPostLike,getSpecificProductReviewList} = require('../controllers/post/controller_post');
const {addReply,deleteReply,modifyReply,addReplyLike} = require('../controllers/reply/controller_reply');
const {isLoggedIn} = require('../middlewares/middleware_checkLogin');
const {postUpload} = require('../middlewares/middlewares_imgUpload');

//전체 게시글 조회
router.get('/post_list',getPosts);

//특정 종류의 게시글 조회
router.get('/post_list/:post_kind',getSpecificKindPostList);


//특정 게시글 조회
router.get('/post_detail/:id',selectedPost);

//특정 게시글 좋아요 추가
router.post('/post_like/:post_id',isLoggedIn,addPostLike);

//특정 상품의 후기 조회
router.get('/product_review/:product_id',getSpecificProductReviewList);






//특정 게시글 수정
router.patch('/modifyPost/:id',isLoggedIn,modifyPost);

//특정 게시글 추가
router.post('/addPost',isLoggedIn,addPost);

//특정 게시글 삭제
router.delete('/delete/:id',isLoggedIn,deletePost);

//게시글 이미지 업로드
router.post('/upload/postImg',postUpload.single('image'),uploadPostImage);

//특정 게시글의 댓글 조회
router.get('/reply_list/:id',getSpecificPostReplyList);

//특정 댓글 좋아요 추가
router.post('/reply_like/:reply_id',isLoggedIn,addReplyLike);

//특정 게시글의 댓글 수정
router.patch('/reply_modify/:reply_id',isLoggedIn,modifyReply);

//특정 게시글에 댓글 추가
router.post('/reply_add/:id',isLoggedIn,addReply);

//특정 게시글에 댓글 삭제
router.delete('/reply_delete/:reply_id',isLoggedIn,deleteReply);

module.exports = router;
