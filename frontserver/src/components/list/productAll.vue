<template>
  <div>

    <div>
      <input v-model="searchQuery"  type="text"  placeholder="검색어를 입력하세요"  @keyup.enter="searchProducts" />
      <button @click="searchProducts">검색</button>
    </div>

    <h1>상품 목록</h1>
    <div v-for="product in filteredProducts" :key="product.id" class="product-card">
      <router-link :to="'/products/' + product.id">
        <h3>{{ product.product_name }}</h3>
        <p>{{ product.product_description }}</p>
        <p>{{ product.drink_type }}</p>
        <p>{{ product.product_price }}</p>
      </router-link>
    </div>

    <div v-if="noResultsMessage" class="no-results">
      {{ noResultsMessage }}
    </div>

    <div class="container">
      <div v-for="product in filteredProducts" :key="product.id" class="product-card" @click="goProducts(product.id)" >
        <img :src="product.product_image" :alt="product.name" />
        <div class="product-details">
          <div class="tags">
            <p v-if="product.isTagged" class="recommended-badge">👍추천상품</p>
            <p v-if="product.isTagged" class="popular-badge">🔥인기상품</p>
          </div>
          <h2 class="product-title">{{ product.product_name }}</h2>
          <p class="product-price">{{ product.product_price }} 원</p>
          
        </div>
      </div>
    </div>


  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      products: [],
      searchQuery: '',
      filteredProducts: [],
      noResultsMessage: '',
    };
  },
  created() {
    this.fetchProducts();
  },
  methods: {
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

    // 상품 목록 조회
    async fetchProducts() {
      try {
        const response = await axios.get('http://localhost:3000/liqueur');
        this.products = response.data;

        const randomIndexes = this.getRandomIndexes(this.products.length, 4);
        this.products = this.products.map((product, index) => ({
          ...product,
          isTagged: randomIndexes.includes(index),
        }));

        this.filteredProducts = this.products;  // 처음엔 모든 상품을 표시
      } catch (error) {
        console.error(error);
      }
    },
    // 상품 검색
    searchProducts() {
      if (this.searchQuery.trim() === '') {
        this.filteredProducts = this.products;
      } else {
        this.filteredProducts = this.products.filter(product =>
          product.product_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          product.product_description.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          product.drink_type.toLowerCase().includes(this.searchQuery.toLowerCase())
        );

        if (this.filteredProducts.length === 0) {
          this.noResultsMessage = '검색 내용이 없습니다.';
          this.noResultsMessage = '';
        }
      }
      this.searchQuery = '';
    },

    goProducts(productId) {
        // 제품 페이지 이동 로직 (예: 라우터 사용)
        this.$router.push(`/products/${productId}`);
      },

  },
};
</script>

<style scoped>
.buy-button {
  /* display: block; */
  margin-bottom: 10px; /* 구매 버튼 아래 여백 */
  display: flex;
  flex-direction: column; /* 세로로 배치 */
  align-items: center; /* 중앙 정렬 */
}
.container {
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start; /* 왼쪽 정렬 */
  gap: 50px; /* 아이템 간의 간격 */
}

.product-card {
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  width: 250px;
  margin: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  text-align: center;
  overflow: hidden;
  transition: transform 0.3s;
  cursor: pointer;
}
.product-card:hover {
  transform: scale(1.05);
}
.product-card img {
  max-width: 100%;
  height: auto;
}
.product-details {
  display: flex;
  flex-direction: column;
  align-items: center; /* 수평 중앙 정렬 */
  justify-content: center; /* 수직 중앙 정렬 */
  text-align: center; /* 텍스트 중앙 정렬 */
  padding: 15px;
}
.product-title {
  font-size: 18px;
  font-weight: bold;
  margin: 10px 0;
}
.product-price {
  font-size: 16px;
  color: #e63946;
}
.buy-button {
  display: inline-block;
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s;
}
.buy-button:hover {
  background-color: #0056b3;
}

/* 배지들을 세로가 아닌 가로로 나란히 배치 */
.tags {
  display: flex;
  justify-content: center; /* 배지들 가로로 중앙 정렬 */
  margin-top: 10px; /* 배지와 버튼 간의 여백 */
}

.recommended-badge, .popular-badge {
  font-size: 14px; /* 배지 크기 */
  margin-right: 3px; /* 배지 간의 간격을 설정 */
}

/* 인기상품 배지 색상 */
.popular-badge {
  color: red;
  display: inline-block;
  padding: 5px 10px;
  font-size: 12px;
  font-weight: bold;
  border-radius: 5px;
}
/* 추천상품 배지 색상 */
.recommended-badge {
  display: inline-block;
  /* background-color: #ffcc00; */
  color: blue;
  padding: 5px 10px;
  font-size: 12px;
  font-weight: bold;
  border-radius: 5px;
}

/* 마지막 배지는 오른쪽 여백 없애기 */
.popular-badge:last-child {
  margin-right: 0;
}
</style>