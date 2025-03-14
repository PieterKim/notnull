<template>
<div class="content-wrapper">
    <!-- Page content-->
    <div class="container" style="margin-top: 20vh;">
        <div class="row justify-content-center">
            <div class="col-lg-12">
                
                <!-- Post content-->
                <article class="post-article">
                    <!-- 상단 타이틀 섹션 -->
                    <div class="post-header mb-4">
                        <div class="title-section" style="text-align: left;">
                            <h1 class="fw-bolder">{{postDetail.title}}</h1>
                            <p class="text-muted mb-0">작성자: {{ postDetail.Account.nickname || '익명' }}</p>
                        </div>
                        
                        <!-- 수정, 삭제 버튼 -->
                        <div v-if="user.email === postDetail.Account.email || user.super_admin" class="action-buttons">
                            <button class="btn custom-btn me-2" @click="$router.push(`/post/modifyPost/${postDetail.id}`)">
                                <i class="bi bi-pencil-square me-1"></i>수정
                            </button>
                            <button class="btn custom-btn-danger" @click="deletePost">
                                <i class="bi bi-trash me-1"></i>삭제
                            </button>
                        </div>
                    </div>

                    <hr class="divider">

                    <!-- 메인 컨텐츠 섹션 -->
                    <div class="post-content">
                        <figure class="mb-4" v-if="postDetail.post_image">
                            <img class="img-fluid rounded shadow" :src="`${postDetail.post_image}`" alt="..." />
                        </figure>
                        <div v-html="renderedContent" class="fs-5 mb-4 content-reset"></div>
                    </div>

                    <!-- 좋아요 버튼 -->
                    <div class="d-flex justify-content-center my-4">
                        <button class="btn custom-btn d-flex align-items-center gap-2" @click="toggleLike">
                            <i class="bi bi-hand-thumbs-up-fill"></i>
                            <span>좋아요 {{ postDetail.like_count }}</span>
                        </button>
                    </div>
                </article>
                <!-- Comments section-->
                <section class="mb-5" style="margin-top: 5rem;">
                    <div class="card bg-light shadow-sm">
                        <div class="card-body">
                            <!-- Comment form-->
                            <form class="mb-4" @submit.prevent="addReply(null)">
                                <div class="d-flex gap-2">
                                    <textarea ref="replyText" v-model="sendReply.reply_content" class="form-control" rows="3" placeholder="Join the discussion and leave a comment!"></textarea>
                                    <button type="submit" class="btn custom-btn d-flex align-items-center submit-btn">
                                        <span>댓글 작성</span>
                                    </button>
                                </div>
                            </form> 
                            <!-- Comment with nested comments-->
                            <div v-for="reply, index in replyList.filter(reply => reply.reply_reply_id === null)" :key="reply.id" class="d-flex mb-4">
                                <!-- Parent comment-->
                                <div class="ms-3" style="width: 90%;">
                                    <div class="d-flex justify-content-between align-items-start">
                                        <div style="text-align: left;">
                                            <div class="fw-bold">{{ reply.Account.nickname || '익명' }}</div>
                                            <p class="mb-0">{{ reply.reply_content }}</p>
                                            <!-- 좋아요 아이콘 및 수 -->
                                            <button 
                                                class="btn btn-outline-primary btn-sm d-flex align-items-center gap-2" 
                                                @click="addReplyLike(reply.id)">
                                                <i class="bi bi-hand-thumbs-up"></i>
                                                <span>{{ reply.like_count || 0 }}</span>
                                            </button>
                                        </div>
                                        <div v-show="reply.Account.email === user.email || user.super_admin">
                                            <button class="btn btn-sm btn-outline-secondary me-1" data-bs-toggle="modal" data-bs-target="#modifyReplyModal" @click="modifyReply(reply.id)">수정</button>
                                            <button class="btn btn-sm btn-outline-danger" @click="deleteReply(reply.id)">삭제</button>
                                        </div>
                                    </div>
                                
                                
                                    <div class="ms-3">
                                        <!-- 대댓글 버튼 -->
                                        <div class="d-flex">
                                            <i class="fas fa-comments" data-bs-toggle="collapse" :data-bs-parent="replyAccordion" :data-bs-target="'#reply-' + reply.id" aria-expanded="false" aria-controls="reply" style="cursor: pointer; font-size: 1.2em; color: #adb5bd;"></i>
                                        </div>
                                        <div :id="'reply-' + reply.id" class="collapse mt-4" style=" background-color: #f8f9fa; padding: 5px; border-radius: 5px;">
                                            <form class="mb-4" @submit.prevent="addReply(reply.id, index)">
                                                <div class="d-flex gap-2">
                                                    <input type="text" 
                                                        :ref="`replyInput${index}`"
                                                        v-model="replyReplyContents[index]" 
                                                        class="form-control" 
                                                        placeholder="댓글을 입력하세요...">
                                                    <button type="submit" class="btn custom-btn d-flex align-items-center">
                                                        <span>작성</span>
                                                    </button>
                                                </div>
                                            </form>
                                            <div v-for="re_reply in replyList.filter(rr => rr.reply_reply_id === reply.id)" :key="re_reply.id" class="d-flex" style="width: 90%;">
                                                <div class="d-flex justify-content-between align-items-start w-100">
                                                    <div style="text-align: left;">
                                                        <div class="fw-bold">{{ re_reply.Account.nickname || '익명' }}</div>
                                                        <p class="mb-0">{{ re_reply.reply_content }}</p>
                                                        <!-- 좋아요 아이콘 및 수 -->
                                                        <button 
                                                            class="btn btn-outline-primary btn-sm d-flex align-items-center gap-2" 
                                                            @click="addReplyLike(re_reply.id)">
                                                            <i class="bi bi-hand-thumbs-up"></i>
                                                            <span>{{ re_reply.like_count || 0 }}</span>
                                                        </button>
                                                    </div>
                                                    <div v-show="re_reply.Account.email === user.email || user.super_admin">
                                                        <button class="btn btn-sm btn-outline-secondary me-1" data-bs-toggle="modal" data-bs-target="#modifyReplyModal" @click="modifyReply(re_reply.id)">수정</button>
                                                        <button class="btn btn-sm btn-outline-danger" @click="deleteReply(re_reply.id)">삭제</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            
        </div>
    </div>

    
    <!-- 댓글 수정 모달 -->
    <!-- Modal -->
    <div class="modal fade" id="modifyReplyModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="staticBackdropLabel">댓글 수정</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <textarea class="form-control" v-model="modifyReplyContent" rows="3"></textarea>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="modifyReplySubmit(selectedReplyId)">Modify</button>
            </div>
            </div>
        </div>
    </div>
</div>
</template>


<script>
import api from "@/api.js"
import { marked } from 'marked';

export default{ 
    name:'',
    components:{},
    computed:{
        addLikeCount(){
            this.postDetail.like_count++;
        },
        updateReplyLikeCount(reply_id){
            return (replyId) => {
            const reply = this.replyList.find(reply => reply.id === replyId);
            if (reply) {
                reply.like_count += 1;
            }
        };
        },
        renderedContent() {
            return marked(this.postDetail.post_content || '');
        }
    },
    data(){
        return{
            postId: null,
            postDetail: {
                title: '',
                post_kind:'',
                post_content: '',
                created_at: '',
                updated_at: '',
                like_count: 0,
                post_kind:'',
                account_id:'',
                Account:{
                    email:''
                }
            },
            replyList:[],
            replyReplyContents:[],
            user:{
                nickname:'',
                email:''
            },
            sendReply:{
                reply_content:'',
                reply_reply_content:'',
                reply_reply_id:null,
            },
            modifyReplyContent: '',
            selectedReplyId: null,
        };
    },
    setup(){},
    created(){
        this.postId = this.$route.params.id;
        this.getUser();
        
    },
    mounted(){
        this.getReplyList();
        this.getPostDetail();
    },
    unmounted(){},
    methods:{
        async getPostDetail(){
            const response = await apit.get(`/post/post_detail/${this.postId}`);
            this.postDetail = response.data;
        },
        initializeReplyReplyContents() {
            const parentReplies = this.replyList.filter(reply => reply.reply_reply_id === null);
            this.replyReplyContents = new Array(parentReplies.length).fill('');
        },
        async getReplyList(){
            const response = await apit.get(`/post/reply_list/${this.postId}`);
            this.replyList = response.data;
            this.initializeReplyReplyContents();
            console.log("replyList",this.replyList);
        },
        async getUser(){
            try{
                const res = await apit.get(`/profile`,{withCredentials:true});
                this.user = res.data;
            }catch(err){
                console.log("로그인 전");
            }
         },
        async deletePost() {
            if (confirm("정말로 삭제하시겠습니까?")) {
                try {
                    await apit.delete(`/post/delete/${this.postId}`,{withCredentials:true});
                    alert("삭제되었습니다.");
                    this.$router.push('/');
                    // 삭제 후 다른 페이지로 이동하거나 필요한 후속 작업을 수행합니다.
                } catch (error) {
                    console.error("삭제 중 오류 발생:", error);
                    alert("삭제에 실패했습니다.");
                }
            }
        },
        async addReply(reply_id, index){
            if(!reply_id){
                if(this.sendReply.reply_content === ''){
                    alert("댓글을 입력해주세요.");
                    this.$nextTick(() => {
                        this.$refs.replyText.focus();
                    });
                    return;
                }
            }
            else{
                if(this.replyReplyContents[index] === ''){
                    alert("댓글을 입력해주세요.");
                    this.$nextTick(() => {
                        const refName = `replyInput${index}`;
                        if (this.$refs[refName]) {
                            this.$refs[refName][0].focus();//:ref=`replyInput${index}`처럼 바인딩 해서 값을 넣은 경우 값이 배열로 들어가기 때문에 확인을 잘 해서 찾아줘야 함. console.log('모든 refs:', this.$refs); 로 확인 가능
                        }
                    });
                    return;
                }
                this.sendReply.reply_reply_id = reply_id;
                this.sendReply.reply_content = this.replyReplyContents[index];
            }
            try{
                const response = await api.post(`/post/reply_add/${this.postId}`,this.sendReply,{withCredentials:true});
                this.sendReply = {
                    reply_content:'',
                    reply_reply_id:null,
                };
                this.getReplyList();
            }catch(error){
                if(error.response.status === 401 || error.response.status === 403){
                    alert("로그인 후 이용해주세요.");
                    if(!reply_id){
                        this.$nextTick(() => {
                            this.$refs[`replyText`].focus();
                        });
                    }
                    else{
                        this.$nextTick(() => {
                            const refName = `replyInput${index}`;
                            if (this.$refs[refName]) {
                                this.$refs[refName][0].focus();
                            }
                        });
                    }
                }
                console.log("댓글 작성 실패",error);
            }
        },
        async deleteReply(reply_id){
            try{
                await apit.delete(`/post/reply_delete/${reply_id}`,{withCredentials:true});
                this.getReplyList();
            }catch(error){
                console.log("댓글 삭제 실패",error);
            }
        },
        async modifyReply(reply_id){
            this.modifyReplyContent = this.replyList.find(reply => reply.id === reply_id).reply_content;
            this.selectedReplyId = reply_id;
        },
        async modifyReplySubmit(reply_id){
            try{
                await apit.patch(`/post/reply_modify/${reply_id}`,{reply_content:this.modifyReplyContent},{withCredentials:true});
                this.getReplyList();
            }catch(error){
                console.log("댓글 수정 실패",error);
            }
        },
        async toggleLike() {
            try {
                const response = await api.post(`/post/post_like/${this.postId}`, {}, {withCredentials: true});
                console.log("response",response);
                if(!response.data.isLoggedIn){
                    alert("로그인 후 이용해주세요.");
                }
                else{
                    this.addLikeCount();
                }
            } catch (error) {
                if(error.response?.status === 400){
                    alert(error.response.data.message);
                }
                console.error("좋아요 처리 실패:", error);
            }
        },
        async addReplyLike(reply_id) {
            try {
                const response = await api.post(`/post/reply_like/${reply_id}`, {}, {withCredentials: true});
                console.log("response",response);
                if(!response.data.isLoggedIn){
                    alert("로그인 후 이용해주세요.");
                }
                else{
                    this.updateReplyLikeCount(reply_id);
                }
            } catch (error) {
                if(error.response?.status === 400){
                    alert(error.response.data.message);
                }
                else {
                    console.error("댓글 좋아요 처리 실패:", error);
                }
            }
        },
    },
    watch:{}
}
</script>

<style scoped>
.post-article {
    background-color: #ffffff;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.btn-outline-primary.active {
    background-color: #0d6efd;
    color: white;
}

.btn-outline-primary:hover {
    transform: scale(1.05);
    transition: transform 0.2s ease;
}

.btn-outline-primary:active {
    transform: scale(0.95);
}

/* 댓글 좋아요 버튼에 하단 마진 추가 */
.btn-outline-primary.btn-sm {
    margin: 6px 0 10px 0;
}

.content-wrapper {
    width: 85%;
    margin: 0 auto;
}

.container {
    margin-top: 20vh;
}

.content-reset {
    all: unset;
    display: block;
    font-size: 1rem; /* 기본 폰트 크기 설정 */
    line-height: 1.5; /* 기본 줄 간격 설정 */
    /* 필요한 경우 추가 스타일 설정 */
}

.card {
    border: none;
    border-radius: 10px;
}

.card-body {
    padding: 20px;
}

.shadow-sm {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 새로운 스타일 추가 */
.post-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 1rem 0;
}

.title-section {
    flex: 1;
}

.divider {
    border-top: 2px solid #e5dcc3;
    margin: 2rem 0;
}

.custom-btn {
    background-color: #f3efe0;
    color: #4a4a4a;
    border: none;
    transition: all 0.3s ease;
    white-space: nowrap;  /* 텍스트 줄바꿈 방지 */
    width: auto;          /* 버튼 너비 자동 조정 */
    min-width: fit-content; /* 최소 너비 설정 */
    padding: 0.375rem 0.75rem; /* 버튼 패딩 조정 */
}

.custom-btn span {
    display: inline-block; /* 인라인 블록으로 변경 */
    vertical-align: middle; /* 수직 정렬 중앙 */
}

.custom-btn:hover {
    background-color: #e5dcc3;
    color: #000;
}

.custom-btn-danger {
    background-color: #f8d7da;
    color: #842029;
    border: 1px solid #f5c2c7;
    transition: all 0.3s ease;
}

.custom-btn-danger:hover {
    background-color: #f1aeb5;
    color: #58151c;
}

.post-content {
    margin-top: 2rem;
}

/* 대댓글 버튼 스타일 수정 */
.btn-outline-primary {
    border: none;
}

/* 댓글 작성 버튼 너비 조정 */
.submit-btn {
    width: 120px; /* 기본 버튼 너비의 약 3배 */
    justify-content: center;
}
</style>