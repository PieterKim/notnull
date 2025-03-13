<template>
<div>
    <div class="cart-content">
        <h1>장바구니</h1>
    <table class="table cart-table">
            <thead>
                <tr>
                    <th>
                        <input type="checkbox" id="selectAll" v-model="allSelected" @click="selectAll()" />
                        <label for="selectAll"></label>
                    </th>
                    <th>상품 이미지</th>
                    <th>상품명</th>
                    <th>수량</th>
                    <th>상품금액</th>
                    <th>합계금액</th>
                    <th>삭제</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="cartedProduct in cartedProducts" :key="cartedProduct.id">
                    <td>
                        <input type="checkbox" :id="'product-' + cartedProduct.id" v-model="cartedProduct.selected" @change="updateSelectedProduct()" />
                        <label :for="'product-' + cartedProduct.id"></label>
                    </td>
                    <td><img :src="cartedProduct.Product.product_image" alt="" class="product-img" /></td>
                    <td>{{cartedProduct.Product.product_name}}</td>
                    <td class="count-content">
                        <button @click="minusC(cartedProduct)">-</button>
                        <span class="count-box">{{cartedProduct.count}}</span>
                        <button @click="plusC(cartedProduct)">+</button>
                    </td>
                    <td>{{cartedProduct.Product.product_price.toLocaleString()}}</td>
                    <td>{{(cartedProduct.count * cartedProduct.Product.product_price).toLocaleString()}}원</td>
                    <td><button @click="deleteProduct(cartedProduct.id)">삭제</button></td>
                </tr>
        </tbody>
    </table>
        
        <div class="but-content">
            <table>
                <thead>
                    <tr>
                        <th>선택상품금액 </th>
                        <th>배송비</th>
                        <th>주문금액</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{{finalTotalPrice}}원</td>
                        <td>{{deliveryFee}}원</td>
                        <td>{{finalTotalPrice + deliveryFee}}원</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div>

            <button @click="makeOrder(false)">선택상품 주문</button>
            <button @click="makeOrder(true)">전체상품 주문</button>
            <button @click="deleteSelectedProduct()">선택상품삭제</button>
        </div>
        
    </div>
</div>
</template>


<script>
import axios from 'axios';


export default{ 
    name:'',
    components:{},
    computed : {

    },
    data(){
        return{
            cartedProducts : [],
            selectedProducts: [],
            userid : null,
            productInfoForOrder : [],
            //{"id":8,"count":1,"total_price":2790000,"createdAt":"2025-01-08T04:14:53.000Z","updatedAt":"2025-01-08T04:14:53.000Z","account_id":4,"product_id":4,
            // "Product":{"product_name":"달모어 25년 700ml","product_price":2790000,"product_image":"http://www.kajawine.kr/data/item/4363187205/thumb-TheDalmore25YearsOldbottle_360x480.jpg"}},
            finalTotalPrice: 0,
            deliveryFee : 3000,
            allSelected : false,
            user : [],
        };
    },
    setup(){},
    created(){},
    mounted(){
        this.getCartedProducts()
        this.getUserProfile()

    },
    unmounted(){},
    methods:{
        //총액 계산 함수
        calculateTotal(){
            this.finalTotalPrice = this.selectedProducts.reduce((acc, selectedProduct) => acc + selectedProduct.Product.product_price * selectedProduct.count, 0 )
        },

        // 제품 수량 변경 함수
        plusC(cartedProduct){
            cartedProduct.count += 1 
            this.calculateTotal()
        },

        minusC(cartedProduct){
            if(cartedProduct.count > 1){
                cartedProduct.count -= 1 
                this.calculateTotal()
            } return;
        },

        // 선택함수
        updateSelectedProduct(){
            this.selectedProducts = this.cartedProducts.filter((cartedProduct) => cartedProduct.selected);
            this.allSelected = (this.selectedProducts.length === this.cartedProducts.length);
            this.calculateTotal();
            console.log(`#####################${JSON.stringify(this.cartedProducts)}, ${this.cartedProducts.length}`)
            console.log(`#####################${JSON.stringify(this.selectedProducts)}, ${this.selectedProducts.length}`)
        },

        selectAll(){
            this.allSelected = !this.allSelected;
            this.cartedProducts.forEach((cartedProduct) => {cartedProduct.selected = this.allSelected;});
            this.updateSelectedProduct();
        },

        // GET user profile
        async getUserProfile(){
        try{
            const response = await axios.get(`import.meta.env.VUE_APP_API_BASE_URL/profile/`, {withCredentials:true}); 
            //알아서 req.user.email 조회해서 유저 data 쏴주는 controller_profile
            //쿠키세션 쓸때는 무조건 {withCredentials:true} 써줘야됨
            this.user = response.data
            //console.log(`################userInfo${JSON.stringify(this.user)}`);
        }catch(err){
            console.error(err);
        }
        },  


        //Cart READ
        async getCartedProducts() {
            try {
                this.userid = this.$route.params.userId
                const response = await axios.get(`import.meta.env.VUE_APP_API_BASE_URL/orders/cart/${this.userid}`);
                this.cartedProducts = response.data;

                this.cartedProducts = this.cartedProducts.map(cartedProduct => ({...cartedProduct, selected : true})); // selected 기본값 true
                console.log(`#####################this.cartedProducts${JSON.stringify(this.cartedProducts)}`)
                // 선택된 제품을 selectedProducts 배열에 넣기
                this.updateSelectedProduct();
                //총액 계산
                this.calculateTotal();
            }catch(err){
                console.error(err);
            }            
        },

        //Cart DELETE
        async deleteProduct(cartedProduct_id){
            try{
                const deleteCart = confirm("해당 제품을 장바구니에서 삭제하시겠습니까?");
                if(!deleteCart){return;}

                const response = await axios.delete(`import.meta.env.VUE_APP_API_BASE_URL/orders/cart`, {data : {ids : [cartedProduct_id]}});
                if (response.status === 200) {
                    alert("장바구니에서 삭제되었다");
                    this.cartedProducts = this.cartedProducts.filter(c => c.id !== cartedProduct_id);
                    
                    //총액 계산
                    this.calculateTotal()                    
                }
                console.log(response);
            }catch(err){
                console.error(err);
            }
        },

        async deleteSelectedProduct() {
            try{
                const selectedIds = this.selectedProducts.map((selectedProduct) => selectedProduct.id );
                const deleteCart = confirm("선택 제품을 장바구니에서 삭제하시겠습니까?");
                if(!deleteCart){return;}       

                const response =await axios.delete(`import.meta.env.VUE_APP_API_BASE_URL/orders/cart`, {data : {ids : [selectedIds]}})
                if (response.status === 200) {
                    alert("장바구니에서 삭제되었다");
                    this.cartedProducts = this.cartedProducts.filter(c => !selectedIds.includes(c.id));
                }
                console.log(response);
                this.calculateTotal()
            }catch(err){
                console.error(err);
            };
        },


        //Ordering Product PUSH to FinalOrderView.vue '/finalOrder/:userId'
        async makeOrder(order){
            try{                        
                //성인 인증
                console.log('@@@@@@@@@@@@@@@@@@@@@this.user.birth',this.user.birth);
                const birthDatA = this.user.birth
                
                if(!birthDatA){
                    alert('먼저 성인 인증을 해주세요')
                    this.$router.push({
                        path: `/modify`, ////뷰 변경!!!
                    })
                }else{
                    const birthDate = new Date(birthDatA);
                    const currentDate = new Date();
                    const age = currentDate.getFullYear() - birthDate.getFullYear();
                    if(age >= 18) {
                       alert('성인입니다')

                          // 주문생성
                          this.userid = this.$route.params.userId
                          //전체주문 = true / 선택주문 = false
                          if(order){
                              this.productInfoForOrder = this.cartedProducts;
                          }else{
                              this.productInfoForOrder = this.selectedProducts;
                          }               
                          console.log(`##############this.productInfoForOrder:${JSON.stringify(this.productInfoForOrder)}`)
                          this.$router.push({
                              path: `/finalOrder/${this.userid}`, /////// 뷰 변경!!!!!!
                              query : {productInfoQuery : JSON.stringify(this.productInfoForOrder)}
                          });

                    }else {
                        alert('미성년자는 주류 구입이 불가합니다.')
                    }              
                }

            }catch(err){
                console.error(err);
            }
        },

    }
}

</script>

<style scoped>

/* 체크박스 스타일 */
.cart-table input[type="checkbox"] {
  display: none; /* 기본 체크박스 숨김 */
}

.cart-table input[type="checkbox"] + label {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #000; /* 검은색 테두리 */
  border-radius: 3px;
  background-color: #fff; /* 기본 흰 배경 */
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease-in-out;
}

.cart-table input[type="checkbox"]:checked + label {
  background-color: rgb(243, 239, 224); /* 체크된 상태 배경색 */
  border-color: rgb(243, 239, 224); /* 체크된 상태 테두리 색상 */
}

.cart-table input[type="checkbox"] + label::after {
  content: '';
  display: block;
  width: 12px;
  height: 12px;
  background-color: #000; /* 내부 검은색 */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0); /* 체크 전 크기 0 */
  border-radius: 2px;
  transition: transform 0.2s ease-in-out;
}

.cart-table input[type="checkbox"]:checked + label::after {
  transform: translate(-50%, -50%) scale(1); /* 체크 시 크기 1 */
  background-color: #000; /* 체크된 상태 내부 색상 */
}

/* 테이블 스타일 */
.cart-content {
  margin-top: 50px;
  max-width: 1200px;
  margin: 50px auto;
  padding: 20px;
  background-color: #fff; /* 흰색 배경 */
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  color: #4A4A4A; /* 텍스트 색상 변경 */
  margin-bottom: 20px;
  font-size: 2rem;
}

.cart-table {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
  margin-bottom: 30px;
  background-color: #fff; /* 테이블 흰색 배경 */
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.cart-table th {
  text-align: center;
  vertical-align: middle;
  background-color: #f9f9f9; /* 연한 회색 */
  color: #4A4A4A; /* 텍스트 색상 변경 */
  padding: 15px;
  font-size: 1rem;
  border-bottom: 2px solid #ddd;
}

.cart-table td {
  text-align: center;
  vertical-align: middle;
  font-size: 1rem;
  color: #4A4A4A; /* 텍스트 색상 변경 */
  padding: 15px;
  border-bottom: 1px solid #ddd;
  height: 80px;
}

.cart-table tr:last-child td {
  border-bottom: none;
}

/* 모든 버튼 스타일 */
button {
  padding: 8px 15px;
  border-radius: 5px;
  background-color: rgb(243, 239, 224); /* 기본 배경색 */
  color: #4A4A4A; /* 텍스트 색상 */
  border: none; /* 테두리 제거 */
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

button:hover {
  background-color: #e5dcc3; /* 호버 시 배경색 */
  color: #4A4A4A; /* 텍스트 색상 유지 */
}

/* 이미지 스타일 */
.product-img {
  max-width: 100px;
  max-height: 100px;
  object-fit: contain;
  display: block;
  margin: 0 auto;
  border: 1px solid #ddd; /* 연한 회색 테두리 */
  border-radius: 5px;
  padding: 5px;
}

/* 수량 조절 스타일 */
.count-content {
  text-align: center;
  vertical-align: middle;
}

.count-content button,
.count-content .count-box {
  display: inline-block;
  vertical-align: middle;
}

.count-content .count-box {
  width: 50px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #fff;
  font-size: 1rem;
  color: #000; /* 검은색 글자 */
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  margin: 0 5px;
}

/* 주문 및 총액 섹션 스타일 */
.but-content {
  margin-top: 30px;
  padding: 20px;
  background-color: #fff; /* 흰색 배경 */
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.but-content p {
  font-size: 1.5rem;
  color: #4A4A4A; /* 텍스트 색상 */
  margin-bottom: 20px;
}

.but-content table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  background-color: #fff; /* 흰색 배경 */
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.but-content th {
  font-size: 1.2rem;
  background-color: #f9f9f9; /* 연한 회색 */
  color: #4A4A4A; /* 텍스트 색상 */
  padding: 15px;
  border-bottom: 2px solid #ddd;
}

.but-content td {
  font-size: 1.2rem;
  color: #4A4A4A; /* 텍스트 색상 */
  padding: 15px;
  border-bottom: 1px solid #ddd;
}

.but-content tr:last-child td {
  border-bottom: none;
}

.but-content + div {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

@media (max-width: 1400px) {
  .count-content .count-box {
    width: 40px; /* 수량 입력 칸 너비 축소 */
    height: 30px; /* 수량 입력 칸 높이 축소 */
    line-height: 30px; /* 텍스트 중앙 정렬 */
    font-size: 0.9rem; /* 폰트 크기 축소 */
  }

  .cart-table td {
    padding: 0;
  }

  .count-content button {
    width: 30px; /* 버튼 너비 축소 */
    height: 30px; /* 버튼 높이 축소 */
    padding: 4px; /* 버튼 내부 패딩 축소 */
    font-size: 0.9rem; /* 버튼 폰트 크기 축소 */
  }
}


/* 화면 너비가 1200px 이하일 때 */
@media (max-width: 1200px) {
  .but-content + div {
    justify-content: space-around; /* 버튼 균등 배치 */
    gap: 15px; /* 간격 유지 */
  }

  .but-content + div button {
    flex: 1; /* 버튼 크기 균등 */
    max-width: 200px; /* 버튼 최대 너비 설정 */
    min-width: 100px; /* 버튼 최소 너비 설정 */
  }
}

/* 화면 너비가 768px 이하일 때 */
@media (max-width: 768px) {
  .cart-content {
    padding: 15px;
  }

  h1 {
    font-size: 1.5rem;
  }

  .cart-table {
    display: block;
    overflow-x: auto; /* 가로 스크롤 허용 */
    white-space: nowrap; /* 텍스트 줄바꿈 방지 */
  }

  .cart-table th,
  .cart-table td {
    font-size: 0.9rem;
    padding: 10px;
  }

  .count-content .count-box {
    width: 40px;
    height: 30px;
    line-height: 30px;
    font-size: 0.9rem;
  }

  .count-content button {
    padding: 4px 8px;
    font-size: 0.9rem;
  }

  .product-img {
    max-width: 60px; /* 이미지 크기 축소 */
    max-height: 60px;
  }

  .but-content p {
    font-size: 1.2rem;
  }

  .but-content table th,
  .but-content table td {
    font-size: 1rem;
    padding: 10px;
  }

  .but-content + div {
    flex-wrap: wrap; /* 버튼 줄바꿈 허용 */
    gap: 10px;
    justify-content: center; /* 중앙 정렬 */
  }

  .but-content + div button {
    padding: 6px 10px;
    font-size: 0.9rem;
    max-width: 180px; /* 버튼 최대 너비 설정 */
    min-width: 100px; /* 버튼 최소 너비 설정 */
    flex: 1; /* 버튼 크기 균등 */
  }
}

/* 화면 너비가 480px 이하일 때 */
@media (max-width: 480px) {
  .cart-content {
    padding: 10px;
  }

  h1 {
    font-size: 1.2rem;
  }

  .cart-table {
    display: block;
    overflow-x: auto; /* 가로 스크롤 허용 */
    white-space: nowrap; /* 텍스트 줄바꿈 방지 */
  }

  .cart-table th,
  .cart-table td {
    font-size: 0.8rem;
    padding: 8px;
  }

  .count-content .count-box {
    width: 35px;
    height: 25px;
    line-height: 25px;
    font-size: 0.8rem;
  }

  .count-content button {
    padding: 3px 6px;
    font-size: 0.8rem;
  }

  .product-img {
    max-width: 50px; /* 이미지 크기 축소 */
    max-height: 50px;
  }

  .but-content p {
    font-size: 1rem;
  }

  .but-content table th,
  .but-content table td {
    font-size: 0.9rem;
    padding: 8px;
  }

  .but-content + div {
    flex-direction: column; /* 버튼 세로 정렬 */
    gap: 8px;
    justify-content: center; /* 중앙 정렬 */
  }

  .but-content + div button {
    padding: 5px 8px;
    font-size: 0.8rem;
    width: 100%; /* 버튼 전체 너비 */
    margin: 0 auto 0 auto;
  }
}









</style>

