<template>
    <div>
        <div class="cancelledList-content">
            <h1>취소/환불</h1>
            <table class="table cancelledList-table">
                <thead>
                    <tr>
                        <th>주문취소날짜</th>
                        <th>주문번호</th>
                        <th>상품정보</th>
                        <th>수량</th>
                        <th>상품금액</th>
                        <th>주문상태</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="info in cancelledList" :key="info.id" >
                        <td>{{ formatDate(info.updated_at) }}</td>
                        <td>{{ info.id }}</td>
                        <td>
                            <img :src="info.Product.product_image" alt="info.Product.product_name" class="product-img">
                            <span>{{ info.Product.product_name }}</span>
                        </td>
                        <td>{{ info.count }}</td>
                        <td>{{ (info.count * info.Product.product_price).toLocaleString()}}</td>
                        <td>{{ info.OrderStatus.status }}</td>
                        <td>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import api from "@/api.js"
import moment from 'moment';

export default{ 
    name:'',
    components:{},
    data(){
        return{
            cancelledList: [],
            //{"id":1,"count":2,"address":"ㅇㄹ","addressNumber":23534,"addressDetail":"ㄴㅇㅀ","orderMessage":"ㅁ오","created_at":"2025-01-12T17:38:22.000Z","updated_at":"2025-01-12T17:38:22.000Z","cancel_date":null,"cancel_reason":null,"final_paid_price":5580000,"account_id":1,"product_id":4,"status_id":1,
            // "Product":{"product_name":"달모어 25년 700ml","product_image":"http://www.kajawine.kr/data/item/4363187205/thumb-TheDalmore25YearsOldbottle_360x480.jpg"},
            // "OrderStatus":{"status":"주문 접수"}}
            userid: 0,
        };
    },
    setup(){},
    created(){},
    mounted(){
        this.getCancelledList();
    },
    unmounted(){},
    methods:{

        formatDate(date) {
            return moment(date).format('YYYY-MM-DD HH:mm:ss');
        },

        // Order READ
        async getCancelledList() {
            try{
                this.userid = this.$route.params.userId;
                const response = await api.get(`/orders/cancelledOrder/${this.userid}`);
                this.cancelledList = response.data //.sort((a, b) => b.id - a.id); // 주문번호순으로 정렬
                this.cancelledList = this.cancelledList.filter(cancel => cancel.OrderStatus.id > 5);
            }catch(err){
                console.error(err);
            }
        },

        
    },
}

</script>

<style scoped>

/* 전체 컨테이너 스타일 */
.cancelledList-content {
    max-width: 1200px;
    margin: 50px auto;
    padding: 20px;
    background-color: #fff; /* 흰색 배경 */
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* 제목 스타일 */
h1 {
    text-align: center;
    color: #4A4A4A; /* 텍스트 색상 변경 */
    margin-bottom: 20px;
    font-size: 2rem;
}

/* 테이블 스타일 */
.cancelledList-table {
    width: 100%;
    border-collapse: collapse;
    text-align: center;
    background-color: #fff; /* 테이블 흰색 배경 */
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.cancelledList-table th {
    text-align: center;
    vertical-align: middle;
    background-color: #f9f9f9; /* 연한 회색 */
    color: #4A4A4A; /* 텍스트 색상 변경 */
    padding: 15px;
    font-size: 1rem;
    border-bottom: 2px solid #ddd;
}

.cancelledList-table td {
    text-align: center;
    vertical-align: middle;
    font-size: 1rem;
    color: #4A4A4A; /* 텍스트 색상 변경 */
    padding: 15px;
    border-bottom: 1px solid #ddd;
}

.cancelledList-table tr:last-child td {
    border-bottom: none;
}

/* 버튼 스타일 */
.cancelledList-table td button {
    padding: 8px 15px;
    border-radius: 5px;
    background-color: rgb(243, 239, 224); /* 장바구니와 동일한 배경색 */
    color: #4A4A4A; /* 텍스트 색상 변경 */
    border: none; /* 테두리 제거 */
    cursor: pointer;
    transition: all 0.2s ease-in-out;
}

.cancelledList-table td button:hover {
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