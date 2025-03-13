<template>
<div>
    <div class=header-container>
        <h1>Manage Coupons</h1>
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addCouponModal">쿠폰 추가</button>
    </div>
    <div class='manage-users-container'>
        <table class="table">
            <thead>
                <tr>
                    <th>id</th>
                    <th>쿠폰명</th>
                    <th>할인률</th>
                    <th>생성일</th>
                    <th>수정일</th>
                    <th>만료일</th>
                    <th>수정</th>
                    <th>삭제</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="coupon in paginatedCoupons" :key="coupon.id">
                    <td>{{coupon.id}}</td>
                    <td>{{coupon.coupon_name}}</td>
                    <td>{{coupon.coupon_discount_rate}}</td>
                    <td>{{coupon.created_at}}</td>
                    <td>{{coupon.updated_at}}</td>
                    <td>{{coupon.end_date}}</td>
                    <td><button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modifyCouponModal" @click="modifyCoupon(coupon)">수정</button></td>
                    <td><button class="btn btn-danger" @click="deleteCoupon(coupon)">삭제</button></td>
                </tr>
            </tbody>
        </table>
    </div>
    
    <!-- 등급명 수정 모달 -->
    <div class="modal fade" id="modifyCouponModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="staticBackdropLabel">Modify Coupon</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form>
                    <div class="mb-3">
                        <label for="name" class="form-label">쿠폰명</label>
                        <input type="text" class="form-control" id="name" aria-describedby="emailHelp" v-model="editingCoupon.coupon_name">
                    </div>  
                    <div class="mb-3">
                        <label for="rate" class="form-label">할인률</label>
                        <input type="text" class="form-control" id="rate" v-model="editingCoupon.coupon_discount_rate">
                    </div>
                    <div class="mb-3">
                        <label for="expiry" class="form-label">만료일</label>
                        <input type="date" class="form-control" id="expiry" v-model="editingCoupon.end_date">
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="submit" class="btn btn-primary" data-bs-dismiss="modal" @click="submitModifyCoupon">Submit</button>
            </div>
            </div>
        </div>
    </div>

    <!-- 등급명 추가 모달 -->
    <div class="modal fade" id="addCouponModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="staticBackdropLabel">Add Coupon</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form>
                    <div class="mb-3">
                        <label for="name" class="form-label">쿠폰명</label>
                        <input type="text" class="form-control" id="name" aria-describedby="emailHelp" v-model="newCoupon.coupon_name">
                    </div>
                    <div class="mb-3">
                        <label for="rate" class="form-label">할인률</label>
                        <input type="text" class="form-control" id="rate" v-model="newCoupon.coupon_discount_rate">
                    </div>
                    <div class="mb-3">
                        <label for="expiry" class="form-label">만료일</label>
                        <input type="date" class="form-control" id="expiry" v-model="newCoupon.end_date">
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="submit" class="btn btn-primary" data-bs-dismiss="modal" @click="submitAddCoupon">Submit</button>
            </div>
            </div>
        </div>
    </div>          
    
    <!-- 페이지네이션 추가 -->
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
</template>


<script>
import axios from 'axios';
export default{ 
    name:'',
    components:{},
    computed:{
        paginatedCoupons() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.coupons.slice(start, end);
        },
        totalPages() {
            return Math.ceil(this.coupons.length / this.itemsPerPage);
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
            coupons:[],
            newCoupon:{},
            editingCoupon:{},
            currentPage: 1,
            itemsPerPage: 15
        };
    },
    setup(){},
    created(){
    },
    mounted(){
        this.getCoupons();
    },
    unmounted(){},
    methods:{
        goToMenu(path){
            this.$router.push({path:path});//vue에서 사용하는 해당 경로의 라우터로 이동시키는 코드.
        },
        async getCoupons(){
            try{
                const response = await axios.get('import.meta.env.VUE_APP_API_BASE_URL/admin/coupons',{withCredentials:true});
                this.coupons = response.data;
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
                    alert('등급명 목록 조회에 실패했습니다. : ',error);
                }
            }
        },
        async modifyCoupon(coupon){
            this.editingCoupon = { ...coupon };
        },
        async submitModifyCoupon(){
            try{
                const response = await axios.patch('import.meta.env.VUE_APP_API_BASE_URL/admin/modifyCoupon',this.editingCoupon,{withCredentials:true});
                this.getCoupons();
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
                    alert('원폰 수정에 실패했습니다. : ',error);
                }
            }
        },
        async deleteCoupon(coupon){
            try{
                const response = await axios.delete(`import.meta.env.VUE_APP_API_BASE_URL/admin/deleteCoupon/${coupon.id}`,{withCredentials:true});
                this.coupons = this.coupons.filter(cou => cou.id !== coupon.id);
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
                    alert('쿠폰 삭제에 실패했습니다. : ',error);
                }
            }
        },
        async submitAddCoupon(){
            try{
                const response = await axios.post('import.meta.env.VUE_APP_API_BASE_URL/admin/addCoupon',this.newCoupon,{withCredentials:true});
                this.coupons.push(response.data);
                this.newCoupon = {};
                this.getCoupons();
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
                    alert('쿠폰 추가에 실패했습니다. : ',error);
                }
            }
        }
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
</style>
