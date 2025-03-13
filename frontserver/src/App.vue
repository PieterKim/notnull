<template>
  <div>
    <HeaderLayout />
    <div :class="{ container: $route.name !== 'home' }">
      <router-view/> <!--여기는 라우터를 통해 호출되는 컴포넌트를 띄우겠다는 코드. 이게 라우터를 호출하거나 하는건아님. 라우터 호출을 main.js에서 -->
    </div>
    <FooterLayout />
  </div>
</template>

<script>
import HeaderLayout from '@/components/layout/HeaderLayout.vue'
import FooterLayout from '@/components/layout/FooterLayout.vue'
  export default{
    components:{
        'HeaderLayout':HeaderLayout,
        'FooterLayout':FooterLayout,
    }
  }
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
span{
  color:#bebebe;
}

.container {
  width: 100%;
}
</style>

<!--router-link , router-view -> 다 vue에서 사용하는 예약어-->
