<template>
  
  <div class="mypage-container">
    <!-- User Info Section -->
    <div class="user-info">
      <div class="user-details">
        <div>
          <h3><span>{{ user.nickname }}</span> 님 은 <span>{{rating}}</span> 등급입니다.</h3>
          <button type="submit" class="edit-btn" @click="modify">내 정보 수정</button>
        </div>
      </div>

    <div class="user-balance">
         <div class="balance-item">
            <h4>예치금</h4>
            <p><span>{{ user.savedMoney }}</span>원</p>
        </div> 
       
        <div class="balance-item">
            <h4>적립금</h4>
            <p class="ratingPoint"><span>{{ user.ratingPoint }}</span>원</p>
        </div>
    </div>
    </div>

    <!-- Icon Menu Section -->
    <div class="icon-menu">
      <div class="menu-item" @click="goOrder">나의 쇼핑 내역</div> <!-- 1월5일 수정 동진 -->
      <div class="menu-item" @click="$router.push('/postlist')">내 게시글 보기</div>
      <div class="menu-item" @click="$router.push('/QnAlist')">문의 내역</div>
      <!-- <div class="menu-item">최근 본 상품</div> -->
    </div>

    <!-- Recommended Products -->
    <!-- <div class="recommend-section">
      <router-view />
    </div> -->

    <div class="frequent-purchase-section">
      <h2>최근 본 상품</h2>
      <div class="frequent-items" v-if="Array.isArray(frequentItems) && frequentItems.length">
        <div v-for="item in frequentItems" :key="item.id" class="frequent-item" @click="$router.push(`/products/${item.id}`)">
          <img :src="item.product_image" alt="상품 이미지" />
          <p>{{ item.product_name }}</p>
          <p>{{ item.product_price.toLocaleString() }}원</p>
        </div>
      </div>
      <p v-else>최근 본 상품이 없습니다.</p>
    </div>

    <!-- Regular Purchase Section -->
    <div class="regular-purchase">
    </div>
  </div>

</template>

<script>
import axios from 'axios'
export default{ 
    name:'',
    components:{
    },
    data(){
        return{
            user:{
                nickname:'',
                email:''
            },
            rating:'',
            frequentItems: [],
           

        };
    },
    setup(){},
    created(){
      this.getUser()
      
    },
    mounted(){
      this.getRating();
    },
    unmounted(){},
    methods:{
         async getUser(){
            try{
                const res = await axios.get(`import.meta.env.VUE_APP_API_BASE_URL/profile`,{withCredentials:true});
                this.user = res.data;
                this.frequentItems = {
                  id1:res.data.recently_product_1,
                  id2:res.data.recently_product_2,
                  id3:res.data.recently_product_3,
                  id4:res.data.recently_product_4,
                  id5:res.data.recently_product_5
                };

                await this.sendFrequentItems(this.frequentItems);

            }catch(err){
                return;
            }
         },

         async getRating(){
            try{
                const res = await axios.get(`import.meta.env.VUE_APP_API_BASE_URL/profile/userRating`,{withCredentials:true});
                this.rating = res.data.rating;
            }catch(err){
                console.error(err);
            }
         },

        // 유저 정보를 url에 표기 안돼도록 보내는 post 작성 1월5일 동진
         async goOrder(){
          try{
            await axios.post('import.meta.env.VUE_APP_API_BASE_URL/orders',{email:this.user.email},{withCredentials: true});
            this.$router.push('/orders');
          }catch(err){
            console.error(err);
          }
         },

      async modify() {
        try {
            this.$router.push(`/modify`);
          } catch (err) {
              console.error(err);
          }
        }, // 1월7일 유저 페이지로 유저 정보를 보내는 post 작성 동진

        async sendFrequentItems(frequentItems) {
            try {
                const queryParams = new URLSearchParams(frequentItems).toString();
                const res = await axios.get(`import.meta.env.VUE_APP_API_BASE_URL/products/recentlyProductInfo?${queryParams}`, { withCredentials: true });
                this.frequentItems = res.data.products;
            } catch (err) {
                console.error(err);
            }
        }


         
        }
    }
    
</script>

<style scoped>
.mypage-container {
  max-width: 1200px;
  margin: 100px auto 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* User Info Section */
.user-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 50px;
  border-radius: 8px;
  background-color: rgb(249, 249, 249);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  flex-wrap: wrap; /* 화면이 좁을 때 줄바꿈 허용 */
}

.user-details,
.user-balance {
  flex: 1;
  text-align: center;
  margin: 10px 0;
}

.user-details h3 {
  margin: 0;
  line-height: 1.2;
  font-size: 1.1em;
  color: #4a4a4a;
}

.user-details h3 span {
  color: #4a4a4a;
}

.edit-btn {
  color: #4a4a4a;
  background-color: rgb(243, 239, 224);
  padding: 6px 10px;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  margin-top: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.edit-btn:hover {
  background-color: #e5dcc3; /* 호버 시 배경색 */
  color: #4a4a4a; /* 호버 시 텍스트 색상 */
}

.user-balance {
  display: flex;
  justify-content: center;
  gap: 10%;
  flex-wrap: wrap; /* 줄바꿈 허용 */
}

.balance-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-radius: 10px;
  background-color: #fff;
  min-width: 150px; /* 최소 크기 */
}

.balance-item h4,
.balance-item p {
  margin: 0;
  color: #4a4a4a;
}

/* Icon Menu Section */
.icon-menu {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
  padding: 30px;
  border-radius: 10px;
  background-color: rgb(249, 249, 249);
  margin-top: 50px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.menu-item {
  color: #4a4a4a;
  background-color: rgb(243, 239, 224);
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.menu-item:hover {
  background-color: #e5dcc3; /* 호버 시 배경색 */
  color: #4a4a4a; /* 호버 시 텍스트 색상 */
}

/* Frequent Purchase Section */
.frequent-purchase-section{
  margin-top: 100px;
}

.frequent-purchase-section h2 {
  color: #4a4a4a;
}

.frequent-items {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  margin-top: 40px;
  cursor: pointer;
}

.frequent-item {
  width: 120px;
  margin: 10px;
  text-align: center;
  transition: transform 0.3s ease;
}

.frequent-item:hover {
  transform: scale(1.05);
}

.frequent-item img {
  width: 130px;
  height: 200px;
  object-fit: cover;
  border-radius: 5px;
}

.frequent-item p {
  margin: 5px 0;
  color: #4a4a4a;
  text-align: center;
}

/* 반응형 스타일 */
@media (max-width: 768px) {
  .user-info {
    flex-direction: column; /* 세로 배치 */
    align-items: flex-start; /* 왼쪽 정렬 */
  }

  .user-details {
    text-align: left; /* 텍스트 왼쪽 정렬 */
  }

  .user-balance {
    justify-content: space-around; /* 균등 배치 */
    margin: 0 auto;
  }

  .icon-menu {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); /* 버튼 크기 축소 */
  }

  .frequent-items {
    justify-content: flex-start; /* 왼쪽 정렬 */
  }
}

@media (max-width: 480px) {
  .user-info {
    padding: 30px;
  }

  .balance-item {
    min-width: 100px; /* 더 작은 크기 */
  }

  .edit-btn {
    font-size: 0.8rem; /* 버튼 텍스트 크기 축소 */
    margin: 0 auto;
  }

  .icon-menu {
    padding: 20px;
  }

  .frequent-item img {
    width: 60px; /* 이미지 크기 축소 */
    height: 60px;
  }

  .frequent-item p {
  font-size: 12px; /* 텍스트 크기 축소 */
  white-space: normal;
  overflow: hidden;
}

.frequent-purchase-section a {
  font-size: 12px;
  color: blue;
  text-decoration: underline;
}


.recommend-section {
  background: yellow;
  padding: 20px;
  border-radius: 8px;
  font-size: calc(11px + 0.5vw); 
  margin: 30px 0 50px 0;
}

.recommend-categories {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.product-slider {
  display: flex;
  gap: 15px;
  overflow-x: auto;
}

.product-card {
  flex: 0 0 auto;
  background: #f9f9f9;
  padding: 10px;
  border-radius: 8px;
  text-align: center;
  font-size: calc(10px + 0.4vw); 
}


.regular-purchase {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  font-size: calc(11px + 0.5vw); 
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 15px;
}

.product-card {
  background: #fff;
  padding: 10px;
  border-radius: 8px;
  text-align: center;
  font-size: calc(10px + 0.4vw); 
}
}
</style>
