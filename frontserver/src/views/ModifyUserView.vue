<template>
<div class="container" style="margin-top: 20vh">
    <h2 class="mb-4 text-center">사용자 정보 수정</h2>
    <div class="row justify-content-center">
        <div class="col-md-6">
            <div class="form-section">
                <h4 class="section-title">비밀번호 변경</h4>
                <form @submit.prevent="submitModifyPassword">
                    <div class="mb-3">
                        <label for="password">비밀번호(필수)</label>
                        <input type="password" v-model="newPassword" v-password_format class="form-control" id="password" required>
                    </div>
                    <div class="mb-3">
                        <label for="passwordConfirm">비밀번호 확인(필수)</label>
                        <input type="password" v-model="passwordConfirm" class="form-control" :class="{ 'is-invalid': !passwordMatch && passwordConfirm, 'is-valid': passwordMatch && passwordConfirm }" id="passwordConfirm" required>
                    </div>
                    <button type="submit" class="btn btn-primary me-2">비밀번호 변경</button>
                    <button type="button" class="btn btn-secondary" @click="$router.go(-1)">취소</button>
                </form>
            </div>
            
            <div class="form-section mt-4">
                <h4 class="section-title">회원 정보 수정</h4>
                <p class="text-muted small text-center mb-3">회원 정보 수정 및 탈퇴는 본인인증 이후에 완료가 가능합니다.</p>
                <form @submit.prevent="submitModifyUser">
                    <div class="mb-3">
                        <label for="account_name" class="form-label">name</label>
                        <input type="text" class="form-control" id="account_name" v-model="modifyUser.name" required>
                    </div>
                    <div class="mb-3">
                        <label for="birth" class="form-label">생년월일</label>
                        <div class="d-flex align-items-center gap-2">
                            <input 
                                type="date" 
                                class="form-control flex-grow-1" 
                                id="birth" 
                                v-model="modifyUser.birth" 
                                readonly 
                                placeholder="본인인증 후 자동으로 입력됩니다"
                            >
                            <button 
                                type="button"
                                class="btn verify-btn flex-shrink-0"
                                :class="{ 'verified': isVerify }"
                                @click="checkIdentify"
                            >
                                {{ isVerify ? '본인인증 완료' : '본인인증하기' }}
                            </button>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="account_nickname" class="form-label">nickname</label>
                        <input type="text" class="form-control" id="account_nickname" v-model="modifyUser.nickname" required>
                    </div>
                    <div class="mb-3">
                        <label for="account_phone_number" class="form-label">phone_number</label>
                        <input type="tel" v-phone_format class="form-control" id="account_phone_number" v-model="modifyUser.phone_number" required>
                    </div>
                    <div class="mb-3">
                        <label for="account_address" class="form-label">주소</label>
                        <div class="input-group mb-2">
                            <input type="text" class="form-control" id="account_addressNumber" v-model="modifyUser.addressNumber" placeholder="우편번호" readonly required>
                            <button type="button" class="btn btn-secondary" @click="execDaumPostcode" id="address-search">주소 검색</button>
                        </div>
                        <input type="text" class="form-control mb-2" id="account_address" v-model="modifyUser.address" placeholder="기본주소" readonly required>
                        <input type="text" class="form-control" id="account_addressDetail" v-model="modifyUser.addressDetail" placeholder="상세주소를 입력해주세요" required>
                    </div>
                    <div class="mt-4">
                        <button type="submit" class="btn btn-primary me-2" :disabled="!isVerify">저장</button>
                        <button v-if="!checkDropOut" type="button" class="btn btn-danger me-2" @click="deleteUser" :disabled="!isVerify">회원탈퇴</button>
                        <button v-else type="button" class="btn btn-danger me-2" @click="cancleDropOut" :disabled="!isVerify">회원탈퇴 취소</button>
                        <button type="button" class="btn btn-secondary" @click="$router.go(-1)">취소</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
</template>
<script>
import axios from 'axios'

export default{ 
    name:'ModifyUserView',
    components:{},
    computed:{
        passwordMatch() {
            return this.newPassword && this.passwordConfirm && this.newPassword === this.passwordConfirm;
        }
    },
    directives:{
        password_format:{
            mounted(el) {
                el.addEventListener('input', () => {
                    // 비밀번호는 12-16자리, 특수문자 최소 1개 포함
                    const passwordPattern = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{12,16}$/;
                    if (!passwordPattern.test(el.value)) {
                        el.classList.add('is-invalid');
                        el.setCustomValidity('비밀번호는 12자리 이상 16자리 이하이어야 하며, 특수문자를 최소 1회 이상 포함해야 합니다.');
                    } else {
                        el.classList.remove('is-invalid');
                        el.classList.add('is-valid');
                        el.setCustomValidity('');
                    }
                    el.reportValidity(); // 유효성 메시지를 즉시 표시
                });
            },
        },
        phone_format: {
            mounted(el) {
                el.addEventListener('input', () => {
                    // 숫자만 추출
                    let number = el.value.replace(/[^0-9]/g, "");
                    
                    // 길이에 따라 하이픈 추가
                    if (number.length > 3 && number.length <= 7) {
                        number = number.slice(0, 3) + "-" + number.slice(3);
                    } else if (number.length > 7) {
                        number = number.slice(0, 3) + "-" + number.slice(3, 7) + "-" + number.slice(7, 11);
                    }
                    
                    // 입력 값 업데이트
                    el.value = number;

                    // 유효성 검사
                    const phonePattern = /^010-\d{4}-\d{4}$/;
                    if (!phonePattern.test(el.value)) {
                        el.classList.add('is-invalid');
                        el.setCustomValidity('올바른 핸드폰 번호 형식을 입력하세요. (예: 010-1234-5678)');
                    } else {
                        el.classList.remove('is-invalid');
                        el.classList.add('is-valid');
                        el.setCustomValidity('');
                    }
                    el.reportValidity();
                });
            }
        },
        
    },
    data(){
        return{
            user:{},
            modifyUser: {},
            passwordConfirm: '',
            newPassword: '',
            checkDropOut:false,
            isVerify:false,
        };
    },
    setup(){},
    created(){
        this.getUser()
    },
    mounted(){},
    unmounted(){},
    methods:{
        async getUser(){
            try{
                const res = await axios.get(`import.meta.env.VUE_APP_API_BASE_URL/profile`,{withCredentials:true});
                this.user = res.data;
                if(this.user.delete_time){
                    this.checkDropOut = true;
                }
                this.modifyUser = {
                    id: this.user.id,
                    name: this.user.name,
                    birth: this.user.birth,
                    nickname: this.user.nickname,
                    phone_number: this.user.phone_number,
                    address: this.user.address,
                    addressNumber: this.user.addressNumber,
                    addressDetail: this.user.addressDetail
                };
            }catch(err){
                if (err.status===403) {
                alert('로그인이 필요함');
                this.$router.push(`/login`);
                console.error(err);
                }
            }
         },
         async submitModifyUser(){
            try{
                if(!this.modifyUser.addressNumber || !this.modifyUser.address || !this.modifyUser.addressDetail){
                    alert('주소를 입력해주세요.');
                    this.$nextTick(() => {
                        document.getElementById('address-search').focus();
                    });
                    return;
                }
                const formaPhone = this.modifyUser.phone_number.replace(/-/g, '');
                this.modifyUser.phone_number = formaPhone;
                const response = await axios.patch(`import.meta.env.VUE_APP_API_BASE_URL/profile/modifyUser`,this.modifyUser,{withCredentials:true});
                if(response.status === 200){
                    alert('사용자 정보가 수정되었습니다.');
                    this.$router.replace('/mypage');
                }
            }catch(err){
                if(err.response.status === 400){
                    alert(err.response.data.message);
                }
            }
         },
         async submitModifyPassword(){
            try{
                const response = await axios.patch(`import.meta.env.VUE_APP_API_BASE_URL/profile/modifyPassword`,{password:this.newPassword},{withCredentials:true});
                if(response.status === 200){
                    alert('비밀번호가 변경되었습니다.');
                    this.$router.replace('/mypage');
                }
            }catch(err){
                console.error(err);
            }
         },
         async deleteUser() {
            if (confirm('정말로 탈퇴하시겠습니까? 14일 뒤에 회원 정보가 삭제됩니다. (탈퇴 취소는 14일 내에 현재 페이지에서 진행이 가능합니다.)')) {
                try {
                    
                    const response = await axios.patch('import.meta.env.VUE_APP_API_BASE_URL/profile/dropOut',{}, { withCredentials: true });
                    if (response.status === 200) {
                        alert('회원 탈퇴가 완료되었습니다.');
                        await axios.post('import.meta.env.VUE_APP_API_BASE_URL/auth/logout',{}, { withCredentials: true });
                        this.$router.push('/');
                    }
                } catch (err) {
                    console.error(err);
                    alert('회원 탈퇴 처리 중 오류가 발생했습니다.');
                }
            }
        },
        async cancleDropOut(){
            try{
                const response = await axios.patch('import.meta.env.VUE_APP_API_BASE_URL/profile/cancleDropOut',{}, { withCredentials: true });
                if(response.status === 200){
                    alert('회원 탈퇴가 취소되었습니다.');
                    this.checkDropOut = false;
                    this.$router.replace('/mypage');
                }
            }catch(err){
                console.error(err);
            }
        },
        //주소 검색 api 메서드
        execDaumPostcode() {
          // Daum Postcode API 호출
          new daum.Postcode({
            oncomplete: (data) => {
              let roadAddr = data.roadAddress; // 도로명 주소
              let extraRoadAddr = ""; // 참고 항목

              // 참고항목 조합 (법정동, 건물명 등)
              if (data.bname && /[동|로|가]$/g.test(data.bname)) {
                extraRoadAddr += data.bname;
              }
              if (data.buildingName && data.apartment === "Y") {
                extraRoadAddr += extraRoadAddr
                  ? `, ${data.buildingName}`
                  : data.buildingName;
              }
              if (extraRoadAddr) {
                extraRoadAddr = ` (${extraRoadAddr})`;
              }

              // 데이터 바인딩
              this.modifyUser.addressNumber = data.zonecode; // 우편번호
              this.modifyUser.address = roadAddr; // 도로명 주소

              // 가이드 메시지 처리
              if (data.autoRoadAddress) {
                this.guide = `예상 도로명 주소: ${data.autoRoadAddress} ${extraRoadAddr}`;
              } else if (data.autoJibunAddress) {
                this.guide = `예상 지번 주소: ${data.autoJibunAddress}`;
              } else {
                this.guide = "";
              }
            },
          }).open(); // 팝업 창 열기
        },

        checkIdentify() {
            // 아임포트 초기화
            IMP.init('imp00267421'); // 발급받은 고유 식별 코드

            // 사용자 인증 요청
            IMP.certification(
                {
                pg: 'inicis_unified', // KG 이니시스 (실제 PG사에 맞게 설정)
                merchant_uid: `verify_${new Date().getTime()}`, // 주문번호
                m_redirect_url: 'import.meta.env.VUE_APP_API_BASE_URL/hdj_verify/verify', // 리디렉션 URL (모바일용)
                popup: true, // PC에서는 항상 true
                },
                (rsp) => {
                // callback
                if (rsp.success) {
                    // 인증 성공 시 로직
                    console.log('인증 성공:', rsp);

                    // 예시: 인증 성공 데이터를 서버로 전송
                    this.sendVerificationData(rsp);
                } else {
                    // 인증 실패 시 로직
                    console.error('인증 실패:', rsp.error_msg);
                    alert(`인증 실패: ${rsp.error_msg}`);
                }
                }
            );
        },
        async sendVerificationData(rsp) {
            try {
                const response = await axios.post('import.meta.env.VUE_APP_API_BASE_URL/hdj_verify/verify', {
                    imp_uid: rsp.imp_uid, // 인증 고유 ID
                    merchant_uid: rsp.merchant_uid, // 주문 번호
                });

                if (response.status === 200) {
                    alert('인증이 성공적으로 완료되었습니다.');
                    this.modifyUser.name = response.data.data.name;

                    // 날짜 형식 변환

                    // const birthParts = response.data.data.birth.split('/');
                    // const formattedBirth = `${birthParts[2]}-${birthParts[0].padStart(2, '0')}-${birthParts[1].padStart(2, '0')}`;
                    // this.modifyUser.birth = formattedBirth;

                    const userAgent = navigator.userAgent;
                    if(userAgent.includes('Windows NT')){
                        const birthParts = response.data.data.birth.split('.');
                        const formattedBirth = `${birthParts[0]}-${birthParts[1].trim().padStart(2, '0')}-${birthParts[2].trim().padStart(2, '0')}`;
                        this.modifyUser.birth = formattedBirth;
                    }
                    else{
                        // 날짜 형식 변환
                        const birthParts = response.data.data.birth.split('/');
                        const formattedBirth = `${birthParts[2]}-${birthParts[0].padStart(2, '0')}-${birthParts[1].padStart(2, '0')}`;
                        this.modifyUser.birth = formattedBirth;
                    }
                    this.modifyUser.phone_number = response.data.data.phone;
                    this.isVerify = true;
                    if(!response.data.data.adult){
                        alert('성인이 아닙니다.');
                        return;
                    }
                } else {
                    console.error('서버 응답 오류:', response.status);
                    alert('서버 오류로 인증 데이터를 전송하지 못했습니다.');
                }
            } catch (error) {
                console.error('인증 데이터 전송 중 오류:', error);
                alert('네트워크 오류로 인증 데이터를 전송하지 못했습니다.');
            }
        },
    }
}
</script>
<style scoped>
.input-group .btn {
    min-width: 100px;
    background-color: #f3efe0; 
    color: #4a4a4a; 
    border: none; 
    border-radius: 4px; 
    cursor: pointer;
    transition: background-color 0.2s ease, color 0.2s ease;
}

.input-group .btn:hover {
    background-color: #e5dcc3; 
    color: #000; 
}

.input-group input[type="text"] {
    max-width: 150px;
}

.form-control[readonly] {
    background-color: #f8f9fa; 
    cursor: default;
}

.btn {
    padding: 0.5rem 1rem;
    background-color: #f3efe0; 
    color: #4a4a4a; 
    border: none; 
    border-radius: 4px; 
    cursor: pointer;
    transition: background-color 0.2s ease, color 0.2s ease;
}

.btn-primary {
    background-color: #f3efe0; 
    color: #4a4a4a; 
}

.btn-primary:hover {
    background-color: #e5dcc3; 
    color: #000; 
}

.btn-secondary {
    background-color: #f3efe0; 
    color: #4a4a4a; 
}

.btn-secondary:hover {
    background-color: #e5dcc3; 
    color: #000; 
}

.btn:focus, .btn:active {
    outline: none; 
    box-shadow: none; 
}

.form-section {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 20px;
    background-color: #ffffff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.section-title {
    margin-bottom: 20px;
    color: #333;
    font-size: 1.2rem;
    font-weight: 500;
    text-align: center;
}

.verify-section {
    margin: 20px 0;
}

.verify-btn {
    min-width: 120px;
    height: 38px; /* Bootstrap 기본 input 높이와 동일하게 설정 */
    padding: 6px 12px;
    font-size: 14px;
    background-color: #f3efe0;
    color: #4a4a4a;
    border: none;
    border-radius: 4px;
    transition: all 0.3s ease;
}

.verify-btn:hover {
    background-color: #e5dcc3;
    color: #000;
}

.verify-btn.verified {
    background-color: #c8e6c9;
    color: #2e7d32;
}

</style>