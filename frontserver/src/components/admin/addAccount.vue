<template>
<div class="container">
    
        <div class="input-form-backgroud row">
            <div class="input-form col-md-12 mx-auto">
                <h4 class="mb-3">회원 추가</h4>
                <form class="validation-form" @submit.prevent="submitAddAccount">
                    <div class="row">
                        <div class="col-md-6 mb-3">
                        <label for="name">이름</label>
                        <input type="text" v-model="dataForAddAccount.name" class="form-control" id="name" placeholder="" value="" required>
                        <div class="invalid-feedback">
                            이름을 입력해주세요.
                        </div>
                        </div>
                        <div class="col-md-6 mb-3">
                        <label for="nickname">별명</label>
                        <input type="text" v-model="dataForAddAccount.nickname" class="form-control" id="nickname" placeholder="" value="" required>
                        <div class="invalid-feedback">
                            별명을 입력해주세요.
                        </div>
                        </div>
                    </div>

                    <div class="mb-3">
                        <label for="email">이메일</label>
                        <input type="email" v-email_format class="form-control" id="email" placeholder="you@example.com" v-model="dataForAddAccount.email" required>
                        <div class="invalid-feedback">
                        이메일을 입력해주세요.
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="password">비밀번호 (12-16자리, 특수문자 최소 1개 포함)</label>
                        <input type="text" v-password_format class="form-control" id="password" placeholder="비밀번호를 입력해주세요." v-model="dataForAddAccount.password" required>
                        <div class="invalid-feedback">
                            비밀번호를 입력해주세요.(12-16자리, 특수문자 최소 1개 포함)
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="address">주소</label>
                        <input type="text" class="form-control" id="address" placeholder="서울특별시 강남구" v-model="dataForAddAccount.address" required>
                        <div class="invalid-feedback">
                        주소를 입력해주세요.
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-6 mb-3">
                        <label for="addressDetail">상세주소</label>
                        <input type="text" class="form-control" id="addressDetail" placeholder="" v-model="dataForAddAccount.addressDetail" required>
                        </div>
                        <div class="col-md-6 mb-3">
                        <label for="addressNumber">우편번호</label>
                        <input type="text" class="form-control" id="addressNumber" placeholder="" v-model="dataForAddAccount.addressNumber" required>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                        <label for="birth">생년월일</label>
                            <input type="date" class="form-control" id="birth" placeholder="" v-model="dataForAddAccount.birth" required>
                        </div>
                        <div class="col-md-6 mb-3">
                        <label for="phoneNumber">전화번호 (010-1234-5678)</label>
                        <input type="text" v-phone_format class="form-control" id="phoneNumber" placeholder="" v-model="dataForAddAccount.phone_number" required>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                        <label for="superAdmin">관리자 여부</label>
                        <select class="form-control" id="superAdmin" v-model="dataForAddAccount.super_admin">
                            <option value="true">관리자</option>
                            <option value="false">사용자</option>
                        </select>
                        </div>
                    </div>
                <button class="btn btn-primary btn-lg btn-block" type="submit">submit</button>
                </form>
            </div>
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
            dataForAddAccount:{
                name:'',
                nickname:'',
                email:'',
                password:'',
                address:'',
                addressDetail:null,
                addressNumber:null,
                birth:null,
                phone_number:null,
            }
        };
    },
    directives:{
        //입력 양식 제한
        email_format:{
            mounted(el) {
                el.addEventListener('input', () => {
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailPattern.test(el.value)) {
                        el.setCustomValidity('올바른 이메일 형식을 입력하세요.');
                    } 
                    else {
                        el.setCustomValidity('');
                    }
                });
            }
        },
        number_format:{
            mounted(el) {
                el.addEventListener('input', () => {
                    // 한국 핸드폰 번호 형식: 010-XXXX-XXXX
                    const phonePattern = /^010-\d{4}-\d{4}$/;
                    el.value = el.value.replace(/[^0-9-]/g, ""); // 숫자와 '-'만 허용
                    if (!phonePattern.test(el.value)) {
                        el.setCustomValidity('올바른 한국 핸드폰 번호 형식을 입력하세요. 예: 010-1234-5678');
                    } else {
                        el.setCustomValidity('');
                    }
                });
            }
        },
        password_format:{
            mounted(el) {
                el.addEventListener('input', () => {
                    // 비밀번호는 12-16��리, 특수문자 최소 1개 포함
                    const passwordPattern = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{12,16}$/;
                    if (!passwordPattern.test(el.value)) {
                        el.setCustomValidity('비밀번호는 12자리 이상 16자리 이하이어야 하며, 특수문자를 최소 1회 이상 포함해야 합니다.');
                    } else {
                        el.setCustomValidity('');
                    }
                });
            }
        }
    },
    setup(){},
    created(){},
    mounted(){},
    unmounted(){},
    methods:{
        async submitAddAccount(){
            try{
                console.log(this.dataForAddAccount);
                const response = await axios.post('http://localhost:3000/admin/addAccount',this.dataForAddAccount,{withCredentials:true});
                this.dataForAddAccount = {
                    name:'',
                    nickname:'',
                    email:'',
                    password:'',
                    address:'',
                    addressDetail:'',
                    addressNumber:'',
                    birth:'',
                    phone_number:'',
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
                    alert('회원 추가에 실패했습니다. : ',error);
                }
                console.log("회원 추가에 실패했습니다.",error);
            }
        }
    },
    watch:{}
}
</script>

<style scoped>
    .container {
      min-height: 100vh;

      background: -webkit-gradient(linear, left bottom, right top, from(#92b5db), to(#1d466c));
      background: -webkit-linear-gradient(bottom left, #92b5db 0%, #1d466c 100%);
      background: -moz-linear-gradient(bottom left, #92b5db 0%, #1d466c 100%);
      background: -o-linear-gradient(bottom left, #92b5db 0%, #1d466c 100%);
      background: linear-gradient(to top right, #92b5db 0%, #1d466c 100%);
    }

    .input-form {
      max-width: 680px;

      margin-top: 80px;
      padding: 32px;

      background: #fff;
      -webkit-border-radius: 10px;
      -moz-border-radius: 10px;
      border-radius: 10px;
      -webkit-box-shadow: 0 8px 20px 0 rgba(0, 0, 0, 0.15);
      -moz-box-shadow: 0 8px 20px 0 rgba(0, 0, 0, 0.15);
      box-shadow: 0 8px 20px 0 rgba(0, 0, 0, 0.15)
    }
</style>