<template>
    <div>
      <h1>커뮤니티 게시판</h1>
      <div class="top-navbar">
        <ul>
          <li><v-btn><router-link to="/postlist">전체게시판</router-link></v-btn></li>
          <li><v-btn><router-link to="/postlist/free">자유게시판</router-link></v-btn></li>
          <li><v-btn><router-link to="/postlist/review">리뷰게시판</router-link></v-btn></li>
          <li><v-btn><router-link to="/postlist/inquiry">문의게시판</router-link></v-btn></li>
          <li><v-btn><router-link to="/postlist/report">신고게시판</router-link></v-btn></li>
        </ul>
      </div>
  </div>
  </template>
  
  <script>
  export default {
    name: 'NavBar'
  };
  </script>
  
  <style scoped>
.top-navbar{
  margin-top: 50px;
}

  .top-navbar ul {
  list-style-type: none;
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 20px;
  padding: 20px;
}

.top-navbar li {
  font-size: 18px;
}

.top-navbar a {
  text-decoration: none;
  color: #333;
}

.top-navbar a:hover {
  color: #b6cadf;
}
.v-btn {
  background-color: #f3efe0;
}

</style>