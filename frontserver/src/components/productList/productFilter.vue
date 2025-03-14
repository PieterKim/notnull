<template>

  <div class="div1">
    <h1>상품 목록</h1>
    <!-- 검색기능 -->
    <div class="search-container">
      <input
        v-model="searchQuery"
        placeholder="검색어를 입력하세요"
        @keyup.enter="searchProducts"
      />
      <button @click="searchProducts">검색</button>
    </div>
    <div v-if="filteredProducts && filteredProducts.length">
      <!-- 그리드 레이아웃 적용: .container 클래스 추가 -->
      <div class="container">
        <div v-for="product in paginatedProducts" :key="product.id" class="product-card" @click="goProducts(product.id)">
          <img :src="product.product_image" :alt="product.name" />
          <div class="product-details">
            <div class="tags">
              <p v-if="product.isTagged" class="recommended-badge">👍추천상품</p>
              <p v-if="product.isTagged" class="popular-badge">🔥인기상품</p>
            </div>
            <h2 class="product-title">{{ product.product_name }}</h2>
            <p class="product-price">{{ product.product_price }} 원</p>
            <!-- 호버시 장바구니 찜 하기 버튼 추가 1월 13일 규태 -->
            <div class="product-actions">
              <button @click.stop="goWish(product)">
                <i class="fas fa-heart"></i> 
              </button>
              <button @click.stop="goCarts(product)">
                <i class="fas fa-shopping-cart"></i> 
              </button>
            </div>
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
  props: ['drink_type'],
  data() {
    return {
      products: [],             // 전체 상품 목록
      filteredProducts: [],     // 필터된 상품 목록
      searchQuery: '',          // 검색어
      currentPage: 1,           // 현재 페이지
      itemsPerPage: 20,         // 한 페이지에 보여줄 상품 수
      noResultsMessage: '',     // 검색 결과가 없을 때 메시지
      orderQuantity:1,
      user: {id:null}
    };
  },
  watch: {
    '$route.query.search'(newSearch) {
      if (newSearch) {
        this.searchQuery = newSearch;
        this.filterProductsBySearch();
      } else {
        this.searchQuery = '';
        this.fetchProductsByType(this.drink_type);
      }
    },
    drink_type(newDrinkType) {
      this.fetchProductsByType(newDrinkType);  // drink_type이 변경되면 다시 필터링
    },
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
  mounted() {
    this.fetchProductsByType(this.drink_type);  // 초기 로드 시 drink_type에 맞는 상품들만 불러오기
    this.getUserProfile()
  },
  methods: {
    // drink_type에 맞는 상품 목록을 불러오는 메서드
    async fetchProductsByType(drinkType) {
      try {
        const response = await api.get(`/liqueur/liqueur/${drinkType}`);
        this.products = response.data;
          
          const randomIndexes = this.getRandomIndexes(this.products.length, 3);
          this.products = this.products.map((product, index) => ({
          ...product,
          isTagged: randomIndexes.includes(index),
          }));
        this.filteredProducts = this.products;  // 초기에는 모든 상품을 표시
        this.searchProducts();  // 검색어가 있다면 필터링
      } catch (error) {
        console.error('상품을 불러오는 데 실패했습니다.', error);
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
        this.filteredProducts = this.products;  // 검색어가 없으면 모든 상품을 표시
        this.noResultsMessage = '';  // 메시지 초기화
      } else {
        this.filterProductsBySearch();
      }
    },

    // 상품 상세 페이지로 이동
    goProducts(productId) {
        // 제품 페이지 이동 로직 (예: 라우터 사용)
        this.$router.push(`/products/${productId}`);
      },

    // 검색어로 상품 필터링
    filterProductsBySearch() {
      const query = this.searchQuery.toLowerCase();
      this.filteredProducts = this.products.filter(product =>
        product.product_name.toLowerCase().includes(query) ||
        product.product_description.toLowerCase().includes(query) ||
        product.drink_type.toLowerCase().includes(query)
      );
      if (this.filteredProducts.length === 0) {
        this.noResultsMessage = '검색 내용이 없습니다.';
      } else {
        this.noResultsMessage = '';
      }
    },
 

        checkLogin() {
          if (!this.user || !this.user.id) {
            alert("로그인이 필요합니다");
            return false;  // 로그인되지 않은 경우
          }
          console.log('유저아이디', this.user.id);
          return true;  // 로그인된 경우
        },

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



        async goCarts(product) {
            try{
                //login check : false값이 들어오면 (로그인되어있지 않으면) return(addWish 함수 종료). 
                if(!this.checkLogin()) return; 

            // 1. selectedProduct.id 와 orderQuantity 를 carts DB에 추가.
                const cartingInfo = {
                    userId : this.user.id,
                    product_Id :product.id,
                    quantity : this.orderQuantity, 
                }

                // data를 req.body로 백에 보내고, res받아 완료 메세지 띄우기
                const response = await api.post(`/orders/cart`, cartingInfo);
                console.log(response)
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

        async goWish(product) {
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
                console.log(response)
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


  },
};
</script>

<style scoped>
.div1 {
  margin-top: 100px;
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
  transition: transform 0.3s ease;
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

  aspect-ratio: 4 / 3;
  transition: opacity 0.3s;
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