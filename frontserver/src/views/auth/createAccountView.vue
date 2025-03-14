<template>
<div class="container">
    <div class="input-form-backgroud row">
        <div class="input-form col-md-12 mx-auto">
            <h4 class="mb-3">회원가입</h4>
            <form class="validation-form" @submit.prevent="submitCreateAccount">
                
                <div class="mb-3">
                    <label for="email">이메일</label>
                    <input ref="emailInput" type="email" v-model="createAccountData.email" v-email_format class="form-control" id="email" placeholder="you@example.com" required>
                </div>
                <div class="mb-3">
                    <label for="password">비밀번호</label>
                    <input type="password" v-model="createAccountData.password" v-password_format class="form-control" id="password" required>
                    
                </div>
                <div class="mb-3">
                    <label for="passwordConfirm">비밀번호 확인</label>
                    <input type="password" v-model="passwordConfirm" class="form-control" :class="{ 'is-invalid': !passwordMatch && passwordConfirm, 'is-valid': passwordMatch && passwordConfirm }" id="passwordConfirm" required>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="name">이름</label>
                        <input type="text" v-model="createAccountData.name" class="form-control" id="name" readonly required>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="nickname">닉네임</label>
                        <input type="text" v-model="createAccountData.nickname" class="form-control" id="nickname" required>
                    </div>
                </div>
                <div class="mb-3">
                    <label for="birth">생년월일</label>
                    <div class="input-group">
                        <input type="date" v-model="createAccountData.birth" class="form-control" id="birth" readonly required>
                        <button type="button" class="btn btn-secondary" id="verify-age" @click="checkIdentify">본인인증</button>
                    </div>
                </div>
                <div class="mb-3">
                    <label for="phone">핸드폰 번호</label>
                    <input type="tel" v-model="createAccountData.phone_number" v-phone_format class="form-control" id="phone" placeholder="010-0000-0000" required>
                </div>
                <div class="mb-3">
                    <label for="address">주소</label>
                    <div class="input-group">
                        <input type="text" v-model="createAccountData.addressNumber" class="form-control w-25" id="addressNumber" placeholder="우편번호" readonly required>
                        <button type="button" @click="execDaumPostcode" class="btn btn-secondary" id="address-search">주소 검색</button>
                    </div>
                </div>
                <div class="mb-3">
                    <input type="text" v-model="createAccountData.address" class="form-control" id="address" placeholder="주소" readonly required>
                </div>
                <div class="mb-3">
                    <input type="text" v-model="createAccountData.addressDetail" class="form-control" id="addressDetail" placeholder="상세주소" required>
                </div>
                <button class="btn btn-primary btn-lg btn-block" type="submit">가입하기</button>
            </form>
        </div>
    </div>
</div>
</template>

<script>
import api from "@/api.js"
export default{ 
    name:'',
    components:{},
    computed:{
        passwordMatch() {
            return this.createAccountData.password && this.passwordConfirm && this.createAccountData.password === this.passwordConfirm;
        }
    },
    directives:{
        //입력 양식 제한
        email_format: {
            mounted(el) {
                el.addEventListener('input', () => {
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailPattern.test(el.value)) {
                        el.classList.add('is-invalid');
                        el.setCustomValidity('올바른 이메일 형식을 입력하세요. (예: example@email.com)');
                    } else {
                        el.classList.remove('is-invalid');
                        el.classList.add('is-valid');
                        el.setCustomValidity('');
                    }
                    el.reportValidity(); // 유효성 메시지를 즉시 표시
                });
            }
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
            }
        }
    },
    data(){
        return{
            passwordConfirm: '',
            createAccountData:{
                email: null,
                password: null,
                name: null,
                nickname: null,
                birth: null,
                phone_number: null,
                address: null,
                addressDetail: null,
                addressNumber: null
            },
            postcode: null,
            roadAddress: null,
            isAdult: false,
        };
    },
    setup(){},
    created(){},
    mounted(){},
    unmounted(){},
    methods:{
        checkDate(){
            console.log(this.createAccountData.birth);
        },
        async submitCreateAccount(){
            if(!this.passwordMatch){
                alert('비밀번호가 일치하지 않습니다.');
                document.getElementById('password').focus();
                return;
            }
            if(!this.createAccountData.addressNumber || !this.createAccountData.address || !this.createAccountData.addressDetail){
                alert('주소를 입력해주세요.');
                this.$nextTick(() => {
                    document.getElementById('address-search').focus();
                });
                return;
            }
            try{
                const formaPhone = this.createAccountData.phone_number.replace(/-/g, '');
                this.createAccountData.phone_number = formaPhone;
                const response = await api.post('/auth/signup',this.createAccountData,{withCredentials:true});
                // 성공 시 알림 표시 후 루트로 이동
                alert('회원가입이 성공적으로 완료되었습니다.');
                this.$router.push('/login');
                
            }catch(error){
                if(error.response.status === 400){
                    alert(error.response.data.message);
                    this.$nextTick(() => {
                      this.$refs.emailInput.focus();
                    });
                }
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
              this.createAccountData.addressNumber = data.zonecode; // 우편번호
              this.createAccountData.address = roadAddr; // 도로명 주소

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
                m_redirect_url: 'http://localhost:3000/hdj_verify/verify', // 리디렉션 URL (모바일용)
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
                const response = await api.post('/hdj_verify/verify', {
                    imp_uid: rsp.imp_uid, // 인증 고유 ID
                    merchant_uid: rsp.merchant_uid, // 주문 번호
                });

                if (response.status === 200) {
                    console.log('서버로 인증 데이터 전송 성공:', response.data);
                    alert('인증이 성공적으로 완료되었습니다.');
                    this.createAccountData.name = response.data.data.name;

                    const userAgent = navigator.userAgent;
                    if(userAgent.includes('Windows NT')){
                        const birthParts = response.data.data.birth.split('.');
                        const formattedBirth = `${birthParts[0]}-${birthParts[1].trim().padStart(2, '0')}-${birthParts[2].trim().padStart(2, '0')}`;
                        this.createAccountData.birth = formattedBirth;
                    }
                    else{
                        // 날짜 형식 변환
                        const birthParts = response.data.data.birth.split('/');
                        const formattedBirth = `${birthParts[2]}-${birthParts[0].padStart(2, '0')}-${birthParts[1].padStart(2, '0')}`;
                        this.createAccountData.birth = formattedBirth;
                    }

                    this.createAccountData.phone_number = response.data.data.phone;
                    

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
    },
    watch:{
        
    }
}
</script>

<style scoped>
.container {
    max-width: 800px;
}

.input-form {
    max-width: 680px;
    margin-top: 80px;
    padding: 32px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 8px 20px 0 rgba(0, 0, 0, 0.15);
}

.btn-block {
    width: 100%;
    margin-top: 24px;
}

label {
    margin-bottom: 0.5rem;
}

.input-group .btn {
    margin-left: 10px;
    white-space: nowrap;
}

.input-group input[readonly],
input[readonly].form-control {
    background-color: #f8f9fa;
    cursor: not-allowed;
}

</style>
