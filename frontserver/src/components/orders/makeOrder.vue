<template>
    <div>
        <div class="makeOrder-content">
            
                <h1>내 주문 리스트</h1>
                <table class="table makeOrder-table">
                    <thead>
                        <tr>
                            <th>상품 이미지</th>
                            <th>상품명</th>
                            <th>수량</th>
                            <th>상품금액</th>
                            <th>합계금액</th>
                            <th>취소</th>
                            <th>환불</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="info in productInfo " :key="info.id">                
                            <td><img :src="info.Product.product_image" class="product-img"></td>
                            <td>{{info.Product.product_name}}</td>
                            <td>{{info.count}}</td>
                            <td>{{info.Product.product_price.toLocaleString()}}</td>
                            <td>{{info.count * info.Product.product_price.toLocaleString()}}</td>
                            <td><button>취소</button></td>
                            <td><button>환불</button></td>
                        </tr>
                    </tbody>
                </table>
            </div> 
        
    </div>
</template>

<script>
import axios from 'axios';

export default{ 
    name:'',
    components:{},
    data(){
        return{
            productInfo :[{}],
            //{"id":8,"count":1,"total_price":2790000,"createdAt":"2025-01-08T04:14:53.000Z","updatedAt":"2025-01-08T04:14:53.000Z","account_id":4,"product_id":4,
            // "Product":{"product_name":"달모어 25년 700ml","product_price":2790000,"product_image":"http://www.kajawine.kr/data/item/4363187205/thumb-TheDalmore25YearsOldbottle_360x480.jpg"}},
            //{"id":10,"count":1,
            //"Product":{"id":10,"product_name":"글렌피딕 30년산","product_price":1100000,"product_description":"글렌피딕의 대표 30년 숙성 제품","product_description_img":null,"product_stock":12,"product_image":"http://www.kajawine.kr/data/item/1219550509/thumb-6riA66CM7ZS865SV30_360x480.jpg","drink_type":"위스키","product_kind":"drink","created_at":"2025-01-07T15:00:35.000Z","updated_at":"2025-01-07T15:00:35.000Z","product_location_id":null,"supply_factory_id":null}}
        };
    },
    setup(){},
    created(){     
    },
    mounted(){
    //// 들어오는 쿼리에 따라 다른 파라메터를 넣어 같은 함수를 실행시키는 코드
        //'productInfoQuery'가 있으면, 문자열'productInfoQuery'를 넣어서 함수 실행
        if(this.$route.query.productInfoQuery){
            this.getProductInfo('productInfoQuery');
        // orderingInfoQuary가 있으면, 문자열 'orderingInfoQuary'를 넣어서 함수 실행
        }else if (this.$route.query.orderingInfoQuary){
            this.getProductInfo('orderingInfoQuary');
        }else {
            console.error("주문할 제품 정보(쿼리)를 받지 못합니다.")
        }


    },
    unmounted(){},
    methods:{
        async getProductInfo(query){
            try{
                if(query === 'productInfoQuery'){
                    this.productInfo = JSON.parse(this.$route.query.productInfoQuery);
                }else if(query === 'orderingInfoQuary') {
                    const InfoFromProductView = this.$route.query.orderingInfoQuary;
                    const response = await axios.get(`http://localhost:3000/orders/order/${InfoFromProductView}`);
                    this.productInfo = [response.data];
                }
            }catch(err){
                console.error(err);
            }
        },
    }
}

</script>

<style scoped>
.makeOrder-content {
    max-width: 1200px;
    margin: 50px auto;
    padding: 20px;
    background-color: #fff; /* 흰색 배경 */
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}


.makeOrder-content h1 {
    font-size: 2rem;
    text-align: center;
    color: #4a4a4a;
    margin-bottom: 20px;
}

/* 테이블 스타일 */
.makeOrder-table {
    width: 100%;
    border-collapse: collapse;
    text-align: center;
    background-color: #fff; /* 테이블 흰색 배경 */
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}


.makeOrder-table th {
    text-align: center;
    vertical-align: middle;
    background-color: #f9f9f9; /* 연한 회색 */
    color: #4A4A4A; /* 텍스트 색상 변경 */
    padding: 15px;
    font-size: 1rem;
    border-bottom: 2px solid #ddd;
}

.makeOrder-table td {
    text-align: center;
    vertical-align: middle;
    font-size: 1rem;
    color: #4A4A4A; /* 텍스트 색상 변경 */
    padding: 15px;
    border-bottom: 1px solid #ddd;
}

.makeOrder-table tr:last-child td {
    border-bottom: none;
}

/* 버튼 스타일 */
.makeOrder-table td button {
    padding: 8px 15px;
    border-radius: 5px;
    background-color: rgb(243, 239, 224); /* 장바구니와 동일한 배경색 */
    color: #4A4A4A; /* 텍스트 색상 변경 */
    border: none; /* 테두리 제거 */
    cursor: pointer;
    transition: all 0.2s ease-in-out;
}

.makeOrder-table td button:hover {
    background-color: #e5dcc3; /* 호버 시 배경색 */
    color: #4A4A4A; /* 호버 시 텍스트 색상 유지 */
}


/* 이미지 스타일 */
.product-img {
    max-width: 100px;
    max-height: 100px;
    object-fit: contain;
    display: block;
    margin: 0 auto;
    border: 1px solid #ddd; /* 연한 회색 테두리 */
    border-radius: 5px;
    padding: 5px;
}

</style>
