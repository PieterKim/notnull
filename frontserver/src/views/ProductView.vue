<template>
<div class="div1">

    <!-- <section class="product-main container d-flex justify-content-center align-items-center flex-wrap">
        
        <div class="product-image-container text-center">
            <img :src="selectedProduct.product_image" alt="product_img" class="product-img img-fluid">
        </div>

    
        <div class="product-info-container text-center text-md-start">
            <div class="product-info">
                <div>
                    <h3 class="product-name mb-5">{{selectedProduct.product_name}}</h3>
                    <p class="price-text">{{selectedProduct.product_price}}원</p>
                    <div class="product-stock"><p>남은수량</p><p> {{selectedProduct.product_stock}}개</p></div>
                    
                </div>
            
                <div class="delivery-box">
                    <div class="delivery-info"><p>배송예정일</p> <p>평일기준 2일</p></div>
                    <div class="delivery-corpor"><p>택배사</p><p>CJ대한통운</p></div>
                </div>
            </div>
            
            <div class="quantity-group gap-3 mb-3">
                <p id="quantity-label" class="mb-0">수량</p>
                <div class="quantity-controls d-flex align-items-center">
                    <button @click="minusQ" class="btn btn-light border">-</button>
                    <input type="number" v-model="orderQuantity" class="input-box form-control text-center" style="width: 50px;">
                    <button @click="plusQ" class="btn btn-light border">+</button>
                </div>
            </div>

            <div class="total-price-container">
                    <p>총 합계금액</p>
                    <p class="price-txt">{{(selectedProduct.product_price * orderQuantity).toLocaleString()}}원</p>
            </div>

            
            <div class="button-group d-flex flex-wrap gap-3">
                <button @click="addWish()" class="btn btn-outline-secondary heart-button">
                    <i class="bi bi-heart wish-heart"></i>
                </button>
                <button @click="addCarts()" class="btn btn-outline-dark cart-button">장바구니</button>
                <button @click="makeOrder()" class="btn btn-dark buy-button">구매하기</button>
            </div>



        </div>
    </section> -->


<!-- 반응형 템플릿으로 변경 1월 11일 동진-->
<section class="py-5">
            <div class="container px-4 px-lg-5 my-5">
                <div class="row gx-4 gx-lg-5 align-items-center">
                    

                    <div class="col-md-6 image-container">
                        <img
                        class="product-image"
                        :src="selectedProduct.product_image"
                        alt="product_img"
                        />
                    </div>
                   
                    <div class="col-md-6 main-content">
                        
                        <h1 class="display-5 fw-bolder fs-3">{{selectedProduct.product_name}}</h1>
                        
                        <div class="fs-5">
                            <p>{{selectedProduct.product_price}} 원</p>
                            <div class="product-stock"><p>남은수량</p><p> {{selectedProduct.product_stock}}개</p></div>
                            <div class="delivery-info"><p>배송예정일</p> <p>평일기준 2일</p></div>
                            <div class="delivery-corpor"><p>택배사</p><p>CJ대한통운</p></div>
                        </div>

                        <p class="lead fs-6">{{selectedProduct.product_description}}</p>

            <div class="quantity-group gap-3 mb-3">
                <p id="quantity-label" class="mb-0">수량</p>
                <div class="quantity-controls d-flex align-items-center">
                    <button @click="minusQ" class="btn btn-light border">-</button>
                    <input type="number" v-model="orderQuantity" class="input-box form-control text-center" style="width: 50px;">
                    <button @click="plusQ" class="btn btn-light border">+</button>
                </div>
            </div>

            <div class="total-price-container">
                    <p>총 합계금액</p>
                    <p class="price-txt">{{(selectedProduct.product_price * orderQuantity).toLocaleString()}}원</p>
            </div>

                        <div class="button-group d-flex flex-wrap gap-3">
                <button @click="addWish()" class="btn btn-outline-secondary heart-button">
                    <i class="bi bi-heart wish-heart"></i>
                </button>
                <button @click="addCarts()" class="btn btn-outline-dark cart-button">장바구니</button>
                <button @click="makeOrder()" class="btn btn-dark buy-button">구매하기</button>
            </div>
        </div>
                </div>
            </div>
</section>


    



    <!-- <section class="recoment-section">
    <h3>추천상품 구성??</h3>
        <div class="recoment-container">
            <ul class="recomend-product">
                <li v-for="(pro,i) in recommendProduct" :key="i">
                    <a href="#">
                        <img :src="pro.product_image" alt="product_img" class="recomend-img">
                        <p class="recoment-name">{{pro.product_name}}</p>
                        <p class="recoment-price">{{pro.product_price}}원</p>
                    </a>
                </li>
            </ul>
        </div>
    </section> -->


<!-- 추천상품 -->
<!-- <section class="recomend-section">
    <h3> ##어떤걸 추천해줄지 정해야합니다## // 1월1일 현재 기능만 구현한 상태(동진)</h3>
    <div class="recomend-container">
        <div v-for="pro in recommendProduct" :key="pro.id" class="recomend-product">
            <a @click="reRendRecommend(pro.id)">
                <img :src="pro.product_image" alt="product_img" class="recomend-img">
                <p>{{pro.product_name}}</p>
                <p>{{pro.product_price.toLocaleString()}}원</p>
            </a>

        </div>
    </div>
</section> -->


<!-- recommend-section 반응형으로 수정 1월 12일 동진 추가 -->
<section class="py-5 border-top border-bottom">

            <div class="container px-4 px-lg-5 mt-5 recommend-container">
                <h2 class="fw-bolder mb-4 fs-3">이런 상품은 어떠세요?</h2>
                <div class="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 justify-content-center">
                    
                    <div class="col mb-5" v-for="pro in recommendProduct" :key="pro.id" @click="reRendRecommend(pro.id)">
                        <div class="card h-100">
                            <!-- Product image-->
                            <img class="card-img-top" :src="pro.product_image" alt="..." />
                            <!-- Product details-->
                            <div class="card-body p-4">
                                <div class="text-center">
                                    <!-- Product name-->
                                    <h5 class="fw-bolder">{{pro.product_name}}</h5>
                                    <!-- Product price-->
                                    {{pro.product_price.toLocaleString()}} 원
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

</section>

<productInfoVue :product="selectedProduct"/>
</div>
</template>


<script>
import axios from 'axios'; 
import productInfoVue from '../components/productLayout/productInfo.vue';
import footerVue from '../components/layout/FooterLayout.vue';
export default{ 
    name:'',
    components:{
      productInfoVue,
      footerVue
    },
    watch:{
       
    },
    provide(){
      return{
        productId: this.$route.params.product_id
      }
    },
    data(){
        return{
            

            selectedProduct : {
                id:null,
                product_name : '',
                product_price : null,
                product_description:'',
                product_stock:'',
                product_image:'',
            },

            recommendProduct :[], //1월1일 추천상품 목록 진열 기능 확인 위해 주석제거(동진)

            product_id: null,
            orderQuantity : 1,
            user : [],
            
        };
    },
    setup(){},
    created(){
        this.getProducts()
    },
    mounted(){
        window.scrollTo(0, 0);  // 페이지 최상단으로 스크롤
        this.getRecommendProducts();
        this.getUserProfile();
        this.checkRecentlyProduct();
    },
    unmounted(){},
    methods:{

        // 해당 뷰 메소드
        
        plusQ() {
            this.orderQuantity += 1;
        },
        minusQ() {
            if(this.orderQuantity > 1){
                this.orderQuantity -= 1;
            }
        },

        // axios 요청 메소드

        // // Check Login

        checkLogin () {
            if(!this.user.id) {
                alert("로그인이 필요합니다");
                this.$router.push('/login');
                return false;
            }else {
                // 로그인 돼있을 때 최근 본 상품 업데이트
                return true;
            }
        },

        // GET user profile
        async getUserProfile(){
        try{
            const response = await axios.get(`http://localhost:3000/profile/`, {withCredentials:true}); 
            //알아서 req.user.email 조회해서 유저 data 쏴주는 controller_profile
            //쿠키세션 쓸때는 무조건 {withCredentials:true} 써줘야됨
            this.user = response.data
            //console.log(`################userInfo${JSON.stringify(this.user)}`);
        }catch(err){
            console.error(err);
            
        }
        },  


        // Product info READ
        async getProducts() {
            try {
                //도메인 요청, 돌아오는 response 잡기
                this.product_id = this.$route.params.product_id;
                //console.log(this.product_id)
                const response = await axios.get(`http://localhost:3000/products/${this.product_id}`);
                // product_id에 해당하는 제품 data object를 받아온다.
                //console.log(response)
                this.selectedProduct = response.data ; 
                
            }catch(err) {
                console.error(err);
            }
        },

        async getRecommendProducts() {
            try {
                const response = await axios.get(`http://localhost:3000/products/${this.product_id}/recommend/`);
                this.recommendProduct = response.data ; 
            }catch(err) {
                console.error(err);
            }
        },

        async reRendRecommend(productId){
            try{
                this.$router.push(`/products/${productId}`)
                const response = await axios.get(`http://localhost:3000/products/${productId}`);
                this.selectedProduct = response.data;
            }catch(err){
                console.error(err)
            }
        },
        
        // wish CREATE
        async addWish() {
            try {

                //login check : false값이 들어오면 (로그인되어있지 않으면) return(addWish 함수 종료). 
                if(!this.checkLogin()) return; 

                //1. selectedProduct.id 를 likes DB에 추가
                    //먼저 백단에서 사용자 인증 정보를 세션에 저장한 상태여야함.
                    //세션에서 userid를, data에서 productid를 따와 params으로 만들기.
                //const userId = this.session.userId;
                const userWish = {
                    userId : this.user.id,
                    product_Id : this.selectedProduct.id,
                };
                
                const response = await axios.post(`http://localhost:3000/orders/wish`, userWish);
                if(response.status == 201) {
                    alert("찜 리스트에 추가되었습니다.");
                }
            } catch(err) {
                //찜에 중복된 상품이 들어갈 경우(409) 에러처리
                // 에러가 있는지, 그 에러의 status가 409인지
                if(err.response && err.response.status == 409){
                    alert(err.response.data.message);
                } else {

                    
                console.error(err);
                }
            }
        },
        

        // Cart CREATE
        async addCarts() {
            try{
                //login check : false값이 들어오면 (로그인되어있지 않으면) return(addWish 함수 종료). 
                if(!this.checkLogin()) return; 

            // 1. selectedProduct.id 와 orderQuantity 를 carts DB에 추가.
                const cartingInfo = {
                    userId : this.user.id,
                    product_Id :this.selectedProduct.id,
                    quantity : this.orderQuantity, 
                }
                //console.log(`################userorder${JSON.stringify(cartingInfo)}`);

                // data를 req.body로 백에 보내고, res받아 완료 메세지 띄우기
                const response = await axios.post(`http://localhost:3000/orders/cart`, cartingInfo);

                // "장바구니 갈래? y/n"
                if(response) {
                    const GotoCart = confirm(response.data.message);
                    if(GotoCart) {
                        this.$router.push(`/cart/${this.user.id}`);              
                    /// frontserver/src/router/index.js 에 라우터 추가 
                } else {
                    alert("상품이 장바구니에 추가됐다.");
                }
                }else{
                    console.error(err);
                }

                
            }catch(err){
                console.error(err);
            }
            
        },

        //Ordering Product PUSH
        // async makeOrder(){
        //     try{
        //         //login check : false값이 들어오면 (로그인되어있지 않으면) return(addWish 함수 종료). 
        //         if(!this.checkLogin()) return; 
        //         const orderingInfo = {
        //             //userId : this.user.id,
        //             id :this.selectedProduct.id,
        //             count : this.orderQuantity, 
        //         }
        //         this.$router.push({
        //             path: `/finalOrder/${this.user.id}`, ////뷰 변경!!!
        //             query : {orderingInfoQuary : JSON.stringify(orderingInfo)},
        //         });

        //     }catch(err){
        //         console.error(err);                
        //     }
        // },
        async makeOrder(){
            try{
                //login check : false값이 들어오면 (로그인되어있지 않으면) return(addWish 함수 종료). 
                if(!this.checkLogin()) return; 

                console.log('@@@@@@@@@@@@@@@@@@@@@this.user.birth',this.user.birth);
                
                if(!this.user.birth){
                    alert('먼저 성인 인증을 해주세요')
                    this.$router.push({
                        path: `/modify`, ////뷰 변경!!!
                    })
                }else{
                    const birthDate = new Date(this.user.birth);
                    const currentDate = new Date();
                    const age = currentDate.getFullYear() - birthDate.getFullYear();
                    if(age >= 18) {
                        const orderingInfo = {
                        //userId : this.user.id,
                        id :this.selectedProduct.id,
                        count : this.orderQuantity, 
                        }
                        this.$router.push({
                            path: `/finalOrder/${this.user.id}`,
                            query : {orderingInfoQuary : JSON.stringify(orderingInfo)},
                        });
                    }else {
                        alert('미성년자는 주류 구입이 불가합니다.')
                    }              
                }
            }catch(err){
                console.error(err);                
            }
        },

        

        //check recently product
        async checkRecentlyProduct(){
            try{
                console.log('checkRecentlyProduct');
                const productId = this.$route.params.product_id;
                await axios.patch(`http://localhost:3000/products/recently/${productId}`,{},{withCredentials:true});
                console.log('checkRecentlyProduct 완료');
            }catch(err){
                console.error(err);
            }
        },
    }        
}


</script>

<style scoped>
.card-img-top {
  max-height: 500px;
  object-fit: cover;
}

p {
    margin-bottom: 0;
}


/* .price-text {
    font-weight: bold;
    font-size: 1.3rem;
} */


input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.product-main{
    padding: 20px;
    gap: 15%;
    width: 100%;
}

.product-name {
    font-weight: bold;
}

.product-info-container{
    width: 30%;
    padding: 10px 10px;
    border-top: 1px solid #000;
    border-bottom: 1px solid #000;
}

.product-image-container {
    max-width:1 1 300px;
    text-align: center; 
}

.input-box{
    width: 50px;
    border: none;
}

.product-img {
    width: 100%; 
    height: auto; 
}

.product-stock {
    display: flex; 
    justify-content: space-between; 
    padding: 20px 0;
}

.delivery-info {
    padding: 20px 0;
    display: flex; 
    justify-content: space-between; 
    
}

.delivery-corpor{
    padding: 20px 0;
    display: flex;
    justify-content: space-between;
}

.quantity-group{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px 0 20px;
    height: 70px;
    
    border-radius: 10px;
}

.total-price-container {
    display: flex; 
    justify-content: space-between; 
    align-items: center;
}

.total-price-container p {
    margin: 0;
    padding: 15px 0;
}

.total-price-container .price-txt{
    font-weight: bold; 
    font-size: 1.5rem;
}



.quantity-group p,
.delivery-info p {
    margin: 0; 
}

.button-group button {
    flex: 1; 
}

.heart-button {
    
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px;
}

.wish-heart {
    color: red;
}

.cart-button {
   
    padding: 10px 20px; 
    border-radius: 0; 
    text-align: center;
    white-space: nowrap;
}

.buy-button {
   
    
    border-radius: 0; 
    color: white; 
    background-color: black; 
    border: none; 
    text-align: center;
    white-space: nowrap;
}

.quantity-controls .btn {
    width:2.5rem;
    height: 2.5rem;
    font-size: 1.2rem;
    align-items: center;
}


.main-content {
    text-align: left;
    margin: 0 auto;
}

.image-container {
  width: 100%; 
  max-width: 600px; 
  height: 700px; 
  margin: 0 auto; 
  overflow: hidden; 
}

.product-image {
  width: 100%; 
  height: 100%; 
  /* object-fit: cover;  */
}


/* 추천상품 */

/* 추천상품 섹션 */
.recommend-container{
    cursor: pointer;
}

.card {
    height: 100%; /* 카드 높이를 자동으로 조정 */
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
}

.card-img-top {
    width: 100%; /* 이미지의 폭을 카드에 맞춤 */
    height: 300px; /* 이미지 높이 고정 */
    object-fit: contain; /* 이미지가 카드 영역에 맞게 자름 */
}

.card-body {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    text-align: center;
    height: 150px; /* 내용부 고정 높이 */
}

.card-body h5 {
    font-size: 1rem; /* 상품 이름 폰트 크기 */
    font-weight: bold;
    margin: 0; /* 간격 제거 */
    padding-bottom: 10px;
}

.card-body p {
    font-size: 0.9rem; /* 상품 가격 폰트 크기 */
    margin: 0; /* 간격 제거 */
}








</style>

