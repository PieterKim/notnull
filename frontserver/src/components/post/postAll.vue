<template>
  <div class="container mt-5">
    <h3 class="text-center mb-4">전체 게시판</h3>
    <div class="w-95 mx-auto">
      <div class="d-flex flex-column align-items-end mb-4">
        <div class="search-container d-flex justify-content-end mb-3">
          <input v-model="searchQuery" type="text" placeholder="검색" class="form-control form-control-sm me-2">
          <button @click="handleSearch" class="btn btn-primary btn-sm" style="width: 80px;">검색</button>
        </div>
        <button @click="goToAddPost" class="btn btn-primary btn-sm mt-2" style="width: 80px;">
          글쓰기
        </button>
      </div>
      <div class="table-responsive">
        <table class="table table-hover w-95 mx-auto">
          <thead class="table-light">
            <tr>
              <th scope="col" width="8%">번호</th>
              <th scope="col" width="40%">제목</th>
              <th scope="col" width="15%">작성자</th>
              <th scope="col" width="15%">작성일</th>
              <th scope="col" width="12%">수정일</th>
              <th scope="col" width="10%">좋아요</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(post, index) in paginatedPosts" :key="post.id">
              <td>{{ calculatePostNumber(index) }}</td>
              <td>
                <router-link :to="`/post/post_detail/${post.id}`" class="text-decoration-none text-dark">
                  {{ post.title }}
                </router-link>
              </td>
              <td>{{ post.Account.nickname || '익명' }}</td>
              <td>{{ new Date(post.created_at).toLocaleDateString() }}</td>
              <td>{{ new Date(post.updated_at).toLocaleDateString() }}</td>
              <td>{{ post.like_count||0 }}</td>
            </tr>
          </tbody>
        </table>
      </div>
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
  </div>
</template>

<script>
import axios from 'axios';

export default {
  computed:{
    paginatedPosts() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.posts.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.posts.length / this.itemsPerPage);
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
  data(){
    return{
      posts: [],
      originalPosts:[],
      searchQuery: '',
      isLogin:false,
      currentPage: 1,
      itemsPerPage: 10,
    };

  },
  setup(){},
  created(){
    this.AllPosts();
    this.checkLogin();
  },
  mounted(){
    
  },
  unmounted(){},
  methods:{
    async checkLogin(){
      try {
        const response = await axios.get('import.meta.env.VUE_APP_API_BASE_URL/auth/check',{withCredentials:true});
        this.isLogin = response.data.isLoggedIn;
      } catch(error) {
        return false;
      }
    },
    async AllPosts(){
        try {
            const response = await axios.get('import.meta.env.VUE_APP_API_BASE_URL/post/post_list');
            this.posts = response.data; 
            this.originalPosts = response.data;
        } catch (error) {
            // console.error('전체 게시물을 가져오는데 실패했습니다.', error);
        }
    },
    handleSearch() {
            // 원본 데이터로 시작
            let filteredPosts = [...this.originalPosts];
            // 검색어 필터
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                filteredPosts = filteredPosts.filter(post => 
                    (post.title?.toLowerCase() || '').includes(query) ||
                    (post.post_content?.toLowerCase() || '').includes(query) ||
                    (post.post_kind?.toLowerCase() || '').includes(query) ||
                    (post.Account.nickname?.toLowerCase() || '').includes(query)
                );
            }
            // 필터링된 결과 적용
            this.posts = filteredPosts;
    },
    goToAddPost() {
      if(this.isLogin){
        this.$router.push('/post/addPost');
      }else{
        alert('로그인 필요');
        this.$router.push('/login');
      }
    },
    calculatePostNumber(index) {
      return (this.currentPage - 1) * this.itemsPerPage + index + 1;
    }
  },
  watch:{
    '$route.params.post_kind':'boardList'
  }
} 
</script>

<style scoped>
.w-95 {
  width: 95% !important;
}

.table {
  width: 100%;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  border-radius: 8px;
}

.table thead th {
  border-bottom: 2px solid #dee2e6;
  font-weight: 600;
  color: #333;
  background-color: #ffffff;
}

.table td {
  border-bottom: 1px solid #eaeaea;
  padding: 1rem;
  vertical-align: middle;
}

.table-hover tbody tr:hover {
  background-color: #ffffff;
  transition: all 0.2s ease;
}

.router-link-active {
  color: #333;
}

.thumbnail {
  max-width: 100px;
  height: auto;
  border-radius: 4px;
  object-fit: cover;
}

.btn-primary {
  background-color: rgb(243, 239, 224); /* 기본 배경색 */
  transition: all 0.2s ease-in-out;
  color: #4A4A4A; /* 텍스트 색상 */
  border: none;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  border-radius: 4px;
}

.btn-primary:hover {
background-color: #e5dcc3; /* 호버 시 배경색 */
  color: #4A4A4A; /* 텍스트 색상 유지 */
}

h3 {
  text-align: center;
  margin: 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.btn-primary {
  z-index: 1;
}

.search-container {
  width: 250px;
}

.search-container input {
  width: 180px;
  font-size: 0.875rem;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.text-decoration-none:hover {
  color: #007bff !important;
  text-decoration: underline !important;
  cursor: pointer;
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
</style>