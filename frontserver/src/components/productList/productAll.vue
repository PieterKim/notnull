<template>
  <div class="div1">
   <h1>상품 목록</h1>
   <div class="search-container">
      <input v-model="searchQuery" placeholder="검색어를 입력하세요" @keyup.enter="searchProducts" />
      <button @click="searchProducts">검색</button>
    </div>
   <div class="container">
      <div v-for="product in paginatedProducts" :key="product.id" class="product-card" @click="goProducts(product.id)">
        <img :src="product.product_image" :alt="product.product_name" />
        <div class="product-details">
          <div class="tags">
            <p v-if="product.isTagged" class="recommended-badge">👍 추천상품</p>
            <p v-if="product.isTagged" class="popular-badge">🔥 인기상품</p>
          </div>
          <h2 class="product-title">{{ product.product_name }}</h2>
          <p class="product-price">{{ product.product_price }} 원</p>
        <!-- 호버시 장바구니 찜 하기 버튼 추가 1월 12일 동진-->
         <div class="product-actions">
          <button @click.stop="addWish(product)">
            <i class="fas fa-heart"></i> 
          </button>
          <button @click.stop="addCarts(product)">
            <i class="fas fa-shopping-cart"></i> 
          </button>
         </div>       
        </div>
      </div>

  </div>


    <div v-if="noResultsMessage" class="no-results">
      {{ noResultsMessage }}
    </div>



    <!-- 페이지네이션 -->
    <nav aria-label="Page navigation">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a class="page-link" href="#" @click.prevent="currentPage--">이전</a>
        </li>
        <li class="page-item" v-for="page in displayedPages" :key="page" :class="{ active: page === currentPage }">
          <a class="page-link" href="#" @click.prevent="currentPage = page">{{ page }}</a>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a class="page-link" href="#" @click.prevent="currentPage++">다음</a>
        </li>
      </ul>
    </nav>
  

</div>


</template>

<script>
import api from "@/api.js"

export default {
  data() {
    return {

      products: [],
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 20,
      filteredProducts: [],
      noResultsMessage: '',
      user: {id:null},
      orderQuantity:1,
    };
  },

  created() {
    this.fetchProducts();  // 컴포넌트 생성 시 상품 데이터를 가져옵니다.
    this.getUserProfile()

  },
  computed: {
    // 현재 페이지에 맞게 상품 목록을 잘라서 보여줌
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredProducts.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    },
    displayedPages() {
      const pages = [];
      let start, end;

      if (this.totalPages <= 3) {
        start = 1;
        end = this.totalPages;
      } else {
        if (this.currentPage === 1) {
          start = 1;
          end = 3;
        } else if (this.currentPage === this.totalPages) {
          start = this.totalPages - 2;
          end = this.totalPages;
        } else {
          start = this.currentPage - 1;
          end = this.currentPage + 1;
        }
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    }
  },
  methods: {
    // 상품 목록 조회
    async fetchProducts() {
      try {
        const response = await api.get('/liqueur/liqueur'); // 상품 데이터 가져오기
        this.products = response.data;
        const randomIndexes = this.getRandomIndexes(this.products.length, 10);
        this.products = this.products.map((product, index) => ({
          ...product,
          isTagged: randomIndexes.includes(index),
        }));
        this.filteredProducts = this.products;  // 처음엔 모든 상품을 표시

      } catch (error) {
        console.error(error);
      }
    },
    getRandomIndexes(arrayLength, count) {
    const indexes = [];
    while (indexes.length < count) {
      const randomIndex = Math.floor(Math.random() * arrayLength);
      if (!indexes.includes(randomIndex)) {
        indexes.push(randomIndex);
      }
    }
    return indexes;
  },

    // 검색 기능
    searchProducts() {
      if (this.searchQuery.trim() === '') {
        // 검색어가 없으면 전체 상품 목록을 표시
        this.filteredProducts = this.products;  
        this.noResultsMessage = '';  // 메시지 초기화
        this.currentPage = 1;  // 첫 페이지로 리셋
      } else {
        // 검색어가 있을 경우 필터링
        this.filteredProducts = this.products.filter(product =>
          product.product_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          product.product_description.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          product.drink_type.toLowerCase().includes(this.searchQuery.toLowerCase())
        );

        // 검색 결과 메시지 처리
        if (this.filteredProducts.length === 0) {
          this.noResultsMessage = '검색 내용이 없습니다.';  
        } else {
          this.noResultsMessage = '';  
        }
        this.currentPage = 1;  // 검색 후 첫 페이지로 이동
      }
    },

    // 상품 상세 페이지로 이동
    goProducts(productId) {

        // 제품 페이지 이동 로직 (예: 라우터 사용)
        this.$router.push(`/products/${productId}`);
      },

      checkLogin () {
            if(!this.user || !this.user.id) {
                alert("로그인이 필요합니다");
                this.$router.push('/login');
                return false;
            }else {
                return true;
            }
        },

     async getUserProfile(){
        try{
            const response = await apit.get(`/profile/`, {withCredentials:true}); 
            //알아서 req.user.email 조회해서 유저 data 쏴주는 controller_profile
            //쿠키세션 쓸때는 무조건 {withCredentials:true} 써줘야됨
            this.user = response.data
        }catch(err){
            console.error(err);
            
        }
        },  


     async addWish(product) {
            try {

                //login check : false값이 들어오면 (로그인되어있지 않으면) return(addWish 함수 종료). 
                if(!this.checkLogin()) return; 

                //1. selectedProduct.id 를 likes DB에 추가
                    //먼저 백단에서 사용자 인증 정보를 세션에 저장한 상태여야함.
                    //세션에서 userid를, data에서 productid를 따와 params으로 만들기.
                //const userId = this.session.userId;
                const userWish = {
                    userId : this.user.id,
                    product_Id : product.id,
                };
                
                const response = await api.post(`/orders/wish`, userWish);
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

       async addCarts(product) {
            try{
                //login check : false값이 들어오면 (로그인되어있지 않으면) return(addWish 함수 종료). 
                if(!this.checkLogin()) return; 

            // 1. selectedProduct.id 와 orderQuantity 를 carts DB에 추가.
                const cartingInfo = {
                    userId : this.user.id,
                    product_Id :product.id,
                    quantity : this.orderQuantity, 
                }
                //console.log(`################userorder${JSON.stringify(cartingInfo)}`);

                // data를 req.body로 백에 보내고, res받아 완료 메세지 띄우기
                const response = await api.post(`/orders/cart`, cartingInfo);

                // "장바구니 갈래? y/n"
                if(response) {
                    const GotoCart = confirm(response.data.message);
                    if(GotoCart) {
                        this.$router.push(`/cart/${this.user.id}`);              
                    /// frontserver/src/router/index.js 에 라우터 추가 
                } else {
                    alert("장바구니에 추가 되었습니다..");
                }
                }else{
                    console.error(err);
                }

                
            }catch(err){
                console.error(err);
            }
            
        },  

  },
};
</script>

<style scoped>
.div1 {
  margin-top: 100px;
}

.buy-button {
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.container {
 /* padding: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px; */

  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 한 줄에 4개씩 표시 */
  gap: 20px; /* 상품 간 간격 */
  padding: 20px;
}

.product-card {
  /* position: relative;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  text-align: center;
  transition: transform 0.3s, background-color 0.3s;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%; */


  cursor: pointer;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  text-align: center;
  background-color: #fff;
  transition: transform 0.3s, background-color 0.3s;
}

.product-card:hover {
  transform: scale(1.05);
  background-color: rgba(0, 0, 0, 0.6); 
  color: white; 
}

.product-card img {
  /* width: 100%;
  height: auto;
  aspect-ratio: 4 / 3;
  object-fit: contain;
  transition: opacity 0.3s; */

  transition: opacity 0.3s;
  aspect-ratio: 4 / 3;
  object-fit: contain;
  width: 100%; /* 컨테이너에 맞춤 */
  max-width: 250px; /* 최대 크기 */
  height: auto; /* 비율 유지 */
  margin: 0 auto 10px;
  display: block;
}


.product-card:hover img {
  opacity: 0.5; 
}

.product-details {
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.tags {
  display: flex;
  justify-content: center;
  gap: 5px;
  margin-bottom: 10px;
  min-height: 20px;
}

.recommended-badge,
.popular-badge {
  font-size: 14px;
  padding: 5px 10px;
  font-weight: bold;
  border-radius: 5px;
  white-space: nowrap;
}

.popular-badge {
  color: red;
}

.recommended-badge {
  color: blue;
}

.product-title {
  font-size: 16px;
  font-weight: bold;
  margin: 10px 0;
  min-height: 40px;
}

.product-price {
  font-size: 14px;
  color: #e63946;
  min-height: 20px;
}

/* 추가된 버튼 영역 */
.product-actions {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: none; 
  flex-direction: row; 
  justify-content: center;
  align-items: center;
  gap: 20px; 
  z-index: 2;
}

.product-card:hover .product-actions {
  display: flex; 
}

.product-actions button {
  background-color: transparent;
  border: none;
  padding: 10px;
  font-size: 24px;
  cursor: pointer;
  transition: transform 0.3s, color 0.3s;
}

/* 쇼핑 카트 아이콘 */
.product-actions button i.fa-shopping-cart {
  color: white;
}

.product-actions button:hover i.fa-shopping-cart {
  color: #e63946; 
}

/* 하트 아이콘 */
.product-actions button i.fa-heart {
  color: white;
}

.product-actions button:hover i.fa-heart {
  color: red; 
}

/* 버튼 애니메이션 */
.product-actions button:hover {
  transform: scale(1.2); 
}

.product-actions button:active {
  transform: scale(0.9); 
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  list-style: none;
  padding: 0;
}

.page-item {
  margin: 0 5px;
}

.page-item.disabled .page-link {
  cursor: not-allowed;
  opacity: 0.5;
}

.page-item.active .page-link {
  background-color: #f3efe0; /* 기존 버튼 배경색 */
  color: #4a4a4a; /* 기존 버튼 텍스트 색상 */
  border-color: #f3efe0;
  font-weight: bold;
}

.page-link {
  display: inline-block;
  padding: 10px 15px;
  border-radius: 5px;
  border: 1px solid #ddd;
  background-color: #fff; /* 기본 버튼 배경색 */
  color: #4a4a4a; /* 기본 텍스트 색상 */
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.page-link:hover {
  background-color: #e5dcc3; /* 호버 시 배경색 */
  color: #000; /* 호버 시 텍스트 색상 */
}

.page-item.active .page-link:hover {
  background-color: #e5dcc3; /* 호버 시 배경색 */
  color: #000; /* 호버 시 텍스트 색상 */
}

.search-container {
  display: flex;
  justify-content: flex-end; /* 오른쪽 끝으로 정렬 */
  align-items: center; /* 입력과 버튼을 수직으로 정렬 */
  gap: 10px; /* 입력과 버튼 사이 간격 */
  margin-right: 20px; /* 오른쪽 여백 추가 (필요시 조정) */
}

.search-container input {
  padding: 5px 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.search-container button {
  padding: 6px 12px;
  font-size: 14px;
  background-color: #f3efe0;
  color: #4a4a4a;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.search-container button:hover {
  background-color: #f3efe0;
}


</style>