<template>
<div>
    <h1>주문 관리</h1>
    <table class="order-table">
        <thead>
            <tr>
                <th>주문 ID</th>
                <th>주문자 아이디</th>
                <th>주문자 이메일</th>
                <th>상품 아이디</th>
                <th>상품명</th>
                <th>수량</th>
                <th>결제 금액</th>
                <th>주문지 주소</th>
                <th>주문지 상세주소</th>
                <th>주문 메시지</th>
                <th>주문일자</th>
                <th>수정일자</th>
                <th>취소 일자</th>
                <th>취소 이유</th>
                <th>수정</th>
                <th>취소</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="order in paginatedOrders" :key="order.id">
                <td>{{ order.id }}</td>
                <td>{{ order.account_id }}</td>
                <td>{{ order.Account.email }}</td>
                <td>{{ order.product_id }}</td>
                <td>{{ order.Product.product_name }}</td>
                <td>{{ order.count }}</td>
                <td>{{ order.final_paid_price ? order.final_paid_price.toLocaleString() : '-' }}</td>
                <td>{{ order.address }}</td>
                <td>{{ order.addressDetail }}</td>
                <td>{{ order.orderMessage }}</td>
                <td>{{ new Date(order.created_at).toLocaleString() }}</td>
                <td>{{ new Date(order.updated_at).toLocaleString() }}</td>
                <td>{{ order.cancel_date ? new Date(order.cancel_date).toLocaleString() : '-' }}</td>
                <td>{{ order.cancel_reason ? order.cancel_reason : '-' }}</td>
                <td><button class="edit-btn" @click="editOrder(order)" data-bs-toggle="modal" data-bs-target="#editOrderModal">수정</button></td>
                <td><button class="delete-btn" @click="cancelOrder(order.id)" data-bs-toggle="modal" data-bs-target="#cancelOrderModal">취소</button></td>
            </tr>
        </tbody>
    </table>

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

    <!-- 주문 수정 모달 -->
    <div class="modal fade" id="editOrderModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="editOrderModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Modal title</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="submitEditOrder">
                        <div class="form-group">
                            <label for="editOrderId">주문 ID</label>
                            <input type="text" id="editOrderId" v-model="editOrderData.id" class="form-control" readonly>
                        </div>
                        <div class="form-group">
                            <label for="editOrderAccountId">상품 id</label>
                            <input type="text" id="editOrderAccountId" v-model="editOrderData.product_id" class="form-control" readonly>
                        </div>
                        <div class="form-group">
                            <label for="editOrderCount">수량</label>
                            <input type="number" id="editOrderCount" v-model="editOrderData.count" class="form-control">
                        </div>
                        <div class="form-group">
                            <label for="editOrderAddress">주소</label>
                            <input type="text" id="editOrderAddress" v-model="editOrderData.address" class="form-control">
                        </div>
                        <div class="form-group">
                            <label for="editOrderAddressDetail">상세 주소</label>
                            <input type="text" id="editOrderAddressDetail" v-model="editOrderData.addressDetail" class="form-control">
                        </div>
                        <div>
                            <label for="editOrderCount">우편번호</label>
                            <input type="number" id="editOrderCount" v-model="editOrderData.addressNumber" class="form-control">
                        </div>
                        <div class="form-group">
                            <label for="editOrderMessage">주문 메시지</label>
                            <textarea id="editOrderMessage" v-model="editOrderData.orderMessage" class="form-control"></textarea>
                        </div>
                        <div class="form-group">
                            <label for="editOrderMessage">결제 금액</label>
                            <input type="number" id="editOrderMessage" v-model="editOrderData.final_paid_price" class="form-control">
                        </div>
                        <div class="form-group">
                            <label for="editOrderMessage">취소 일자</label>
                            <input type="date" id="editOrderMessage" v-model="editOrderData.cancel_date" class="form-control">
                        </div>
                        <div class="form-group">
                            <label for="editOrderMessage">취소 이유</label>
                            <input type="text" id="editOrderMessage" v-model="editOrderData.cancel_reason" class="form-control">
                        </div>
                        
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">닫기</button>
                    <button type="button" class="btn btn-primary" @click="submitEditOrder" data-bs-dismiss="modal">수정 완료</button>
                </div>
            </div>
        </div>
    </div>
    
    <!-- 주문 취소 모달 -->
    <div class="modal fade" id="cancelOrderModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="cancelOrderModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Modal title</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="submitCancelOrder">
                        <div class="form-group">
                            <label for="cancelOrderId">주문 ID</label>
                            <input type="text" id="cancelOrderId" v-model="cancelOrderData.id" class="form-control" readonly>
                        </div>
                        <div class="form-group">
                            <label for="cancelOrderReason">취소 이유</label>
                            <input type="text" id="cancelOrderReason" v-model="cancelOrderData.cancel_reason" class="form-control">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">닫기</button>
                    <button type="button" class="btn btn-primary" @click="submitCancelOrder" data-bs-dismiss="modal">취소</button>
                </div>
            </div>
        </div>
    </div>
</div>
</template>


<script>
import api from "@/api.js"

export default{ 
    name:'manageOrders',
    components:{},
    computed:{
        paginatedOrders() {//페이지 별로 나오는 데이터 정해주는 함수
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.orders.slice(start, end);
        },
        totalPages() {//총 페이지 수 정해주는 함수
            return Math.ceil(this.orders.length / this.itemsPerPage);
        },
        displayedPages() {
            const pages = [];
            let start, end;
            
            if (this.totalPages <= 3) {
                // 전체 페이지가 3개 이하인 경우
                start = 1;
                end = this.totalPages;
            } else {
                // 전체 페이지가 3개 이상인 경우
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
            orders:[],
            currentPage:1,
            itemsPerPage:10,
            editOrderData:{},
            cancelOrderData:{},
        };
    },
    setup(){},
    created(){},
    mounted(){
        this.getOrders();
    },
    unmounted(){},
    methods:{
        async getOrders(){
            try{
                const response = await api.get('/admin/orders',{withCredentials:true});
                this.orders = response.data;
            }catch(error){
                if(error.response.status === 402){
                    alert('로그인이 필요합니다.');
                    this.$router.push('/login');
                }
                else if(error.response.status === 403){
                    alert('관리자 권한이 없습니다.');
                    this.$router.push('/');
                }
                else{
                    alert('주문 목록 조회에 실패했습니다. : ',error);
                }
            }
        },
        editOrder(order){
            this.editOrderData = {...order};
        },
        cancelOrder(orderId){
            this.cancelOrderData = {id:orderId};
        },
        async submitCancelOrder(){
            try{
                await api.patch('/orders/cancel',this.cancelOrderData,{withCredentials:true});
                this.getOrders();
            }catch(error){
                console.log(error);
            }
        },
        async submitEditOrder(){
            try{
                await api.patch('/orders/modify',this.editOrderData,{withCredentials:true});
                this.getOrders();
            }catch(error){
                console.log(error);
            }
            
        }
    },
    watch:{}
}
</script>

<style scoped>
.order-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    overflow: hidden;
}

.order-table th, .order-table td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #e0e0e0;
    background-color: #ffffff;
}

.order-table th {
    font-weight: bold;
    color: #333;
}

.order-table tr:nth-child(even) {
    background-color: #f9f9f9;
}

.order-table tr:hover {
    background-color: #f1f1f1;
}

.edit-btn {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 20px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.edit-btn:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
}

.edit-btn:active {
    background-color: #004085;
    transform: translateY(0);
}

.delete-btn {
    background-color: #dc3545;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 20px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.delete-btn:hover {
    background-color: #c82333;
    transform: translateY(-2px);
}

.delete-btn:active {
    background-color: #bd2130;
    transform: translateY(0);
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

.form-group {
    margin-bottom: 15px;
}

.form-control {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.form-control:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

.btn-primary {
    background-color: #007bff;
    border-color: #007bff;
    color: white;
    transition: background-color 0.3s ease;
}

.btn-primary:hover {
    background-color: #0056b3;
    border-color: #0056b3;
}

.mt-3 {
    margin-top: 1rem;
}
</style>