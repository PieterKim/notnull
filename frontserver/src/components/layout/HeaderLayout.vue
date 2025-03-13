<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light fixed-top">
      <div class="container-fluid">
        <a class="navbar-brand" @click="goToMenu('/')">주정뱅이</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavDropdown">
          <ul class="navbar-nav me-auto ms-3">
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" role="button">
                주류
              </a>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" @click="goToMenu('/liqueur')">모든상품</a></li>
                <li><a class="dropdown-item" @click="goToMenu('/liqueur/wine')">와인</a></li>
                <li><a class="dropdown-item" @click="goToMenu('/liqueur/whisky')">위스키</a></li>
              </ul>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button">etc 상품</a>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" @click="goToMenu('/etc/wineglass')">와인잔</a></li>
                <li><a class="dropdown-item" @click="goToMenu('/etc/onetherock')">온더락잔</a></li>
              </ul>
            </li>
            <li class="nav-item">
              <a class="nav-link" @click="goToMenu('/postlist')">커뮤니티</a>
            </li>
          </ul>
          <ul class="navbar-nav ms-auto">
            <li class="nav-item" v-if="checkAdmin">
              <a class="nav-link" @click="goToAdmin('/admin')">Admin</a>
            </li>
            <li class="nav-item" v-show="isLoggedIn">
              <a class="nav-link" @click="logout">로그아웃</a>
            </li>
            <li class="nav-item" v-show="!isLoggedIn">
              <a class="nav-link" @click="$router.push('/login')">로그인</a>
            </li>
            <li class="nav-item" v-show="!isLoggedIn">
              <a class="nav-link" @click="$router.push('/agree')">회원가입</a>
            </li>
            <li class="nav-item">
              <i class="bi bi-cart3 icon" @click="checkLoginAndGoToPage('/cart/1')" title="장바구니"></i>
            </li>
            <li class="nav-item">
              <i class="bi bi-person icon" @click="checkLoginAndGoToPage('/mypage')" title="마이페이지"></i>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import axios from 'axios';

export default{
    data(){
      return {
        isLoggedIn:false,
        checkAdmin:false,
      }
    },
    watch: {
      '$route': {
        handler() {//라우터가 변경될 때 마다 실행되는 콜백 함수
          this.checkLogin(); // 라우트 변경시마다 로그인 상태 확인
        },
        immediate: true
      }
    },
    methods :{
    // 로그아웃 처리 함수 여기부터 logout까지 2025-01-07
      async checkLogin() {
          try {
              const response = await axios.get('import.meta.env.VUE_APP_API_BASE_URL/auth/check',{withCredentials:true});
              this.isLoggedIn = response.data.isLoggedIn;
              this.checkAdmin = response.data.isAdmin;
          } catch (error) {
              this.isLoggedIn = false;
          }
      },
      async login() {
          try {
            const response = await axios.post('import.meta.env.VUE_APP_API_BASE_URL/auth/login', {
              username: this.username,
              password: this.password,
            }, { withCredentials: true });

            if (response.data.success) {
              this.isLoggedIn = true; // 로그인 성공 시 상태 업데이트
              alert("로그인에 성공했습니다!");
              this.$router.push('/'); // 로그인 후 홈으로 이동
            } else {
              alert("로그인에 실패했습니다. 다시 시도해주세요.");
            }
          } catch (error) {
            console.error("로그인 요청 중 오류 발생:", error);
            alert("로그인 중 문제가 발생했습니다.");
          }
        },
      async logout() {
          try {
            await axios.post('import.meta.env.VUE_APP_API_BASE_URL/auth/logout', {}, { withCredentials: true });
            this.isLoggedIn = false; // 로그아웃 후 즉시 상태 갱신
            alert("로그아웃 되었습니다!");
            this.checkAdmin = false;
            this.isLoggedIn = false;
            this.$router.push('/'); // 로그아웃 후 홈으로 이동
          } catch (error) {
            console.error("로그아웃 실패:", error);
          }
      },


      goToMenu(path){
        this.$router.push({path:path});//vue에서 사용하는 해당 경로의 라우터로 이동시키는 코드.
      },
      goToAdmin(path){
        if(this.checkAdmin){
          this.$router.push({path:path});//vue에서 사용하는 해당 경로의 라우터로 이동시키는 코드.
        }else{
          alert("관리자가 아닙니다.");
        }
      },
      checkLoginAndGoToPage(path){
        if(this.isLoggedIn){
          this.$router.push({path:path});//vue에서 사용하는 해당 경로의 라우터로 이동시키는 코드.
        }else{
          alert("로그인이 필요합니다.");
          this.$router.push('/login');
        }
      },
    },
    mounted() {
    },
    handleSearch() {
    this.$router.push({
      path: '/liqueur',
      query: { search: this.searchQuery }
    });
  },

}
</script>

<style scoped>
.navbar {
  background-color: #ffffff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1rem 2rem;
  z-index: 1000; 
}

.navbar-brand {
  font-weight: bold;
  font-size: 1.8rem;
  color: #333;
  transition: color 0.3s;
  cursor: pointer;
}

.navbar-brand:hover {
  color: #007bff;
}

.nav-link {
  margin-right: 1rem;
  color: #555;
  transition: color 0.3s;
  cursor: pointer;
}

.nav-link:hover {
  color: #007bff;
}
/* 1월 13일 동진 추가 */
.dropdown-item {
  padding: 0.5rem 1rem;
  background-color: transparent; 
  color: #4a4a4a; 
  transition: all 0.3s ease;
  border-radius: 5px; 
  cursor: pointer;
}
/* 1월 13일 동진 추가 */
.dropdown-item:hover,
.dropdown-item:active {
  background-color: rgb(243, 239, 224); 
  color: #4a4a4a; 
}

.icon {
  font-size: 1.5rem;
  cursor: pointer;
  margin-left: 0.5rem;
  color: #555;
  transition: color 0.3s;
}

.icon:hover {
  color: #007bff;
}

.dropdown:hover .dropdown-menu {
  display: block;
}

.dropdown-menu {
  display: none;
  border-radius: 0.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .navbar-nav {
    text-align: center;
  }
  .nav-link {
    margin-right: 0;
  }
}

</style>