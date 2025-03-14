<template>
  <div class="container">
    <h1 class="page-title">{{ isModify ? '게시글 수정' : '게시글 등록' }}</h1>
    
    <!-- 이미지 업로드 폼 -->
    <form @submit.prevent="uploadPostImage">
      <div class="image-upload-container">
        <label for="imageUpload" class="imgUpload">이미지 업로드</label>
        <img v-if="post.post_image" :src="post.post_image" alt="게시글 이미지" class="img-preview">
        <input @change="handleImageUpload" type="file" id="imageUpload" name="image" accept="image/*" />
        <button type="submit" v-if="postImage">이미지 업로드</button>
      </div>
    </form>

    <!-- 게시글 작성 폼 -->
    <form @submit.prevent="handleSubmit">
      <div v-if="!product_id && !isModify" class="form-group">
        <label for="postType">게시글 종류</label>
        <select v-model="post.post_kind" id="postType" name="postType" required>
          <option value="entire">전체게시판</option>
          <option value="free">자유게시판</option>
          <option value="inquiry">문의 게시판</option>
          <option value="report">신고 게시판</option>
        </select>
      </div>
      <div v-else-if="product_id" class="form-group">
        <label for="postType">게시글 종류</label>
        <select v-model="post.post_kind" id="postType" name="postType" required>
          <option value="review">리뷰게시판</option>
        </select>
      </div>

      <div class="form-group">
        <label for="postTitle">제목</label>
        <input type="text" v-model="post.title" id="postTitle" name="title" required/>
      </div>

      <div class="form-group">
        <label for="postContent">내용</label>
        <small class="markdown-hint">* 마크다운 문법을 사용할 수 있습니다.</small>
        <textarea v-model="post.post_content" id="postContent" name="content" required></textarea>
      </div>

      <button type="submit">게시글 등록</button>
    </form>
  </div>
</template>

<script>
import api from "@/api.js"
export default {
  name: 'AddOrModifyPostView',
  components:{},
  computed:{},
  data(){
    return{
      postImage:null,
      isModify:false,
      post:{
        post_image:null,
        post_kind:null,
        title:null,
        post_content:null,
        product_id:null,
      },
      product_id:null,
    }
  },
  created(){
    if(this.$route.params.id){
        this.isModify = true;
        const postID = this.$route.params.id;
        api.get(`/post/post_detail/${postID}`,{withCredentials:true})
        .then(response => {
            this.post = response.data;
        })
        .catch(error => {
            console.log("게시글 조회에 실패했습니다.",error);
        });
    }
    else if(this.$route.params.product_id){
        this.product_id = this.$route.params.product_id;
        this.post.product_id = this.$route.params.product_id;
    }
  },
  methods: {
    handleImageUpload(event) {
      this.postImage = event.target.files[0];
    },
    async uploadPostImage() {
      if (!this.postImage) {
        alert('이미지를 선택해주세요.');
        return;
      }
      try{
        const formData = new FormData();
        formData.append('image',this.postImage);
        const response = await api.post('/post/upload/postImg',formData,{
          headers:{
            'Content-Type':'multipart/form-data',
          },
        },{withCredentials:true});
        this.post.post_image = response.data.imageUrl;

      }
      catch(error){
        console.log("이미지 업로드 실패",error);
      }
      
    },
    async handleSubmit() {
      // 게시글 제출 처리 로직
      try{
        if(this.isModify){
          if(this.post.title === null || this.post.title === ''){
            alert("제목을 입력해주세요.");
            this.$nextTick(() => {
              document.getElementById('postTitle').focus();
            });
            return;
          }
          if(this.post.post_content === null || this.post.post_content === ''){
            alert("내용을 입력해주세요.");
            this.$nextTick(() => {
              document.getElementById('postContent').focus();
            });
            return;
          }
          const response = await api.patch(`/post/modifyPost/${this.post.id}`,this.post,{withCredentials:true});
          console.log("게시글 수정 응답",response);
          this.post = {};
          this.isModify = false;
          this.$router.push(`/post/post_detail/${response.data.id}`);
        }
        else{
          const response = await api.post('/post/addPost',this.post,{withCredentials:true});
          console.log("게시글 제출 응답",response);
          this.post = {};
          this.$router.push(`/post/post_detail/${response.data.id}`);
        }
      }
      catch(error){
        console.log("게시글 제출 실패",error);
      }
      
      
    }
  }
}
</script>

<style scoped>
.container {
  max-width: 800px;
  margin:2rem auto;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

input[type="text"],
textarea,
select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

input[type="text"]:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0,123,255,0.1);
}

textarea {
  min-height: 500px;
  resize: vertical;
}

.img-preview {
  max-width: 300px;
  max-height: 300px;
  object-fit: cover;
  border-radius: 4px;
  margin: 1rem 0;
  border: 1px solid #e0e0e0;
}

.image-upload-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
}

input[type="file"] {
  padding: 0.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  width: 100%;
}

button {
  width: 120px;
  padding: 0.75rem 1rem;
  background-color: #f3efe0;
  color: #4A4A4A;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #e5dcc3;
  color: #000;
}

button[type="submit"] {
  margin-top: 1rem;
  align-self: flex-end; /* 오른쪽 정렬 */
}

.markdown-hint {
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.page-title {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
  font-size: 1.8rem;
  font-weight: 600;
}
</style>