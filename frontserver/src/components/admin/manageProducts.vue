<template>
<div>
    <div class=header-container>
        <h1>Manage Products</h1>
        <button class="btn btn-primary" @click="goToMenu('/admin/addProduct')">상품 추가</button>
    </div>
    <div class="filter-container">
        <div class="search-box">
            <input type="text" v-model="searchQuery" placeholder="상품 검색" class="search-input">
        </div>
        <div class="price-range-box">
            <input type="number" v-model="minPrice" placeholder="최소 가격" class="price-input">
            <span>~</span>
            <input type="number" v-model="maxPrice" placeholder="최대 가격" class="price-input">
        </div>
        <div class="select-box">
            <select v-model="selectedLocation" class="form-select">
                <option value="">원산지 선택</option>
                <option v-for="location in locations" :key="location.id" :value="location.id">
                    {{ location.location_name }}
                </option>
            </select>
        </div>
        <div class="select-box">
            <select v-model="selectedFactory" class="form-select">
                <option value="">공급처 선택</option>
                <option v-for="factory in supplyFactories" :key="factory.id" :value="factory.id">
                    {{ factory.factory_name }}
                </option>
            </select>
        </div>
        <button @click="handleSearch" class="btn btn-primary">검색</button>
    </div>
    <div class='manage-users-container'>
        <table class="table">
            <thead>
                <tr>
                    <th>상품 번호</th>
                    <th>상품 이름</th>
                    <th>가격</th>
                    <th>상품 설명</th>
                    <th>상품 설명 이미지</th>
                    <th>재고</th>
                    <th>상품 이미지</th>
                    <th>주종</th>
                    <th>상품 종류</th>
                    <th>원산지</th>
                    <th>공급처</th>
                    <th>생성일</th>
                    <th>수정일</th>
                    <th>수정</th>
                    <th>삭제</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="product in paginatedProducts" :key="product.id">
                    <td>{{product.id}}</td>
                    <td>{{product.product_name}}</td>
                    <td>{{product.product_price.toLocaleString()}}</td>
                    <td>{{product.product_description}}</td>
                    <td><img :src="product.product_description_img" class="table-image" alt="상품 설명 이미지"></td>
                    <td>{{product.product_stock}}</td>
                    <td><img :src="product.product_image" class="table-image" alt="상품 이미지"></td>
                    <td>{{product.drink_type}}</td>
                    <td>{{product.product_kind}}</td>
                    <td>{{locations.find(location => location.id === product.product_location_id)?.location_name}}</td>
                    <td>{{supplyFactories.find(factory => factory.id === product.supply_factory_id)?.factory_name}}</td>
                    <td>{{product.created_at}}</td>
                    <td>{{product.updated_at}}</td>
                    <td><button type="button" class="btn btn-primary" @click="modifyProduct(product.id)">수정</button></td>
                    <td><button class="btn btn-danger" @click="deleteProduct(product)">삭제</button></td>
                </tr>
            </tbody>
        </table>
        
        <!-- 페이지네이션 -->
        <nav aria-label="Page navigation">
            <ul class="pagination justify-content-center">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                    <a class="page-link" href="#" @click.prevent="currentPage--">이전</a>
                </li>
                <li class="page-item" v-for="page in displayedPages" :key="page" :class="{ active: page === currentPage }">
                    <a class="page-link" href="#" @click.prevent="currentPage = page">{{ page }}</a>
                </li>
                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                    <a class="page-link" href="#" @click.prevent="currentPage++">다음</a>
                </li>
            </ul>
        </nav>
    </div>
    

</div>
</template>


<script>
import axios from 'axios';
export default{ 
    name:'',
    components:{},
    computed:{
        paginatedProducts() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.products.slice(start, end);
        },
        totalPages() {
            return Math.ceil(this.products.length / this.itemsPerPage);//math.ceil은 소수점 이하를 올림하는 함수
        },
        displayedPages() {
            const pages = [];
            let start, end;
            
            if (this.totalPages <= 3) {
                // 전체 페이지가 3개 이하인 경우
                start = 1;
                end = this.totalPages;
            } else {
                // 전체 페이지가 3개 ��과인 경우
                if (this.currentPage === 1) {
                    start = 1;
                    end = 3;
                } else if (this.currentPage === this.totalPages) {
                    start = this.totalPages - 2;
                    end = this.totalPages;
                } else {
                    start = this.currentPage - 1;
                    end = this.currentPage + 1;
                }
            }

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            return pages;
        }
    },
    data(){
        return{
            products:[],
            originalProducts:[],
            currentPage: 1,
            itemsPerPage: 15,
            searchQuery: '',
            minPrice: 0,
            maxPrice: 5000000,
            locations:[],
            supplyFactories:[],
            selectedLocation: '',
            selectedFactory: '',
        };
    },
    setup(){},
    created(){},
    mounted(){
        this.getProducts();
        this.getProductLocations();
        this.getSupplyFactories();
    },
    unmounted(){},
    methods:{
        goToMenu(path){
                this.$router.push({path:path});//vue에서 사용하는 해당 경로의 라우터로 이동시키는 코드.
        },
        async getProducts(){
            try{
                const response = await axios.get('http://localhost:3000/admin/products',{withCredentials:true});
                this.products = response.data;
                this.originalProducts = response.data;
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
                    alert('상품 목록을 불러오는데 실패했습니다. : ',error);
                }
            }
        },
        modifyProduct(productID){
            this.goToMenu(`/admin/ModifyProduct/${productID}`);
        },
        async deleteProduct(product){
            try{
                const response = await axios.delete(`http://localhost:3000/admin/products/${product.id}`,{withCredentials:true});
                if (response.status === 200) {
                    this.products = this.products.filter(p => p.id !== product.id);
                }
                console.log(response);
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
                    alert('상품 삭제에 실패했습니다. : ',error);
                }
            }
        },
        handleSearch() {
            // 원본 데이터로 시작
            let filteredProducts = [...this.originalProducts];

            // 검색어 필터�
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                filteredProducts = filteredProducts.filter(product => 
                    product.product_name.toLowerCase().includes(query) ||
                    product.product_description.toLowerCase().includes(query) ||
                    product.product_kind.toLowerCase().includes(query) ||
                    product.drink_type.toLowerCase().includes(query)
                );
            }

            // 가격 필터링
            if (this.minPrice || this.maxPrice) {
                filteredProducts = filteredProducts.filter(product => {
                    const price = product.product_price;
                    const minOk = !this.minPrice || price >= this.minPrice;
                    const maxOk = !this.maxPrice || price <= this.maxPrice;
                    return minOk && maxOk;
                });
            }

            // 원산지 필터�
            if (this.selectedLocation) {
                filteredProducts = filteredProducts.filter(product => 
                    product.product_location_id === this.selectedLocation
                );
            }

            // 공급처 필터링
            if (this.selectedFactory) {
                filteredProducts = filteredProducts.filter(product => 
                    product.supply_factory_id === this.selectedFactory
                );
            }

            // 필터링된 결� 적용
            this.products = filteredProducts;
            this.currentPage = 1;
        },
        async getProductLocations(){
            try{
                const response = await axios.get('http://localhost:3000/admin/products/locations',{withCredentials:true});
                this.locations = response.data;
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
                    alert('원산지 목록 조회에 실패했습니다. : ',error);
                }
            }
        },
        async getSupplyFactories(){
            try{
                const response = await axios.get('http://localhost:3000/admin/products/supplyFactories',{withCredentials:true});
                this.supplyFactories = response.data;
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
                    alert('공급처 목록을 불러오는데 실패했습니다. : ',error);
                }
            }
        },
    },
    watch:{}
}
</script>

<style scoped>
.header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.header-container h1 {
    margin: 0;
}

.btn {
    padding: 3px 8px;  /* 버튼의 내부 여백을 줄임 */
    font-size: 0.8rem; /* 글자 크기를 줄임 */
}

.modal-body form {
    text-align: left;
}

.table-image {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 4px;
}

.pagination {
    margin-top: 20px;
}

.page-link {
    color: #007bff;
    cursor: pointer;
    transition: all 0.3s ease;
}

.page-link:active {
    background-color: #e3f2fd;
    border-color: #90caf9;
    color: #1976d2;
}

/* focus 상태 제거 */
.page-link:focus {
    box-shadow: none;
    outline: none;
}

.page-item.active .page-link {
    background-color: #e3f2fd;
    border-color: #90caf9;
    color: #1976d2;
    font-weight: bold;
}

.page-link:hover {
    background-color: #f5f9ff;
    border-color: #90caf9;
    color: #1976d2;
}

.page-item.disabled .page-link {
    color: #6c757d;
    pointer-events: none;
    background-color: #f8f9fa;
}

.filter-container {
    display: flex;
    gap: 20px;
    align-items: center;
    margin-bottom: 20px;
    padding: 15px;
    background-color: #f8f9fa;
    border-radius: 8px;
}

.search-box, .price-range-box {
    display: flex;
    align-items: center;
    gap: 10px;
}

.search-input {
    width: 200px;
    padding: 5px 10px;
    border: 1px solid #ced4da;
    border-radius: 4px;
    height: 35px;
}

.price-input {
    width: 120px;
    padding: 5px 10px;
    border: 1px solid #ced4da;
    border-radius: 4px;
    height: 35px;
}

.select-box {
    min-width: 150px;
}

.form-select {
    height: 35px;
    border: 1px solid #ced4da;
    border-radius: 4px;
    padding: 5px 10px;
}
</style>
