<template>
<div class="product_info-div">
    
    <hr class="product-line">


    <div class="info-listBox">
        <ul class="info-list">
            <li @click="currentComponent = 'infoDetail'">
                <a>상품상세정보</a>
            </li> 
            <li  @click="currentComponent = 'infoDelivery'">
                <a>배송안내</a>
            </li> 
            <li @click="currentComponent = 'infoExchange'">
                <a>교환 및 반품</a>
            </li>
            <li @click="currentComponent = 'infoReview'">
                <a>상품후기</a>
            </li> 
                                                
        </ul>
    </div>

    <hr>

    <keep-alive>
        <component :is="currentComponent" :product="product"/>
    </keep-alive>

    
</div>
</template>
<script>
import infoDetail from './infoDetail.vue';
import infoDelivery from './infoDelivery.vue';
import infoExchange from './infoExchange.vue';
import infoReview from './infoReview.vue';


export default{ 
    name:'',
    props:{
        product:Object
    },
    components:{
        infoDelivery,
        infoDetail,
        infoExchange,
        infoReview,
        
    },
    data(){
        return{
            currentComponent: 'infoDetail'
        };
    },
    setup(){},
    created(){},
    mounted(){
        
    },
    unmounted(){},
    methods:{}
}
</script>

<style scoped>
.product_info-div{
    margin-top: 100px;
}
 .product-line {
    height: 5px;
 }

 .info-listBox{
    margin: 0 auto;
    width: 50%;
} 

 .info-list {
    list-style: none;
    display: flex;
    gap: 10%;
    justify-content: center;
 }

 .info-list li {
    cursor: pointer;
 }
</style>