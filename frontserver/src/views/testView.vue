<template>
<div>
  <div>
    <!-- 광고형 슬라이드 -->
    <div id="carouselExampleIndicators" class="carousel slide centered-carousel" data-bs-ride="carousel" data-bs-theme="dark">
      <div class="carousel-indicators">
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
      </div>
      <div class="carousel-inner">
        <div class="carousel-item active test">
            <img src="img\곰표.jpg" class="d-block w-100" alt="01">
        </div>
        <div class="carousel-item test">
          <img src="img\청하.jpg" class="d-block w-100" alt="02">
        </div>
        <div class="carousel-item test">
          <img src="img\하이볼.jpg" class="d-block w-100" alt="03">
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

    <v-carousel v-if="mainData.expensive.length > 0" height="400" show-arrows="hover" cycle hide-delimiter-background>
      <!-- 캐러셀 코드 -->
      <v-carousel-item
        v-for="item in mainData.expensive"
        :key="item.id"
        @click="goProducts(item.id)"
      >
        <v-sheet color="grey lighten-2" height="100%">
          <div class="d-flex fill-height justify-center align-center">
            <div class="text-center">
              <img :src="item.product_image" alt="Product Image" style="max-height: 200px; object-fit: contain;" />
              <p class="text-h6">{{ item.product_description }}</p>
              <strong class="text-h5">{{ item.product_name }}</strong>
              <div class="text-h6 mt-2">{{ item.product_price }}원</div>
            </div>
          </div>
        </v-sheet>
      </v-carousel-item>
    </v-carousel>








    <section>
      <h2>비싼 가격순</h2>
      <ul class="product-list">
        <li v-for="item in mainData.expensive" :key="item.id" @click="goProducts(item.id)">
          <img :src="item.product_image" alt="Product Image" />
          <p>{{ item.product_description }}</p>
          <strong>{{ item.product_name }} -</strong> <strong> {{ item.product_price }}원</strong>
        </li>
      </ul>
    </section>

    <section>
      <h2>싼 가격순</h2> <!-- 1월1일 동진 데이터 바인딩을 위해 작성-->
      <ul class="product-list">
        <li v-for="item in mainData.cheap" :key="item.id" @click="goProducts(item.id)">
          <img :src="item.product_image" alt="Product Image" />
          <p>{{ item.product_description }}</p>
          <strong>{{ item.product_name }} -</strong> <strong> {{ item.product_price }}원</strong>
        </li>
      </ul>
    </section>

    <section>
      <h2>20대 추천</h2> <!-- 1월1일 동진 데이터 바인딩을 위해 작성-->
      <ul class="product-list">
        <li v-for="item in mainData.recommend['20대 베스트']" :key="item.id" @click="goProducts(item.id)">
          <img :src="item.product_image" alt="Product Image" />
          <p>{{ item.product_description }}</p>
          <strong>{{ item.product_name }} -</strong> <strong> {{ item.product_price }}원</strong>
        </li>
      </ul>
    </section>

    <section>
      <h2>30대 추천</h2> <!-- 이건 어떻게 받아와야 하지? -->
      <ul class="product-list">
        <li v-for="item in mainData.recommend['30대 베스트']" :key="item.id" @click="goProducts(item.id)">
          <img :src="item.product_image" alt="Product Image" />
          <p>{{ item.product_description }}</p>
          <strong>{{ item.product_name }} -</strong> <strong> {{ item.product_price }}원</strong>
        </li>
      </ul>
    </section>

    <section>
      <h2>신상품</h2> <!-- 1월1일 동진 데이터 바인딩을 위해 작성-->
      <ul class="product-list">
        <li v-for="item in mainData.newProduct" :key="item.id" @click="goProducts(item.id)">
          <img :src="item.product_image" alt="Product Image" />
          <p>{{ item.product_description }}</p>
          <strong>{{ item.product_name }} -</strong> <strong> {{ item.product_price }}원</strong>
        </li>
      </ul>
    </section>
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
          expensive:[],
          cheap:[],
          newProduct:[],
          recommend:{},
          slides:[],
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
        };
    },
    setup(){},
    created(){
      this.getmain(); // 메인 데이터 가져오기 
    },
    mounted(){
    },
    updated() {},
    unmounted(){},
    methods:{
      async getmain(){
        try{
          const response = await axios.get("import.meta.env.VUE_APP_API_BASE_URL/") 
          this.mainData = response.data
          console.log(response)
        }catch(err){
          console.error(err)
        }
      },

      goProducts(productId) {
        // 제품 페이지 이동 로직 (예: 라우터 사용)
        this.$router.push(`/products/${productId}`);
      },
  }
}
</script>

<style>
  /* body부분 - 캐러셀 */
  /* 기본 캐러셀 스타일 */
  .carousel-item img {
    width: 300px; /* 이미지를 캐러셀 아이템 너비에 맞춤 */
    height: 500px; /* 높이는 자동으로 조절 */
    object-fit: contain; /* 이미지 비율 유지하며 최대한 크게 보여줌 */
  }
  .carousel-item{
    width: 300px;
  }
  .test{
    color:black;
  }



</style>