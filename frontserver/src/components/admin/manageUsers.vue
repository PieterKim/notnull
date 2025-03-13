<template>
<div>
    <div class=header-container>
        <h1>Manage Users</h1>
        <button class="btn btn-primary" @click="goToMenu('/admin/addAccount')">사용자 추가</button>
    </div>
    <div class='manage-users-container'>
        <table class="table">
            <thead>
                <tr>
                    <th>번호</th>
                    <th>이메일</th>
                    <th>이름</th>
                    <th>생년월일</th>
                    <th>닉네임</th>
                    <th>전화번호</th>
                    <th>주소</th>
                    <th>우편번호</th>
                    <th>상세주소</th>
                    <th>계정등급 포인트</th>
                    <th>계정등급 아이디</th>
                    <th>적립금</th>
                    <th>가입일</th>
                    <th>탈퇴예정일</th>
                    <th>관리자 여부</th>
                    <th>수정</th>
                    <th>삭제</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in paginatedUsers" :key="user.id">
                    <td>{{user.id}}</td>
                    <td>{{user.email}}</td>
                    <td>{{user.name}}</td>
                    <td>{{user.birth}}</td>
                    <td>{{user.nickname}}</td>
                    <td>{{user.phone_number}}</td>
                    <td>{{user.address}}</td>
                    <td>{{user.addressNumber}}</td>
                    <td>{{user.addressDetail}}</td>
                    <td>{{user.ratingPoint}}</td>
                    <td>{{user.rating_id}}</td>
                    <td>{{user.savedMoney}}</td>
                    <td>{{user.created_at}}</td>
                    <td>{{user.delete_time}}</td>
                    <td>{{user.super_admin ? '관리자' : '사용자'}}</td>
                    <td><button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop" @click="modifyUser(user)">수정</button></td>
                    <td><button class="btn btn-danger" @click="deleteUser(user)">삭제</button></td>
                </tr>
            </tbody>
        </table>
    </div>
    
    <!-- Modal -->
    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="staticBackdropLabel">Modify User</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form>
                    <div class="mb-3">
                        <label for="account_id" class="form-label">ID</label>
                        <input type="text" class="form-control" id="account_id" aria-describedby="emailHelp" v-model="editingUser.id">
                    </div>
                    <div class="mb-3">
                        <label for="account_email" class="form-label">Email address</label>
                        <input type="email" class="form-control" id="account_email" aria-describedby="emailHelp" v-model="editingUser.email">
                        <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
                    </div>
                    <div class="mb-3">
                        <label for="account_password" class="form-label">Password</label>
                        <input type="password" class="form-control" id="account_password" v-model="editingUser.password">
                    </div>
                    <div class="mb-3">
                        <label for="account_name" class="form-label">name</label>
                        <input type="text" class="form-control" id="account_name" aria-describedby="emailHelp" v-model="editingUser.name">
                    </div>
                    <div class="mb-3">
                        <label for="account_birth" class="form-label">birth</label>
                        <input type="date" class="form-control" id="account_birth" v-model="editingUser.birth">
                    </div>
                    <div class="mb-3">
                        <label for="account_nickname" class="form-label">nickname</label>
                        <input type="text" class="form-control" id="account_nickname" aria-describedby="emailHelp" v-model="editingUser.nickname">
                    </div>
                    <div class="mb-3">
                        <label for="account_phone_number" class="form-label">phone_number</label>
                        <input type="text" class="form-control" id="account_phone_number" aria-describedby="emailHelp" v-model="editingUser.phone_number">
                    </div>
                    <div class="mb-3">
                        <label for="account_address" class="form-label">address</label>
                        <input type="text" class="form-control" id="account_address" aria-describedby="emailHelp" v-model="editingUser.address">
                    </div>
                    <div class="mb-3">
                        <label for="account_addressNumber" class="form-label">addressNumber</label>
                        <input type="text" class="form-control" id="account_addressNumber" aria-describedby="emailHelp" v-model="editingUser.addressNumber">
                    </div>
                    <div class="mb-3">
                        <label for="account_addressDetail" class="form-label">addressDetail</label>
                        <input type="text" class="form-control" id="account_addressDetail" aria-describedby="emailHelp" v-model="editingUser.addressDetail">
                    </div>
                    <div class="mb-3">
                        <label for="account_ratingPoint" class="form-label">ratingPoint</label>
                        <input type="text" class="form-control" id="account_ratingPoint" aria-describedby="emailHelp" v-model="editingUser.ratingPoint">
                    </div>
                    <div class="mb-3">
                        <label for="account_rating_id" class="form-label">rating_id</label>
                        <select class="form-select" id="account_rating_id" v-model="editingUser.rating_id">
                            <option v-for="rating in ratings" :key="rating.id" :value="rating.id">
                                {{ rating.rating_name }}
                            </option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="account_savedMoney" class="form-label">savedMoney</label>
                        <input type="text" class="form-control" id="account_savedMoney" aria-describedby="emailHelp" v-model="editingUser.savedMoney">
                    </div>
                    <div class="mb-3">
                        <label for="account_super_admin" class="form-label">관리자 권한</label>
                        <select class="form-select" id="account_super_admin" v-model="editingUser.super_admin">
                            <option :value="true">관리자</option>
                            <option :value="false">사용자</option>
                        </select>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="submit" class="btn btn-primary" data-bs-dismiss="modal" @click="submitModifyUser">Submit</button>
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
        paginatedUsers() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.users.slice(start, end);
        },
        totalPages() {
            return Math.ceil(this.users.length / this.itemsPerPage);
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
            users:[],
            ratings:[],
            editingUser:{},
            currentPage: 1,
            itemsPerPage: 15
        };
    },
    setup(){},
    created(){},
    mounted(){
        this.getUsers();
    },
    unmounted(){},
    methods:{
        goToMenu(path){
                this.$router.push({path:path});//vue에서 사용하는 해당 경로의 라우터로 이동시키는 코드.
        },
        async getUsers(){
            try{
                const response = await axios.get('import.meta.env.VUE_APP_API_BASE_URL/admin/users',{withCredentials:true});
                this.users = response.data.users;
                this.ratings = response.data.ratings;
                console.log(this.users);
                console.log(this.ratings);
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
                    alert('사용자 목록을 불러오는데 실패했습니다. : ',error);
                }
            }
        },
        modifyUser(user){
            this.editingUser = {...user};
        },
        async submitModifyUser(){
            try{
                const userIndex = this.users.findIndex(user => user.id === this.editingUser.id);
                const response = await axios.patch(`import.meta.env.VUE_APP_API_BASE_URL/admin/users`,this.editingUser,{withCredentials:true});
                if (response.status === 200) {
                    this.users[userIndex] = { ...this.editingUser };
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
                    alert('사용자 수정에 실패했습니다. : ',error);
                }
            }
        },
        async deleteUser(user){
            try{
                const response = await axios.delete(`import.meta.env.VUE_APP_API_BASE_URL/admin/users/${user.id}`,{withCredentials:true});
                if (response.status === 200) {
                    this.users = this.users.filter(u => u.id !== user.id);
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
                    alert('사용자 삭제에 실패했습니다. : ',error);
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
