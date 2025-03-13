<template>
<div class="div1">

    <!-- 광고형 슬라이드 -->
    <div id="carouselExampleIndicators" class="carousel slide centered-carousel" data-bs-ride="carousel" data-bs-theme="dark">
      <div class="carousel-indicators">
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
      </div>
      <div class="carousel-inner">
        <div class="carousel-item active test">
            <img src="img\배너2.jpg" class="d-block w-100" alt="01">
        </div>
        <div class="carousel-item test">
          <img src="img\배너3.jpg" class="d-block w-100" alt="02">
        </div>
        <div class="carousel-item test">
          <img src="img\배너4.jpg" class="d-block w-100" alt="03">
        </div>
      </div>
      <button class="carousel-control-prev" data-bs-theme="dark" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev" >
        <span class="carousel-control-prev-icon test" aria-hidden="true" ></span>
        <span class="visually-hidden test" >Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>

    </div>
    <div class="bar2"></div>

    <section>
      <!-- 신상품 소개하는 캐러셀-->
          <div class="swiper1-title" >
            <h2>New 상품<span>🍸</span></h2>
            <p>"새로나온 제품을 한눈에!"</p>
          </div>   
      <v-carousel v-if="mainData.newProduct.length > 0" 
        height="550" 
        show-arrows="hover" 
        cycle 
        hide-delimiter-background
        style="background-color: #8D6E63;">
        
        <v-carousel-item
          v-for="item in mainData.newProduct"
          :key="item.id"
          @click="goProducts(item.id)"
        >
          <v-sheet color="white lighten-2" height="100%" >
            <div class="d-flex justify-center align-center">
              <div class="text-center">
                <img :src="item.product_image" alt="Product Image" style="max-height: 450px; object-fit: contain;" />
                <strong class="text-h5">{{ item.product_name }}</strong>
                <div  class="text-h6 mt-2">{{ item.product_price.toLocaleString() }}원</div>
              </div>
            </div>
          </v-sheet>
        </v-carousel-item>
      </v-carousel>
    </section>

    <!-- swiper expensive-container-->
      <div class="slider expensive-slider" style="background-color: #FAF3E0  ; border-radius: 16px; padding: 16px;">
        <!-- 추천 배너 텍스트 추가 -->
        <div class="expensive-image">
          <img src="img\배너0.jpg" class="left-image" alt="04" />
        </div>
        <div class="swiper-container expensive-container">
          
          <div class="expensive-title" >
            <h2>가성비 추천<span>🍻</span></h2>
            <p>"가볍게, 부담 없이! 트렌디한 주류를 한 곳에서."</p>
          </div>
          
          <div class="swiper-wrapper expensive-wrapper">
            <div class="swiper-slide expensive-slide" v-for="item in mainData.cheap" :key="item.id" @click="goProducts(item.id)">
              <img :src="item.product_image" alt="Product Image" />
              <p>{{ item.product_name }}</p> 
              <p>{{ item.product_price.toLocaleString() }}원</p>
            </div>
          </div>

          <!-- Navigation buttons -->
          <div class="swiper-button-prev expensive-prev"></div>
          <div class="swiper-button-next expensive-next"></div>
          <!-- Scrollbar -->
          <div class="swiper-scrollbar"></div>
        </div>

      </div>

    <!-- swiper 2 -->
    <section style="background-color: #8D6E63  ;">
      <div class="bar3" style="background-color: #8D6E63  ;"></div>
      <div class="recommendation-banner">"20대"에게 추천</div>
        <div class="swiper1-title" >
          <h2 >20대 MZ 들의 PICK!<span>🍷</span></h2>
          <p>"모든 순간에 어울리는 완벽한 술, 여기 다 있습니다."</p>
        </div>      
      <div class="container swiper-container-good">

        <div class="swiper-wrapper">
          <div 
            class="swiper-slide" 
            v-for="item in mainData.expensive" 
            :key="item.id"
            @click="goProducts(item.id)"
          >
            <img :src="item.product_image" alt="Product Image" />
            <p>{{ item.product_name }} -</p> 
            <p>{{ item.product_price.toLocaleString() }}원</p>
          </div>
        </div>
        <!-- 네비게이션 버튼 -->
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
        <div class="bar3" style="background-color: #E7E4E1;"></div>
      </div>
    </section>

    <!-- swiper 3 -->
    <section>
      <div class="bar2"></div>
      <div class="container swiper-container-thirties">

        <div class="swiper1-title" >
          <h2>30대 상품추천<span>🍷</span></h2>
          <p>"특별한 날, 특별한 술. 최고의 선택을 도와드립니다."</p>
        </div>

        <div class="swiper-wrapper">
          <div 
            class="swiper-slide" 
            v-for="item in mainData.expensive" 
            :key="item.id"
            @click="goProducts(item.id)"
          >
            <img :src="item.product_image" alt="Product Image" />
            <!-- 텍스트와 가격을 감싸는 div 추가 -->
            <div class="text-container">
              <p>{{ item.product_name }}</p>
              <p>{{ item.product_price.toLocaleString() }}원</p>
            </div>
          </div>
        </div>
        <!-- Navigation buttons -->
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
      </div>
    </section>

    <!-- 중간 배너  -->
    <div class="bar2"></div>
    <div class="img2">
      <img src="img\배너.png" class="d-block w-100" alt="01">
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
        mainData:{
          expensive:[], //비싼거
          cheap:[], // 싼거
          newProduct:[], // 신상품
          recommend:{}, // 20대, 30대
          slides:[], // 
        },
        bestSeller:{
          
        },
        colors: [
          'indigo',
          'warning',
          'pink darken-2',
          'red lighten-1',
          'deep-purple accent-4',
        ],
        slides: [
          'First',
          'Second',
          'Third',
          'Fourth',
          'Fifth',
      ],
        watch: {
        'mainData.expensive': {
          handler() {
            this.$nextTick(() => {
              this.initSwiper();
            });
          },
          deep: true,
        },
      },
      };
    },
    setup(){},
    created(){
      this.getmain(); // 메인 데이터 가져오기 
    },
    mounted(){
    // jQuery 기반 Swiper 초기화 제거
      this.$nextTick(() => {
        this.initSwiper();
      });
    },
    updated() {},
    unmounted(){},
    methods:{
      async getmain() {
        try {
          const response = await axios.get("import.meta.env.VUE_APP_API_BASE_URL/");
          this.mainData = response.data;

          // 데이터가 렌더링된 후 Swiper 초기화
          this.$nextTick(() => {
            this.initSwiper();
          });

          console.log(response);
        } catch (err) {
          console.error(err);
        }
      },
      initSwiper() {
        new Swiper('.swiper-container', {
          direction: 'horizontal',
          loop: true,
          slidesPerView: 3, // 한 화면에 표시할 슬라이드 수
          spaceBetween: 20, // 슬라이드 간격
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
          },
          scrollbar: {
            el: '.swiper-scrollbar',
            draggable: true,
          },

          breakpoints: {
            1920: { slidesPerView: 3 }, // 데스크탑
            992: { slidesPerView: 3 },  // 태블릿
            320: { slidesPerView: 2 },  // 모바일
          },
        });
      new Swiper('.swiper-container-good', {
        slidesPerView: 3, // 한 화면에 표시할 슬라이드 개수
        centeredSlides: true, // 활성 슬라이드를 가운데 정렬
        loop: true, // 무한 반복 활성화
        spaceBetween: 20, // 슬라이드 간격 없음
        navigation: {
          nextEl: '.swiper-button-next', // 다음 버튼
          prevEl: '.swiper-button-prev', // 이전 버튼
        },
        on: {
          // DOM 준비 이후 업데이트
          init: function () {
            this.update(); // 강제 업데이트 호출
          },
        },
        breakpoints: {
          1920: { slidesPerView: 3 }, // 데스크탑 설정
          992: { slidesPerView: 3 },  // 태블릿 설정
          320: { slidesPerView: 1 },  // 모바일 설정
        },
      });
      new Swiper('.swiper-container-thirties', {
        slidesPerView: 2, // 한 화면에 표시할 슬라이드 개수
        loop: true, // 무한 반복
        spaceBetween: 15, // 슬라이드 간격
        slidesPerGroup: 2, // 한 번에 넘어갈 슬라이드 수
        navigation: {
          nextEl: '.swiper-button-next', // 다음 버튼
          prevEl: '.swiper-button-prev', // 이전 버튼
        },
        breakpoints: {
          1920: { slidesPerView: 2 }, // 데스크탑 설정
          992: { slidesPerView: 2 },  // 태블릿 설정
          320: { slidesPerView: 1 },  // 모바일 설정
        },
      });
    },    
    goProducts(productId) {
      // 제품 페이지 이동 로직 (예: 라우터 사용)
      this.$router.push(`/products/${productId}`);
    },
  },
}       

</script>

<style scoped>

  .div1 {
    margin-top: 100px;
  }
  /* recommendation-banner */
  .recommendation-banner {
    font-size: 30px;
    text-align: center;
    margin-bottom: 20px;
    color: #333;
    position: absolute;
    top: -100px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
    width: 65%;
    margin-left: 20%;
  }
  .container {
  width: 100vw; /* 화면 너비를 100%로 */
  max-width: none; /* 최대 너비 제한 해제 */
  margin: 0; /* 여백 제거 */
  padding: 0; /* 패딩 제거 */
  }
  body, html {
    margin: 0;
    padding: 0;
    width: 100vw;
    height: 100vh;
    overflow-x: hidden; /* 수평 스크롤 제거 */
  }
  
  /* body부분 - 캐러셀 */
  /* 기본 캐러셀 스타일 */
  .carousel-item img {
    width: 100%; /* 이미지를 캐러셀 아이템 너비에 맞춤 */
    height: auto; /* 높이는 자동으로 조절 */
    object-fit: contain; /* 이미지 비율 유지하며 최대한 크게 보여줌 */
  }
  .carousel-item{
    width: 100%; 
    height: auto;
  }
  .test{
    color:black;
  }
  .carousel {
  position: relative;
  }
  .carousel img {
    display: block;
    height: auto;
  }
  
  /* 기본 swiper 설정 */
  .slider {
    margin: 0 auto;
    position: relative;
  }

  .swiper-container {
    
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
  }

  .swiper-wrapper {
    display: flex;
    transition: all 0.3s ease;
  }

  .swiper-slide {
    flex: 0 0 auto;
    text-align: center;
    transition: transform 0.3s ease;
    cursor: pointer;
  }

    /* 비싼가격순 css */
  .slider.expensive-slider {
    margin-top: 200px;
    padding: 0;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .expensive-image {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .left-image {
    width: 100%;
    height: auto;
    border-radius: 15px;
    object-fit: cover;
  }

  .expensive-container {
    padding-left: 20px;
    margin-left: 50px;
    margin-top: 100px;
  }



  .expensive-wrapper {
    width: 1000px;
    height: 350px;
  }

  .swiper-wrapper img {
    width: 250px;
    height: 250px;
    object-fit: contain;
    cursor: pointer;
  }

  .swiper-scrollbar {
    background: #d6d6d6;
  }

  .swiper-container-horizontal > .swiper-scrollbar {
    border-radius: 2px;
    height: 5px;
    width: 200px;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
  }

  /* swiper 1: expensive-slider */
  .slider.expensive-slider .swiper-button-prev,
  .slider.expensive-slider .swiper-button-next {
    position: absolute;
    top: 55%; /* 수직 가운데 */
    transform: translateY(-50%); /* 정확한 중앙 배치 */
    z-index: 10;
  }

  .slider.expensive-slider .swiper-button-prev {
    left: 10px; /* 왼쪽에 위치 */
  }

  .slider.expensive-slider .swiper-button-next {
    right: 10px; /* 오른쪽에 위치 */
  }


  /* swiper 2 */
  /* 슬라이드 컨테이너 */
  .swiper-container-good {
    max-width: 100%;
    height: 700px; /* 슬라이드 높이 고정 (원하는 높이로 조정 가능) */
    margin: 0 auto;
    overflow: hidden; /* 슬라이드 영역 밖의 이미지를 숨깁니다. */
    position: relative; /* 버튼 위치를 슬라이더 컨테이너 기준으로 설정 */
    display: flex;
    align-items: center; /* 슬라이드 컨테이너 세로 중앙 정렬 */
  }

  /* 개별 슬라이드 */
  .swiper-container-good .swiper-slide {
    width: auto; /* 슬라이드가 컨테이너에 맞게 자동 크기 조정 */
    height: 100%; /* 슬라이드 높이를 100%로 설정 */
    transition: all 0.25s ease-out;
    opacity: 1;
    display: flex;
    flex-direction: column; /* 이미지 위에 텍스트를 세로로 배치 */
    justify-content: center; /* 세로로 가운데 정렬 */
    align-items: center; /* 가로로 가운데 정렬 */
    position: relative; /* 텍스트가 이미지 위에 오도록 */
  }

  /* 이미지 */
  .swiper-container-good .swiper-slide img {
    width: 300px; /* 이미지가 슬라이드 영역을 가득 채우도록 합니다. */
    height: 300px; /* 이미지 높이를 80%로 설정하여 텍스트가 들어갈 공간을 확보 */
    object-fit: contain; /* 비율을 유지하면서 슬라이드 영역을 채우도록 설정 */
    transition: all 0.25s ease-out;
    transform: scale(0.8); /* 비활성 슬라이드는 크기를 작게 만듭니다. */
    transform-origin: center; /* 이미지 크기 변형을 중앙을 기준으로 합니다. */
    border-radius: 10px;
    z-index: 1; /* 이미지가 텍스트 뒤에 오도록 설정 */
  }

  /* 활성화된 슬라이드 (가운데 이미지) */
  .swiper-container-good .swiper-slide-active img {
    transform: scale(1.5); /* 활성화된 이미지의 크기를 원래대로 설정 */
    width: 300px; /* 이미지가 슬라이드 영역을 가득 채우도록 합니다. */
    height: 300px; /* 이미지 높이를 80%로 설정하여 텍스트가 들어갈 공간을 확보 */
    z-index: 1; /* 이미지가 텍스트 뒤에 오도록 설정 */
  }

  /* 텍스트 */
  .swiper-container-good .swiper-slide p {
    margin: 5px 0; /* 텍스트 간 간격 */
    color: black; /* 텍스트 색상 */
    font-size: 22px; /* 텍스트 크기 조정 */
    text-align: center; /* 텍스트를 가운데 정렬 */
    padding: 5px; /* 텍스트 주변 여백 */
    position: relative;
    transition: transform 0.25s ease-out; /* 텍스트도 부드럽게 이동 */
    
  }

  /* 활성화된 슬라이드에서 텍스트 아래로 이동 */
  .swiper-container-good .swiper-slide-active p {
    transform: translateY(70px); /* 이미지가 커지면서 텍스트도 아래로 이동 */
  }

  /* swiper 2: swiper-container-good */
  .swiper-container-good .swiper-button-prev,
  .swiper-container-good .swiper-button-next {
    position: absolute;
    top: 50%; /* 수직 중앙 */
    transform: translateY(-50%); /* 정확한 중앙 배치 */
    z-index: 10;
  }
  /* swiper 3 */
  .swiper-container-thirties {
    max-width: 100%;
    margin: 0 auto;
    overflow: hidden;
    position: relative;
  }

  .swiper-wrapper {
    display: flex;
    justify-content: flex-start; /* 슬라이드를 왼쪽으로 정렬 */
    gap: 10px; /* 슬라이드 간의 간격 조정 */
  }

  .swiper-container-thirties .swiper-slide {
    display: flex;
    justify-content: center;
    align-items: center; /* 이미지와 텍스트를 수직, 수평 중앙 정렬 */
    height: 500px; /* 슬라이드 높이를 일정하게 설정 */
    transition: all 0.25s ease-out;
    opacity: 1;
    box-sizing: border-box;
    padding: 0 20px; /* 슬라이드 안의 내용에 좌우 여백을 추가 */
    width: auto;
  }

  /* 이미지 크기 고정 */
  .swiper-container-thirties .swiper-slide img {
    width: 400px; /* 이미지의 고정 크기 */
    height: 400px; /* 이미지의 고정 크기 */
    object-fit: contain; /* 비율 유지하면서 영역을 꽉 채우기 */
    transition: all 0.25s ease-out;
    border-radius: 10px;
  }

  /* 텍스트 크기 줄이기 */
  .swiper-container-thirties .swiper-slide .text-container {
    margin-left: 20px; /* 이미지와 텍스트 사이에 여백 */
    display: flex;
    flex-direction: column; /* 텍스트와 가격을 세로로 나열 */
    justify-content: center; /* 텍스트와 가격을 수직으로 가운데 정렬 */
    align-items: flex-start; /* 왼쪽 정렬 */
  }

  /* 텍스트 스타일 */
  .swiper-container-thirties .swiper-slide p {
    margin: 5px 0; /* 텍스트 간 간격 */
    color: black; /* 텍스트 색상 */
    font-size: 25px; /* 텍스트 크기 조정 (이미지 크기에는 영향 주지 않음) */
    text-align: left; /* 텍스트 왼쪽 정렬 */
    padding: 0; /* 불필요한 여백 제거 */
    text-align: center;

  }

  /* swiper 3: swiper-container-thirties */
  .swiper-container-thirties .swiper-button-prev,
  .swiper-container-thirties .swiper-button-next {
    position: absolute;
    top: 60%; /* 수직 중앙 */
    transform: translateY(-50%); /* 정확한 중앙 배치 */
    z-index: 10;
  }

  .swiper-container-thirties .swiper-button-prev {
    left: 30px; /* 왼쪽에 위치 */
  }

  .swiper-container-thirties .swiper-button-next {
    right: 30px; /* 오른쪽에 위치 */
  }

  /* 글, 여백주기 */
  .expensive-title {
    float: left;
    
  }

  .expensive-title p {
    float: left;
    margin-top: 10px;
    font-size: 20px; /* 부제목 크기 */
    color: black;
    font-family: 'Noto Serif KR', serif;
  }
  .expensive-title h2{
    margin: 0;
    font-size: 60px; /* 타이틀 크기 */
    color: black;
    font-family: 'Noto sans KR', serif; 
  }
  .swiper1-title { 
    top: 50%;
    color: black;
  }
  .swiper1-title h2 {
    margin: 0;
    font-size: 60px; /* 타이틀 크기 */
    color: black;
    font-family: 'Noto sans KR', serif; 
  }

  .swiper1-title p {
    margin-top: 10px;
    font-size: 20px; /* 부제목 크기 */
    color: black;
    font-family: 'Noto Serif KR', serif; 
  }
  .swiper2-title { 
    top: 50%;
    color: black;
  }
  .swiper2-title h2 {
    margin: 0;
    font-size: 60px; /* 타이틀 크기 */
    color: black;
    font-family: 'Noto sans KR', serif; 
  }

  .swiper2-title p {
    margin-top: 10px;
    font-size: 20px; /* 부제목 크기 */
    color: black;
    font-family: 'Noto Serif KR', serif; 
  }

  .bar1{
    margin:50px;
  }
  .bar2{
    margin:50px;
  }
  .bar3{
    padding:50px;
  }
</style>