<template>
<div>
    <h1>상품 수정, 추가 페이지</h1>
    <div class="container">
        <div class="mb-3">
            <label for="product_name" class="form-label">상품명(필수)</label>
            <input type="text" class="form-control" id="product_name" v-model="product.product_name">
        </div>
        <div class="mb-3">
            <label for="product_price" class="form-label">가격(필수)</label>
            <input type="number" class="form-control" id="product_price" v-model="product.product_price">
        </div>
        <div class="mb-3">
            <label for="product_description" class="form-label">상품 설명(필수)</label>
            <textarea class="form-control" id="product_description" v-model="product.product_description" rows="3"></textarea>
        </div>

        <!-- 상품 설명 이미지 폼 -->
        <form @submit.prevent="uploadDescriptionImage" class="mb-3">
            <label for="product_description_img" class="form-label">상품 설명 이미지</label>
            <img :src="product.product_description_img" alt="상품 설명 이미지" class="mt-2 img-preview">
            <div class="mb-3">
                <label for="product_description_img_file" class="form-label">상품 설명 이미지 변경</label>
                <input type="file" class="form-control" id="product_description_img_file" @change="handleDescriptionImageUpload" accept="image/*">
                <button type="submit" class="btn btn-secondary mt-2" v-if="descriptionImageFile">이미지 업로드</button>
            </div>
        </form>

        <div class="mb-3">
            <label for="product_stock" class="form-label">재고(필수)</label>
            <input type="number" class="form-control" id="product_stock" v-model="product.product_stock">
        </div>

        <!-- 상품 이미지 폼 -->
        <form @submit.prevent="uploadProductImage" class="mb-3">
            <label for="product_description_img" class="form-label">상품 이미지</label>
            <img :src="product.product_image" alt="상품 이미지" class="mt-2 img-preview">
            <div class="mb-3">
                <label for="product_image_file" class="form-label">상품 이미지 변경</label>
                <input type="file" class="form-control" id="product_image_file" @change="handleProductImageUpload" accept="image/*">
                <button type="submit" class="btn btn-secondary mt-2" v-if="productImageFile">이미지 업로드</button>
            </div>
        </form>

        <div class="mb-3">
            <label for="drink_type" class="form-label">주종(필수)</label>
            <input type="text" class="form-control" id="drink_type" v-model="product.drink_type">
        </div>
        <div class="mb-3">
            <label for="product_kind" class="form-label">상품 종류(필수)</label>
            <input type="text" class="form-control" id="product_kind" v-model="product.product_kind">
        </div>
        <div class="mb-3">
            <label for="product_location" class="form-label">원산지(필수)</label>
            <select class="form-select" id="product_location" v-model="product.product_location_id">
                <option v-for="location in productLocations" 
                        :key="location.id" 
                        :value="location.id">
                    {{ location.country }} - {{ location.city }}
                </option>
            </select>
        </div>
        <div class="mb-3">
            <label for="supply_factory" class="form-label">공급처(필수)</label>
            <select class="form-select" id="supply_factory" v-model="product.supply_factory_id">
                <option v-for="factory in supplyFactories" 
                        :key="factory.id" 
                        :value="factory.id">
                    {{ factory.factory_name }}
                </option>
            </select>
        </div>
        <div class="mb-3">
            <label for="product_created_at" class="form-label">생성일</label>
            <input type="datetime-local" class="form-control" id="product_created_at" v-model="product.created_at">
        </div>
        <div class="mb-3">
            <label for="product_updated_at" class="form-label">수정일</label>
            <input type="datetime-local" class="form-control" id="product_updated_at" v-model="product.updated_at">
        </div>
        <button v-show="isModify" type="button" class="btn btn-primary" @click="ModifyProduct">상품 수정</button>
        <button v-show="!isModify" type="button" class="btn btn-primary" @click="AddProduct">상품 추가</button>
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
            product:{
                product_name: '',
                product_price: '',
                product_description: '',
                product_description_img: '',
                product_stock: '',
                product_image: '',
                drink_type: '',
                product_kind: '',
                product_location_id: '',
                supply_factory_id: '',
                created_at: '',
                updated_at: ''
            },
            productLocations:[],
            supplyFactories:[],
            isModify:false,
            descriptionImageFile:null,
            productImageFile:null,
        };
    },
    setup(){},
    created(){
        //수정일 경우 params.id가 있고 추가일 경우 없음.
        if(this.$route.params.id){
            this.isModify = true;
            const productID = this.$route.params.id;
            axios.get(`import.meta.env.VUE_APP_API_BASE_URL/admin/products/${productID}`,{withCredentials:true})
            .then(response => {
                console.log(response);
                this.product = response.data;
            })
            .catch(error => {
                console.log("상품 조회에 실패했습니다.",error);
            });
        }
    },
    mounted(){
        this.getProductLocations();
        this.getSupplyFactories();
    },
    unmounted(){},
    methods:{
        async getProductLocations(){
            try{
                const response = await axios.get('import.meta.env.VUE_APP_API_BASE_URL/admin/products/locations',{withCredentials:true});
                this.productLocations = response.data;
                console.log("productLocations",response);
            }
            catch(error){
                if(error.response.status === 402){
                    alert('로그인이 필요합니다.');
                    this.$router.push('/login');
                }
                else if(error.response.status === 403){
                    alert('관리자 권한이 없습니다.');
                    this.$router.push('/');
                }
                else{
                    alert('상품 원산지 조회에 실패했습니다. : ',error);
                }
            }
        },
        async getSupplyFactories(){
            try{
                const response = await axios.get('import.meta.env.VUE_APP_API_BASE_URL/admin/products/supplyFactories',{withCredentials:true});
                this.supplyFactories = response.data;
                console.log("supplyFactories",response);
            }
            catch(error){
                if(error.response.status === 402){
                    alert('로그인이 필요합니다.');
                    this.$router.push('/login');
                }
                else if(error.response.status === 403){
                    alert('관리자 권한이 없습니다.');
                    this.$router.push('/');
                }
                else{
                    alert('상품 공급처 조회에 실패했습니다. : ',error);
                }
            }
        },

        //이미지 선택시 변수에 저장
        handleDescriptionImageUpload(event) {
            this.descriptionImageFile = event.target.files[0];
        },
        handleProductImageUpload(event) {
            this.productImageFile = event.target.files[0];
        },
        
        //이미지 업로드
        async uploadDescriptionImage() {
            if (!this.descriptionImageFile) {
                alert('이미지를 선택해주세요.');
                return;
            }
            try {
                const formData = new FormData();
                formData.append('image', this.descriptionImageFile);
                const response = await axios.post('import.meta.env.VUE_APP_API_BASE_URL/admin/upload/descriptionImg', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    withCredentials:true
                });
                this.product.product_description_img = response.data.imageUrl;
                console.log("product.product_description_img",this.product.product_description_img);
                console.log("이미지 업로드 응답",response);
            } catch (error) {
                if(error.response.status === 402){
                    alert('로그인이 필요합니다.');
                    this.$router.push('/login');
                }
                else if(error.response.status === 403){
                    alert('관리자 권한이 없습니다.');
                    this.$router.push('/');
                }
                else{
                    alert('상품 설명 이미지 업로드에 실패했습니다. : ',error);
                }
            }
        },
        async uploadProductImage() {
            if (!this.productImageFile) {
                alert('이미지를 선택해주세요.');
                return;
            }
            try {
                const formData = new FormData();
                formData.append('image', this.productImageFile);
                const response = await axios.post('import.meta.env.VUE_APP_API_BASE_URL/admin/upload/productImg', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    withCredentials:true
                });
                this.product.product_image = response.data.imageUrl;
                console.log("product.product_image",this.product.product_image);
                console.log("이미지 업로드 응답",response);
            } catch (error) {
                if(error.response.status === 402){
                    alert('로그인이 필요합니다.');
                    this.$router.push('/login');
                }
                else if(error.response.status === 403){
                    alert('관리자 권한이 없습니다.');
                    this.$router.push('/');
                }
                else{
                    alert('상품 이미지 업로드에 실패했습니다. : ',error);
                }
            }
        },

        //상품 추가
        async AddProduct(){
            try{
                const response = await axios.post('import.meta.env.VUE_APP_API_BASE_URL/admin/addProduct', this.product,{withCredentials:true});
                if(response.status === 200){
                    alert('상품 추가가 완료되었습니다.');
                    this.$router.push('/admin/manageProducts');
                }
                console.log("상품 추가 응답",response);
                this.product = {};
            }
            catch(error){
                if(error.response.status === 402){
                    alert('로그인이 필요합니다.');
                    this.$router.push('/login');
                }
                else if(error.response.status === 403){
                    alert('관리자 권한이 없습니다.');
                    this.$router.push('/');
                }
                else{
                    alert('상품 추가에 실패했습니다. : ',error);
                }
            }

        },
        //상품 수정
        async ModifyProduct(){
            try{
                const response = await axios.patch('import.meta.env.VUE_APP_API_BASE_URL/admin/modifyProduct', this.product,{withCredentials:true});
                if(response.status === 200){
                    alert('상품 수정이 완료되었습니다.');
                    this.$router.push('/admin/manageProducts');
                }
                console.log("상품 수정 응답",response);
            }
            catch(error){
                if(error.response.status === 402){
                    alert('로그인이 필요합니다.');
                    this.$router.push('/login');
                }
                else if(error.response.status === 403){
                    alert('관리자 권한이 없습니다.');
                    this.$router.push('/');
                }
                else{
                    alert('상품 수정에 실패했습니다. : ',error);
                }
            }
        },
    },
    watch:{}
}
</script>

<style scoped>
.img-preview {
    max-width: 300px;
    max-height: 300px;
    object-fit: contain;
}
</style>