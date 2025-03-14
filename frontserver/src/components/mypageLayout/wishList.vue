<template>
<div>

    <div class="wish-content">
        <h1>wish 리스트</h1>
        <table class="wish-table">
            <thead>
                <tr>
                    <th>상품 설명 이미지</th>
                    <th>상품이름</th>
                    <th>가격</th>
                    <th>삭제</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="product in userWishList" :key="product.id">
                    <td><img :src="product.product_description_img"></td>
                    <td>{{product.product_name}}</td>
                    <td>{{product.product_price}}</td>
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
            userWishList:[],
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
        async getWishList() {
            try{
                //const userId = this.session.userId;
                this.userid = this.$route.params.userId;
                console.log(`################프론트userId:${userId}`);
                // 로그인된 유저가 가지고있는 찜 리스트만 불러온다. 
                const response = await api.get(`/orders/wish/${userId}`); 
                                                                        // get 요청보낼때는 data 말고 params로 보내자
                this.userWishList = response.data;
            } catch(err){
                console.error(err);
            }
        },

        async deleteProduct(product) {
            try{
                const response = await api.delete(`/orders/wish/${product.id}`)
                if (response.status === 200) {
                    // 삭제에 성공하면 위시리스트 다시 받아오지 말고 그냥 기존의 위시리스트에서 삭제항목만 빼고 보여준다.
                    this.userWishList = this.userWishList.filter(w => w.id !== product.id);
                }
                console.log(response);
            }catch(error){
                alert("찜 삭제 실패");
                console.log("찜 삭제 실패", error);
            }
        }

    }
}

</script>

<style scoped>
.wish-content {
    margin-top: 50px;
}
</style>
