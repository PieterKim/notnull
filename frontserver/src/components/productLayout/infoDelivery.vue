<template>
<div>
    <div class="product-info">
        <h3>배송안내</h3>
        <p>▶배송지역 : 전국</p>

        <p>- 일부지역은 택배사의 배송여부에 따라 배송이 불가능한 지역이 발생될 수 있습니다.</p>

        <p>▶ 배송비 : 2,500원</p>

        <p>- 제주, 도서, 산간, 오지 일부지역은 배송비 5,000원이 부과됩니다.</p>

        <p>▶주문마감 : 오후 1시 주문 마감</p>

        <p>- 오후 1시까지 주문/결제 시 당일 출고됩니다.</p>

        <p>- 오후 1시 이후 주문/결제 건은 익일 출고됩니다.</p>

        <p>(금요일은 월요일에 출고됩니다.)</p>

        <p>▶배송사 : CJ대한통운</p>
    </div>
</div>
</template>
<script>

export default{ 
    name:'',
    components:{},
    data(){
        return{
            sampleData:''
        };
    },
    setup(){},
    created(){},
    mounted(){},
    unmounted(){},
    methods:{
    }
}
</script>

<style scoped>

.product-info {
    margin: 50px 0;
}

    #info-box {
        height: 200px;
        width: 100%;
        background: black;
    }
</style>