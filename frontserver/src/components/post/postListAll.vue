<template>
  <div class="container mt-5">
    <h3 class="mb-4">전체 게시판</h3>
    <div class="table-responsive">
      <table class="table table-hover w-85 mx-auto">
        <thead class="table-light">
          <tr>
            <th scope="col" width="10%">번호</th>
            <th scope="col" width="30%">제목</th>
            <th scope="col" width="20%">이미지</th>
            <th scope="col" width="20%">작성일</th>
            <th scope="col" width="10%">좋아요</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(post, index) in posts" :key="post.id">
            <td>{{ index + 1 }}</td>
            <td>
              <router-link :to="`/post/post_detail/${post.id}`" class="text-decoration-none text-dark">
                {{ post.title }}
              </router-link>
            </td>
            <td>
              <img v-if="post.post_image" :src="post.post_image" alt="게시글 이미지" class="thumbnail" />
            </td>
            <td>{{ new Date(post.created_at).toLocaleDateString() }}</td>
            <td>{{ post.like_count }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 게시글 세부 정보 보기 -->
    <div v-if="selectedPost" class="post-detail rounded">
      <h2>{{ selectedPost.title }}</h2>
      <img v-if="selectedPost.post_image" :src="selectedPost.post_image" alt="게시글 이미지" class="detail-image" />
      <p>{{ selectedPost.post_content }}</p>
      <p>작성일: {{ new Date(selectedPost.created_at).toLocaleDateString() }}</p>
      <button class="btn btn-secondary" @click="closeDetail">닫기</button>
    </div>
  </div>
</template>

<script>
import api from "@/api.js"

export default {
  data() {
    return {
      posts: [], // 게시글 목록 데이터
      selectedPost: null, // 선택된 게시글 데이터
    };
  },
  async created() {
    await this.fetchPosts();
  },
  methods: {
    // 게시글 목록 가져오기
    async fetchPosts() {
      try {
        const response = await api.get('/post/post_list');
        this.posts = response.data;
      } catch (error) {
        console.error('게시글 데이터를 가져오는 데 실패했습니다.', error);
      }
    },
    // 게시글 세부 정보 가져오기
    async fetchPostDetail(postId) {
      try {
        const response = await api.get(`/post/post_detail/${postId}`);
        this.selectedPost = response.data;
      } catch (error) {
        console.error('게시글 세부 정보를 가져오는 데 실패했습니다.', error);
      }
    },
    // 세부 정보 보기
    async viewDetail(postId) {
      await this.fetchPostDetail(postId);
    },
    // 세부 정보 닫기
    closeDetail() {
      this.selectedPost = null;
    },
  },
};
</script>

<style scoped>
.w-85 {
  width: 85% !important;
}

.table {
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

/* 추가된 스타일 */
.thumbnail {
  max-width: 100px;
  height: auto;
  border-radius: 4px;
  object-fit: cover;
}

.post-detail {
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  padding: 2rem;
  margin-top: 2rem;
  border: 1px solid #eaeaea;
}

.detail-image {
  max-width: 300px;
  height: auto;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}
</style>
