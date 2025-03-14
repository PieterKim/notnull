<template>
    <div>
        <div class="wish-content">
            <h1>찜 리스트</h1>
            <table class="table wish-table">
                <thead>
                    <tr>
                        <th>상품명</th>
                        <th>가격</th>
                        <th>장바구니 추가</th>
                        <th>삭제</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="product in wishedProducts" :key="product.id">
                        <td><img :src="product.product_image" class="product-img">
                            {{product.product_name}}</td>
                        <td>{{product.product_price}}원</td>
                        <td><button @click="addCart(product)">장바구니 추가</button></td>
                        <td><button @click="deleteProduct(product)">삭제</button></td>
                    </tr>
                </tbody>
            </table>
        </div>


    </div>
</template>

<script>
import api from "@/api.js"

export default{ 
    name:'',
    components:{},
    data(){
        return{
            wishedProducts:[],
            userid: 0,
        };
    },
    setup(){},
    created(){},
    mounted(){
        this.getWishList()
    },
    unmounted(){},
    methods:{

        // Wish READ
        async getWishList() {
            try{
                //const userId = this.session.userId;
                this.userid = this.$route.params.userId;
                console.log(`################프론트userid:${this.userid}`);
                // 로그인된 유저가 가지고있는 찜 리스트만 불러온다. 
                const response = await apit.get(`/orders/wish/${this.userid}`); 
                                                                        // get 요청보낼때는 data 말고 params로 보내자
                this.wishedProducts = response.data;
                //console.log(this.wishedProducts)
            } catch(err){
                console.error(err);
            }
        },

        //Wish DELETE
        async deleteProduct(product) {
            try{
                const deleteWish = confirm("해당 제품을 찜에서 삭제하실거에요?");
                
                //'취소' 누르면 함수 바로 종료
                if(!deleteWish){return;}
                console.log(`################Product선택된거:${JSON.stringify(product.id)}`);
                const response = await apit.delete(`/orders/wish/${product.id}`)

                // 삭제에 성공하면 위시리스트 다시 받아오지 말고 그냥 기존의 위시리스트에서 삭제항목만 빼고 보여준다.       
                if (response.status === 200) {
                    alert("찜에서 삭제되었다");
                    this.wishedProducts = this.wishedProducts.filter(w => w.id !== product.id);
                }
                console.log(response);

            }catch(error){
                alert("찜 삭제 실패");
                console.log("찜 삭제 실패", error);
            }
        },

        // Cart CREATE 1/6
        async addCart(product){
            try{
                // accountid, productid 보내주기
                this.userid = this.$route.params.userId;
                
                const userOrder = {
                    userId : this.userid,
                    product_Id : product.id,
                    quantity : 1,
                }
                console.log(`################userOrder:${JSON.stringify(userOrder)}`);
                // data를 req.body로 백에 보내고, res받아 완료 메세지 띄우기
                const response = await api.post(`/orders/cart`, userOrder);

                // "장바구니 갈래? y/n"
                if(response) {
                    const GotoCart = confirm(response.data.message);
                    if(GotoCart) {
                        this.$router.push(`/cart/${this.userid}`);              
                    /// frontserver/src/router/index.js 에 라우터 추가 
                } else {
                    alert("상품이 장바구니에 추가됐다.");
                }
                }else{
                    console.error(err);
                }

            }catch(err){
                alert("장바구니 추가 실패");
                console.error(err)
            }
        }
    }
}

</script>

<style scoped>

/* 전체 컨테이너 스타일 */
.wish-content {
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
.wish-table {
    width: 100%;
    border-collapse: collapse;
    text-align: center;
    background-color: #fff; /* 테이블 흰색 배경 */
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.wish-table th {
    text-align: center;
    vertical-align: middle;
    background-color: #f9f9f9; /* 연한 회색 */
    color: #4A4A4A; /* 텍스트 색상 변경 */
    padding: 15px;
    font-size: 1rem;
    border-bottom: 2px solid #ddd;
}

.wish-table td {
    text-align: center;
    vertical-align: middle;
    font-size: 1rem;
    color: #4A4A4A; /* 텍스트 색상 변경 */
    padding: 15px;
    border-bottom: 1px solid #ddd;
}

.wish-table tr:last-child td {
    border-bottom: none;
}

/* 버튼 스타일 */
.wish-table td button {
    padding: 8px 15px;
    border-radius: 5px;
    background-color: rgb(243, 239, 224); /* 장바구니와 동일한 배경색 */
    color: #4A4A4A; /* 텍스트 색상 변경 */
    border: none; /* 테두리 제거 */
    cursor: pointer;
    transition: all 0.2s ease-in-out;
}

.wish-table td button:hover {
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

/* 반응형 스타일 */
@media (max-width: 768px) {
    .wish-content {
        padding: 15px;
    }

    h1 {
        font-size: 1.5rem;
    }

    .wish-table th, .wish-table td {
        font-size: 0.9rem;
        padding: 10px;
    }

    .product-img {
        max-width: 80px;
        max-height: 80px;
    }

    .wish-table td button {
        padding: 6px 10px;
        font-size: 0.9rem;
    }
}

@media (max-width: 480px) {
    .wish-content {
        padding: 10px;
    }

    h1 {
        font-size: 1.2rem;
    }

    .wish-table th, .wish-table td {
        font-size: 0.8rem;
        padding: 8px;
    }

    .product-img {
        max-width: 60px;
        max-height: 60px;
    }

    .wish-table td button {
        padding: 5px 8px;
        font-size: 0.8rem;
    }

    .wish-table {
        font-size: 0.8rem;
    }
}




</style>




