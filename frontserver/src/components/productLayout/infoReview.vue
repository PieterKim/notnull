<template>
  <div class="review-section">
    <ul class="review-list">
      <li v-for="(review, index) in reviews" :key="index" class="review-item">
        <div class="review-left">
          <p class="review-text clickable" @click="$router.push(`/post/post_detail/${review.id}`)">{{ review.title }}</p>
        </div>
        <div class="review-right">
          <span class="review-user">{{ review.Account.nickname||review.Account.email }}</span>
          <span class="review-date">{{ review.created_at }}</span>
        </div>
      </li>
    </ul>

    <div class="review-bottom" v-show="isLogin">
      <button class="review-button" @click="$router.push(`/products/review/${productId}`)">상품후기 글쓰기</button>
    </div>
  </div>
</template>

<script>
import api from "@/api.js"
export default{ 
    name:'',
    components:{},
    inject:['productId'],
    data(){
        return{
           reviews: [],
           isLogin:false,
        };
    },
    setup(){},
    created(){
      this.checkLogin();
    },
    mounted(){
      this.getReviewList();
    },
    unmounted(){},
    methods:{
      async getReviewList(){
        try{
          const response = await api.get(`/post/product_review/${this.productId}`);
          console.log('response',response);
          this.reviews = response.data;
        }catch(error){
          console.error(error);
        }
      },
      async checkLogin(){
        try {
          const response = await api.get('/auth/check',{withCredentials:true});
          this.isLogin = response.data.isLoggedIn;
        } catch(error) {
          return false;
        }
      },
    }
    
}
</script>

<style scoped>
.review-section {
  margin: 20px auto;
  width: 60%; 
}

.review-bottom {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin: 30px 0 30px 0;
}

.review-button {
  background-color: black;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.review-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.review-item {
  display: flex;
  justify-content: space-between; 
  align-items: center;
  border-bottom: 1px solid #ddd;
  padding: 10px 20px;
}

.review-left {
}

.review-right {
  text-align: right;
  flex-basis: 200px; 
}



.review-text {
  margin: 5px 0;
  font-size: 14px;
}

.review-text.clickable {
  cursor: pointer;
  transition: color 0.3s;
}

.review-text.clickable:hover {
  color: #007BFF;
}

.review-reply {
  color: #555;
  font-size: 12px;
  margin-top: 5px;
}

.review-user {
  display: block;
  font-weight: bold;
}

.review-date {
  font-size: 12px;
  color: #999;
}
</style>