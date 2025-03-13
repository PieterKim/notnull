<template>
<div>
    <div class=header-container>
        <h1>Manage Supply Factories</h1>
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addFactoryModal">공급처 추가</button>
    </div>
    <div class='manage-users-container'>
        <table class="table">
            <thead>
                <tr>
                    <th>id</th>
                    <th>공급처명</th>
                    <th>주소</th>
                    <th>전화번호</th>
                    <th>담당자</th>
                    <th>수정</th>
                    <th>삭제</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="factory in paginatedFactories" :key="factory.id">
                    <td>{{factory.id}}</td>
                    <td>{{factory.factory_name}}</td>
                    <td>{{factory.factory_location}}</td>
                    <td>{{factory.factory_call_number}}</td>
                    <td>{{factory.representative}}</td>
                    <td><button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modifyFactoryModal" @click="modifyFactory(factory)">수정</button></td>
                    <td><button class="btn btn-danger" @click="deleteFactory(factory)">삭제</button></td>
                </tr>
            </tbody>
        </table>
    </div>
    
    <!-- 원산지 수정 모달 -->
    <div class="modal fade" id="modifyFactoryModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="staticBackdropLabel">Modify Factory</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form>
                    <div class="mb-3">
                        <label for="factory_name" class="form-label">공급처명</label>
                        <input type="text" class="form-control" id="factory_name" aria-describedby="emailHelp" v-model="editingFactory.factory_name">
                    </div>
                    <div class="mb-3">
                        <label for="factory_location" class="form-label">주소</label>
                        <input type="text" class="form-control" id="factory_location" v-model="editingFactory.factory_location">
                    </div>
                    <div class="mb-3">
                        <label for="factory_call_number" class="form-label">전화번호</label>
                        <input type="text" class="form-control" id="factory_call_number" v-model="editingFactory.factory_call_number">
                    </div>
                    <div class="mb-3">
                        <label for="representative" class="form-label">담당자</label>
                        <input type="text" class="form-control" id="representative" v-model="editingFactory.representative">
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="submit" class="btn btn-primary" data-bs-dismiss="modal" @click="submitModifyFactory">Submit</button>
            </div>
            </div>
        </div>
    </div>

    <!-- 원산지 추가 모달 -->
    <div class="modal fade" id="addFactoryModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="staticBackdropLabel">Add Factory</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form>
                    <div class="mb-3">
                        <label for="factory_name" class="form-label">공급처명</label>
                        <input type="text" class="form-control" id="factory_name" aria-describedby="emailHelp" v-model="newFactory.factory_name">
                    </div>
                    <div class="mb-3">
                        <label for="factory_location" class="form-label">주소</label>
                        <input type="text" class="form-control" id="factory_location" v-model="newFactory.factory_location">
                    </div>
                    <div class="mb-3">
                        <label for="factory_call_number" class="form-label">전화번호</label>
                        <input type="text" class="form-control" id="factory_call_number" v-model="newFactory.factory_call_number">
                    </div>
                    <div class="mb-3">
                        <label for="representative" class="form-label">담당자</label>
                        <input type="text" class="form-control" id="representative" v-model="newFactory.representative">
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="submit" class="btn btn-primary" data-bs-dismiss="modal" @click="submitAddFactory">Submit</button>
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
        paginatedFactories() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.factories.slice(start, end);
        },
        totalPages() {
            return Math.ceil(this.factories.length / this.itemsPerPage);
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
            factories:[],
            newFactory:{},
            editingFactory:{},
            currentPage: 1,
            itemsPerPage: 15
        };
    },
    setup(){},
    created(){
        
    },
    mounted(){
        this.getSupplyFactories();
    },
    unmounted(){},
    methods:{
        goToMenu(path){
            this.$router.push({path:path});//vue에서 사용하는 해당 경로의 라우터로 이동시키는 코드.
        },
        async getSupplyFactories(){
            try{
                const response = await axios.get('import.meta.env.VUE_APP_API_BASE_URL/admin/products/supplyFactories',{withCredentials:true});
                this.factories = response.data;
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
        async modifyFactory(factory){
            this.editingFactory = { ...factory };
        },
        async submitModifyFactory(){
            try{
                const response = await axios.patch('import.meta.env.VUE_APP_API_BASE_URL/admin/modifySupplyFactory',this.editingFactory,{withCredentials:true});
                this.getSupplyFactories();
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
                    alert('공급처 수정에 실패했습니다. : ',error);
                }
            }
        },
        async deleteFactory(factory){
            try{
                const response = await axios.delete(`import.meta.env.VUE_APP_API_BASE_URL/admin/deleteSupplyFactory/${factory.id}`,{withCredentials:true});
                if (response.status === 200) {
                    this.factories = this.factories.filter(fac => fac.id !== factory.id);
                }
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
                    alert('공급처 삭제에 실패했습니다. : ',error);
                }
            }
        },
        async submitAddFactory(){
            try{
                const response = await axios.post('import.meta.env.VUE_APP_API_BASE_URL/admin/addSupplyFactory',this.newFactory,{withCredentials:true});
                this.factories.push(response.data);
                this.newFactory = {};
                this.getSupplyFactories();
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
                    alert('공급처 추가에 실패했습니다. : ',error);
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
