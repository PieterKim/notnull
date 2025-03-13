<template>
  <div class="login-container">
    <div class="login-box">
      <h2>로그인</h2>
      
      

      <!-- 이메일/비밀번호 폼 -->
      <form class="login-form" @submit.prevent="localLogin">
        <div class="form-group">
          <input ref="emailInput" type="email" placeholder="이메일" class="form-input" v-model="loginFrom.email" required/>
        </div>
        <div class="form-group">
          <input type="password" placeholder="비밀번호" class="form-input" v-model="loginFrom.password" required/>
        </div>
        <button type="submit" class="login-btn">로그인</button>
      </form>

      <!-- 소셜 로그인 버튼 -->
      <div class="social-login">
        <button @click="kakaoLogin" class="kakao-btn">카카오 로그인</button>
        <button @click="naverLogin" class="naver-btn">네이버 로그인</button>
      </div>

      <!-- 회원가입 링크 -->
      <div class="signup-link">
        <p>아직 계정이 없으신가요? <router-link to="/agree">회원가입</router-link></p>
      </div>

      <!-- 로그아웃 버튼 추가 -->
      <button v-if="isLoggedIn" @click="logout" class="logout-btn">로그아웃</button>
      
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default{ 
    name:'',
    components:{},
    computed:{},
    data(){
        return{
            loginFrom:{
                email:'',
                password:'',
            },
            isLoggedIn: false,
        };
    },
    setup(){},
    created(){},
    mounted(){
        this.checkLogin();
    },
    unmounted(){},
    methods:{
        async checkLogin() {
            try {
                const response = await axios.get('import.meta.env.VUE_APP_API_BASE_URL/auth/check',{withCredentials:true});
                this.isLoggedIn = response.data.isLoggedIn;
            } catch (error) {
              if(error.response.status === 403){
                this.isLoggedIn = false;
              }
              else{
                console.log('need login')
              }
            }
        },
        async localLogin(){
            try{
                const response = await axios.post('import.meta.env.VUE_APP_API_BASE_URL/auth',this.loginFrom,{withCredentials:true});
                if(response.status === 200){
                    this.loginFrom.email = '';
                    this.loginFrom.password = '';
                    this.checkLogin();
                    this.$router.push({ //뒤로가기 방지
                        path: '/',
                        replace: true
                    });
                }
            }catch(error){
                if(error.response.status === 401){
                    alert(error.response.data.message);
                    this.$refs.emailInput?.focus();
                }
            }
        },
        kakaoLogin(){
            window.location.href = 'import.meta.env.VUE_APP_API_BASE_URL/auth/kakao'; //소셜 로그인은 토큰 받으러 해당 페이지로 이동해야 하기 때문에 axios요청을 보내면 안됌.
        },
        naverLogin(){
            window.location.href = 'import.meta.env.VUE_APP_API_BASE_URL/auth/naver';
        },
        async logout() {
            try {
               
                const response = await axios.post('import.meta.env.VUE_APP_API_BASE_URL/auth/logout',{},{withCredentials:true}); //빈 오브젝트 파라미터를 꼭 넣어줘야함. post요청을 파라미터 3개를 받아야 해서 2개만 넣으면 세션 역 직렬화가 이상하게 되는 등의 문제가 생김.
                console.log("response",response);
                if (response.status === 200) {
                    this.isLoggedIn = false;
                    alert('로그아웃되었습니다');
                    this.$router.push('/login');
                }
            } catch (error) {
                console.error('로그아웃 실패:', error);
            }
        },
    },
    watch:{}
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #FFFFFF;
}

.login-box {
  width: 400px;
  padding: 40px;
  background: #faf8f3;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.login-form {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
}

.login-btn {
  width: 100%;
  padding: 12px;
  background-color: #e5dcc3;
  color: #333;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 20px;
}

.login-btn:hover {
  background-color: #d4cbb4;
}

.social-login {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.kakao-btn {
  width: 100%;
  padding: 12px;
  background-color: #FEE500;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}

.naver-btn {
  width: 100%;
  padding: 12px;
  background-color: #03C75A;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}

.signup-link {
  text-align: center;
}

.signup-link a {
  color: #b4a892;
  text-decoration: none;
}

.signup-link a:hover {
  color: #8c826e;
  text-decoration: underline;
}

.logout-btn {
  width: 100%;
  padding: 12px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 20px;
}

.logout-btn:hover {
  background-color: #d32f2f;
}
</style>

