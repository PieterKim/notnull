<template>
    <div class="div1">
      <div class="nav-container">
        <Navbar></Navbar> 
      </div>

      <div>
        <router-view></router-view>
      </div>
    </div>
  </template>
  
  <script>
  import Navbar from '@/components/post/postNavbar.vue'; 
  export default {
    components: {
      Navbar,
    },
    methods: {
      goToWrite() {
        this.$router.push('/post/write');
      }
    }
  };
  </script>
  
  <style scoped>
  

  .nav-container {
    position: relative;
  }

  .write-button {
    position: absolute;
    top: 20px;
    right: 20px;
    background-color: #4CAF50;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
  }

  .write-button:hover {
    background-color: #45a049;
  }
  </style>