<template>
<div>

    <div class="mypage-container">
    <!-- User Info Section -->
     <div class="user-info">
      <div class="user-details">
        <div>
          <h3><span>{{ user.nickname }}</span> 님 은 <span>{{rating}}</span> 등급입니다.</h3>
        </div>
      </div>

    <div class="user-balance">
         <div class="balance-item">
            <h4 class="rating_name">예치금</h4>
            <p><span>{{ user.savedMoney}}</span>원</p>
        </div> 
       
        <div class="balance-item">
            <h4>적립금</h4>
            <p class="ratingPoint"><span>{{ user.ratingPoint }}</span>원</p>
        </div>
    </div>
    </div>

    <div class="order-list">
        <ul class="order-list-ul">
            <li>
                <a @click="goWish(user.id)"> 찜 리스트 </a>
            </li>
            <li>
                <a @click="goCart(user.id)"> 장바구니 </a>
            </li>
            <li>
                <a @click="orderedList(user.id)"> 주문목록 </a>
            </li>
            <!-- <li>
                <a @click="orderNow(user.id)"> 주문창</a>
            </li> -->
            <li>
                <a @click="goRefund(user.id)">취소/환불 목록</a>
            </li>
        </ul>

        <router-view /> 
    </div>
  
  </div>



</div>

</template>


<script>
import api from "@/api.js"

export default{ 
    name:'OrderView',
    components:{

    },
    data(){
        return{
            user:{}, //  250108 누리) getUserProfile()에서 사용하는 변수로 변경. <= 이전 : 250105 동진)유저 데이터를 받아올수있도록 data 에 작성
            rating:'',
        };

    },
    setup(){},
    created(){
      //this.getUserData(); // getuserdata 를 마운트에 작성 1월 6일 동진
      this.getUserProfile(); // 250108 누리) router_profile 에서 userdata 받아오기로 변경
      
    },
    mounted(){
      this.getRating();
    },
    unmounted(){},
    methods:{

        

        goWish(userId){
            this.$router.push(`/wish/${userId}`)
        },
        goCart(userId){
            this.$router.push(`/cart/${userId}`)
        },
        orderNow(userId){
            this.$router.push(`/finalOrder/${userId}`)
        },
        orderedList(userId){
            this.$router.push(`/order/${userId}`)
        },
        goRefund(userId){
            this.$router.push(`/cancelledOrder/${userId}`)
        },

      // 마이페이지에서 유저 정보를 받아오는 get 작성 1월5일 동진
      // async getUserData(){
      //   try {
      //     const res = await api.get('/orders',{withCredentials: true})
      //     this.user = res.data
      //     console.log('user',res)
      //   }catch(err){
      //     console.error(err)
      //   }
      // },


      
      // GET user profile / 250108 누리) router_profile에서 user data 받아오기로 변경
      async getUserProfile(){
        try{
            const response = await api.get(`/profile/`, {withCredentials:true}); 
            //알아서 req.user.email 조회해서 유저 data 쏴주는 controller_profile
            //쿠키세션 쓸때는 무조건 {withCredentials:true} 써줘야됨
            this.user = response.data
        }catch(err){
            console.error(err);
        }
      },  

      
      // 유저의 레이팅 등급을 받아오는 get 작성 1월 5일 동진
      // 
      async getRating(){
          try{
              const res = await api.get(`/profile/userRating`,{withCredentials:true});
              console.log(res.data);
              this.rating = res.data.rating;
          }catch(err){
              console.error(err);
          }
      },
        
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
  flex-wrap: wrap; /* 화면이 좁을 때 줄바꿈 */
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

/* 주문 목록 섹션 */
.order-list {
  margin-top: 50px;
}

.order-list-ul {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  padding: 30px;
  background-color: rgb(249, 249, 249);
  border-radius: 10px;
  gap: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.order-list-ul li {
  list-style: none;
  padding: 10px;
  background-color: rgb(243, 239, 224);
  border-radius: 10px;
  text-align: center;
  transition: background-color 0.3s ease, color 0.3s ease;
  cursor: pointer;
}

.order-list-ul li:hover {
  background-color: #e5dcc3; /* 호버 시 배경색 */
}

.order-list-ul li:hover a {
  color: #4a4a4a; /* 호버 시 텍스트 색상 */
}

.order-list-ul li a {
  font-size: 1rem;
  display: block;
  text-decoration: none;
  color: #4a4a4a;
  transition: color 0.3s ease;
}

/* 반응형 스타일 */
@media (max-width: 768px) {
  .user-info {
    flex-direction: column; /* 세로 배치 */
    align-items: center; /* 중앙 정렬 */
  }

  .user-details {
    margin-bottom: 20px; /* 하단 여백 추가 */
  }

  .user-balance {
    justify-content: space-around; /* 균등 배치 */
  }

  .order-list-ul {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); /* 작은 버튼 크기 */
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
    margin: 10px auto; /* 상하 여백 추가 및 가운데 정렬 */
  }

  .order-list-ul {
    padding: 20px;
  }

  .order-list-ul li {
    font-size: 0.9rem; /* 텍스트 크기 축소 */
  }
}



</style>

