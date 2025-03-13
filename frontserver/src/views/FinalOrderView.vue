<template>
<div class="container">
  <form class="content-wrapper" @submit.prevent="KGpay">
    <div class="order-header">
      <h1>주문/결제</h1>
      <div class="order-steps">
        <span class="step completed">장바구니</span>
        <span class="step-arrow"></span>
        <span class="step active">주문/결제</span>
        <span class="step-arrow"></span>
        <span class="step">주문완료</span>
      </div>
    </div>

    <!-- 주문 상품 정보 -->
    <div class="order-section">
      <h2 class="section-title">주문 상품 정보</h2>
      <div class="product-table">
        <table>
          <thead>
            <tr>
              <th>상품 정보</th>
              <th>수량</th>
              <th>상품금액</th>
              <th>합계금액</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="info in productInfo" :key="info.id">
              <td class="product-info">
                <img :src="info.Product.product_image" :alt="info.Product.product_name">
                <span class="product-name">{{info.Product.product_name}}</span>
              </td>
              <td>{{info.count}}개</td>
              <td>{{info.Product.product_price.toLocaleString()}}원</td>
              <td class="price">{{(info.count * info.Product.product_price).toLocaleString()}}원</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 적립금, 쿠폰 적용 -->
    <div class="order-section">
      <h2 class="section-title">할인 적용</h2>
      <div class="discount-form">
        <!-- 쿠폰 적용 -->
        <div class="form-group">
          <label>쿠폰 적용</label>
          <div class="coupon-select">
            <select v-model="selectedCoupon">
              <option value="">쿠폰을 선택해주세요</option>
              <option v-for="coupon in userCoupons" 
                      :key="coupon.id" 
                      :value="coupon">
                {{coupon.Coupon.coupon_name}} ({{coupon.Coupon.coupon_discount_rate*100}}% 할인)
              </option>
            </select>
          </div>
        </div>
        
        <!-- 적립금 적용 -->
        <div class="form-group">
          <label>적립금 적용</label>
          <div class="point-input">
            <div class="point-input-group">
                <input type="number" 
                       v-model="tempUsePoint" 
                       :max="user.savedMoney" 
                       min="0" 
                       placeholder="사용할 적립금을 입력해주세요">
                <button type="button"  class="btn-apply-point" @click="applyPoint">적립금 적용</button>
            </div>
            <span class="available-point">사용 가능한 적립금: {{user.savedMoney?.toLocaleString()}}원</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 배송지 정보 -->
    <div class="order-section">
      <h2 class="section-title">배송지 정보</h2>
      <div class="delivery-form">
        <div class="form-group">
          <label>우편번호</label>
          <div class="zipcode-input">
            <input type="text" :value="postcode" placeholder="우편번호" readonly required>
            <button ref="addressSearch" type="button" class="btn-search" @click="execDaumPostcode">주소 검색</button>
            <button type="button" class="btn-search" @click="useUserAddress">사용자 주소 사용</button>
          </div>
        </div>
        <div class="form-group">
          <label>배송 주소</label>
          <input type="text" :value="roadAddress" placeholder="기본주소" readonly required>
        </div>
        <div class="form-group">
          <label>상세 주소</label>
          <input type="text" v-model="addressDetail" placeholder="상세주소" required>
        </div>
        <div class="form-group">
          <label>배송메세지</label>
          <input type="text" v-model="orderMessage" placeholder="배송메세지">
        </div>
      </div>
    </div>

    <!-- 결제 정보 -->
    <div class="order-section">
      <h2 class="section-title">결제 정보</h2>
      <div class="payment-summary">
        <div class="summary-row">
          <span>상품 금액</span>
          <span class="price">{{originalTotalPrice.toLocaleString()}}원</span>
        </div>
        <!-- 쿠폰 할인 표시 -->
        <div class="summary-row discount" v-if="selectedCoupon">
          <span>쿠폰 할인</span>
          <span class="price discount-price">
            -{{(originalTotalPrice * selectedCoupon.Coupon.coupon_discount_rate).toLocaleString()}}원
          </span>
        </div>
        <!-- 적립금 사용 표시 -->
        <div class="summary-row discount" v-if="usePoint > 0">
          <span>적립금 사용</span>
          <span class="price discount-price">-{{usePoint.toLocaleString()}}원</span>
        </div>
        <div class="summary-row">
          <span>배송비</span>
          <span class="price">{{deliveryFee.toLocaleString()}}원</span>
        </div>
        <div class="summary-row total">
          <span>최종 결제 금액</span>
          <span class="price">{{totalPaymentAmount.toLocaleString()}}원</span>
        </div>
      </div>
    </div>

    <!-- 이용약관 -->
    <div class="order-section">
      <h2 class="section-title">이용약관</h2>
      <div class="contract-form">
        <div class="terms-content">
          주류 구매를 위한 본인인증이 필요합니다. 본인인증을 진행하는 과정에서 인증 명의 도용과 관련된 모든 법적인 책임은 인증을 진행한 당사자에게 있습니다.
        </div>
        <div class="verification-section">
          <button type="button" ref="verifyIdentityRef"
                  class="btn-verify" 
                  @click="checkIdentify"
                  :class="{ verified: isVerified }">
            {{ isVerified ? '인증완료' : '본인인증' }}
          </button>
        </div>
        <div class="terms-checkbox">
          <input type="checkbox" 
                 v-model="contractformcheck" 
                 :disabled="!isVerified"
                 required>
          <label>이용약관에 동의합니다.</label>
        </div>
      </div>
    </div>

    <div class="order-button">
      <button type="submit" class="btn-order">결제하기</button>      
    </div>
  </form>
</div>
</template>

<script>
import axios from 'axios';

export default{ 
    name:'',
    components:{},
    computed:{
      fulladdress() {
        return `${this.roadAddress}/${this.addressDetail}`;
      },
      fullProductName(){
        return this.productInfo.map(product => product.Product.product_name).join(', ');
      }
    },
    directives:{
        zipcode:{//우편번호 입력 제한
            mounted(el) {
                el.addEventListener('input', () => {
                    // 우편번호 형식: 5자리 숫자
                    const zipcodePattern = /^\d{5}$/;
                    // 숫자만 남기고 제거
                    el.value = el.value.replace(/[^0-9]/g, '').slice(0, 5);
                    
                    if (!zipcodePattern.test(el.value)) {
                        el.setCustomValidity('우편번호는 5자리 숫자여야 합니다.');
                    } else {
                        el.setCustomValidity('');
                    }
                });
            }
        }
    },
    data(){
        return{
            address:'',
            addressDetail:'',
            zipCode:'',
            productInfo :[],

            finalTotalPrice: 0,
            deliveryFee : 10,
            user:{},
            userCoupons:[],
            selectedCoupon:null,
            tempUsePoint: 0,
            usePoint: 0,

            originalTotalPrice: 0,
            totalPaymentAmount: 0,
            postcode:null,
            roadAddress:'',
            contractformcheck:false,
            orderMessage : "",
            isVerified:false,
        };
    },
    setup(){},
    created(){
      this.getUser();
      this.getCoupons();
    },
    mounted(){
        // 쿼리 선별 코드
        // 들어오는 쿼리에 따라 다른 파라메터를 넣어 같은 함수를 실행시키는 코드

        if(this.$route.query.productInfoQuery){
            this.getProductInfo('productInfoQuery');
            
        // orderingInfoQuary가 있으면, 문자열 'orderingInfoQuary'를 넣어서 함수 실행
        }else if (this.$route.query.orderingInfoQuary){
            this.getProductInfo('orderingInfoQuary');
        }else {
            console.error("주문할 제품 정보(쿼리)를 받지 못합니다.")
        }
        

        

    },
    unmounted(){},
    methods:{

        //총액 계산 함수
        total_products(){
            this.numberOfProducts= this.productInfo.length
        },
        productTotalPrice(){
            this.finalTotalPrice = this.productInfo.reduce((acc, info) => acc + info.Product.product_price * info.count, 0 )
        },
        calculateTotal(){
            // 총 상품 개수 계산
            this.total_products();
            
            // 원래 총액 계산 (모든 상품의 가격 * 수량의 합)
            this.originalTotalPrice = this.productInfo.reduce((acc, info) => 
                acc + (info.Product.product_price * info.count), 0);
            
            // 최종 가격을 원래 총액으로 초기화
            this.finalTotalPrice = this.originalTotalPrice;
            
            // 쿠폰 할인 적용
            if (this.selectedCoupon) {
                const discountAmount = this.originalTotalPrice * this.selectedCoupon.Coupon.coupon_discount_rate;
                this.finalTotalPrice -= discountAmount;
            }
            
            // 적립금 사용 적용
            if (this.usePoint) {
                this.finalTotalPrice -= Number(this.usePoint);
            }

            // 최종 결제 금액 (배송비 포함)
            this.totalPaymentAmount = this.finalTotalPrice + this.deliveryFee;
        },
        // MAKE Ordering Product List 
        async getProductInfo(query){
            try{
                if(query === 'productInfoQuery'){
                    this.productInfo = JSON.parse(this.$route.query.productInfoQuery);
                    //console.log(`############################${JSON.stringify(this.productInfo)}`)
                }else if(query === 'orderingInfoQuary') {
                    const InfoFromProductView = this.$route.query.orderingInfoQuary;
                    const response = await axios.get(`import.meta.env.VUE_APP_API_BASE_URL/orders/ordering/${InfoFromProductView}`);
                    this.productInfo = [response.data];
                    console.log(`############################ProductView${JSON.stringify(this.productInfo)}`)
                    //{"id":23,"count":1,
                    //"Product":{"id":23,"product_name":"카듀 12년","product_price":109000,"product_description":"비번과 셰리를 담았던 통에서 숙성된 달콤하고 매운 맛의 위스키, 토피, 바닐라, 계피 향이 어우러져 부드러운 맛을 냅니다.","product_description_img":null,"product_stock":15,"product_image":"https://dailyshot.co/m/_next/image?url=https%3A%2F%2Fd1e2y5wc27crnp.cloudfront.net%2Fmedia%2Fcore%2Fproduct%2Fthumbnail%2F6c06d723-d199-41ef-bdbd-9d0b8c69a809.webp&w=640&q=85","drink_type":"whisky","product_kind":"drink","created_at":"2025-01-10T17:09:42.000Z","updated_at":"2025-01-10T17:09:42.000Z","product_location_id":null,"supply_factory_id":null}}
                    
                }
                console.log("this.productInfo",this.productInfo);
                //총액 계산
                this.calculateTotal()
            }catch(err){
                console.error(err);
            }
        },
        // Order CREATING
        async order(rsp){
          try {
            const orderInfos = this.productInfo.map(product => ({
              count : product.count,
              account_id : this.user.id,
              product_id : product.Product.id,
              payment_id : rsp.imp_uid,
              address : this.roadAddress,              
              addressDetail : this.addressDetail,
              addressNumber : this.postcode,
              orderMessage : this.orderMessage,
              cart_id : product.cart_id,
            }));
            const response = await axios.post(`import.meta.env.VUE_APP_API_BASE_URL/orders/order`, {
              orderInfos,
              hasCouponId : this.selectedCoupon,
              usePoint : this.usePoint,
              totalPaymentAmount : this.totalPaymentAmount,
              }, {withCredentials:true}
            );
            if(response.status === 200 || response.status === 201){
              alert(response.data.message);
              this.$router.push(`/order/${this.user.id}`);
            }else{
              alert("결제 실패!");
            }
            
          }catch(err){
            console.error(err);
          }
        },
        KGpay() {
          console.log("KGpay 호출");
          if (!this.postcode || !this.roadAddress || !this.addressDetail) {
            alert("주소를 입력해주세요.");
            this.$nextTick(() => {
                this.$refs.addressSearch.focus();
            });
            return;
          }

          if (!this.contractformcheck) {
            alert("본인인증 후 이용약관에 동의해주세요");
            this.$nextTick(() => {
                this.$refs.verifyIdentityRef.focus();
            });
            return;
          }

          // 아임포트 초기화
          IMP.init("imp00267421"); // 식별코드 변경
          IMP.request_pay(
            {
              //필수
              pg: "html5_inicis", // KG이니시스
              pay_method: "card", //결제 수단 (짜피 사용자가 고르는 수단이 적용됨)
              merchant_uid: `${this.user.email}_${new Date().getTime()}`,//주문번호(고유값)
              name: this.fullProductName,//제품명
              amount: this.totalPaymentAmount,//가격
              //선택
              buyer_email: this.user.email,
              buyer_name: this.user.email,
              buyer_addr: this.fulladdress,
              buyer_postcode: this.postcode,
              custom_data: { message: this.orderMessage },//pg사에서 만들어놓지 않은 파라미터를 전달하는 경우 custom_data에 넣어서 보내면 됨.
            },
            (rsp) => {
              console.log("결제 응답:", rsp); // 디버깅용 출력
              if (rsp.success) {
                // 결제 성공 시 서버로 데이터 전송
                this.order(rsp);
              } else {
                alert("결제 실패!");
              }
            }
          );
        },


        
        //유저도 가져와야 해
        async getUser(){
            try{
              const response = await axios.get('import.meta.env.VUE_APP_API_BASE_URL/profile',{withCredentials:true});
              this.user = response.data;
            }catch(err){
              console.error(err);
            }
        },
        //쿠폰 가져와야 해
        async getCoupons(){
            try{
                const response = await axios.get('import.meta.env.VUE_APP_API_BASE_URL/profile/coupons',{withCredentials:true});
                this.userCoupons = response.data;
            }catch(err){
                console.error(err);
            }
        },
        applyPoint() {
            if (this.tempUsePoint > this.user.savedMoney) {
                alert('보유한 적립금을 초과할 수 없습니다.');
                this.tempUsePoint = this.user.savedMoney;
                return;
            }
            if (this.tempUsePoint > this.finalTotalPrice) {
                alert('상품 금액을 초과하여 사용할 수 없습니다.');
                this.tempUsePoint = this.finalTotalPrice;
                return;
            }
            if(this.tempUsePoint === 0){
                return;
            }
            
            this.usePoint = Number(this.tempUsePoint);
            alert("적립금 적용 완료. 적용된 적립금 : "+this.usePoint+"원");
            this.calculateTotal();
        },
        useUserAddress(){
            if(!this.user.addressNumber || !this.user.address || !this.user.addressDetail){
                alert('사용자 주소가 없습니다.(사용자 정보 수정을 통해 주소를 입력해주세요)');
                this.$nextTick(() => {
                    this.$refs.addressSearch.focus();
                });
                return;
            }
            this.postcode = this.user.addressNumber;
            this.roadAddress = this.user.address;
            this.addressDetail = this.user.addressDetail;
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
              this.postcode = data.zonecode; // 우편번호
              this.roadAddress = roadAddr; // 도로명 주소

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
                    console.log('서버로 인증 데이터 전송 성공:', response.data);
                    alert('인증이 성공적으로 완료되었습니다.' , response.data);
                    
                    
                    if(!response.data.data.adult){
                        alert('성인이 아닙니다. 미성년자는 주문이 불가합니다.');
                        this.$router.push('/');
                        return;
                    }
                    else{
                      this.isVerified = response.data.data.adult;
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
    watch: {
        selectedCoupon: {
            handler() {
                this.calculateTotal();
            }
        }
    }
}
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  width: 100%;
  background-color: #f8f9fa;
}

.content-wrapper {
  width: 80%;
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 20px;
}

.order-header {
  text-align: center;
  margin-bottom: 3rem;
}

.order-header h1 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
}

.order-steps {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.step {
  color: #999;
  font-weight: 500;
}

.step.completed {
  color: #28a745;
}

.step.active {
  color: #007bff;
  font-weight: 700;
}

.step-arrow {
  color: #999;
}

.order-section {
  background: white;
  border-radius: 10px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f1f1f1;
}

/* 상품 테이블 스타일 */
.product-table {
  overflow-x: auto; /* 작은 화면에서 가로 스크롤 허용 */
  width: 100%;
}

.product-table table {
  width: 100%;
  border-collapse: collapse;
  min-width: 600px; /* 작은 화면에서 테이블 최소 너비 설정 */
}

.product-table th {
  background: #f8f9fa;
  padding: 1rem;
  text-align: center;
}

.product-table td {
  padding: 1rem;
  text-align: center;
  vertical-align: middle;
  border-bottom: 1px solid #f1f1f1;
  white-space: nowrap; /* 텍스트 줄바꿈 방지 */
  word-break: keep-all; /* 단어가 잘리지 않도록 설정 */
}

.product-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.product-info img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

.product-info .product-name {
  text-align: left;
  font-size: 1rem;
  word-break: break-word; /* 긴 텍스트 줄바꿈 */
}

/* 배송지 폼 스타일 */
.delivery-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
}

.form-group input {
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.zipcode-input {
  display: flex;
  flex-wrap: wrap; /* 작은 화면에서 줄바꿈 허용 */
  gap: 0.5rem;
}

.zipcode-input input {
  flex: 1;
  min-width: 150px;
}

.zipcode-input button {
  flex: 1;
  min-width: 150px;
  text-align: center;
  white-space: nowrap;
  padding: 0.8rem;
  background: #F3EFE0;
  color: #4A4A4A;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.zipcode-input button:hover {
  background: #E5DCC3;
}

/* 결제 정보 스타일 */
.payment-summary {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 8px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.summary-row.discount {
  color: #666;
  font-size: 0.95rem;
}

.discount-price {
  color: #2b8a3e; /* 할인 금액은 초록색으로 표시 */
}

.summary-row.total {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 2px solid #ddd;
  font-size: 1.2rem;
  font-weight: 700;
}

.price {
  font-weight: 600;
  color: #dc3545;
}

/* 주문 버튼 스타일 */
.order-button {
  text-align: center;
  margin-top: 3rem;
}

.btn-order {
  padding: 1rem 4rem;
  font-size: 1.2rem;
  background: #F3EFE0;
  color: #4A4A4A;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;
}

.btn-order:hover {
  background: #E5DCC3;
  transform: scale(1.05);
}

/* 할인 적용 스타일 */
.discount-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.coupon-select select {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
}

.point-input {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.point-input input {
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.available-point {
  color: #6c757d;
  font-size: 0.9rem;
}

.point-input-group {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.point-input-group input {
  width: 200px;
  height: 40px;
}

.btn-apply-point {
  padding: 0.5rem 1rem;
  height: 40px;
  background: #F3EFE0;
  color: #4A4A4A;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.btn-apply-point:hover {
  background: #E5DCC3;
}

/* 반응형 설계 */
/* 화면 너비가 768px 이하일 때 */
@media (max-width: 768px) {
  .zipcode-input {
    flex-direction: column; /* 버튼이 세로로 배치 */
  }

  .product-info {
    flex-direction: column; /* 이미지와 텍스트를 세로로 정렬 */
    align-items: center;
  }

  .product-info img {
    width: 60px; /* 이미지 크기 축소 */
    height: 60px;
  }

  .product-info .product-name {
    font-size: 0.85rem;
    text-align: center;
  }

  .product-table th,
  .product-table td {
    font-size: 0.85rem; /* 텍스트 크기 축소 */
  }

  .btn-order {
    padding: 0.6rem 2rem;
    font-size: 0.9rem;
  }
}

/* 화면 너비가 480px 이하일 때 */
@media (max-width: 480px) {
  .product-table table {
    min-width: 400px; /* 최소 너비 축소 */
  }

  .btn-order {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }

  .content-wrapper {
    width: 95%;
    padding: 0 10px;
  }
}

.terms-content {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.95rem;
  line-height: 1.5;
}

.verification-section {
  margin: 1rem 0;
  text-align: center;
}

.btn-verify {
  padding: 0.8rem 2rem;
  background: #F3EFE0;
  color: #4A4A4A;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-verify:hover {
  background: #E5DCC3;
}

.btn-verify.verified {
  background: #28a745;
  color: white;
  cursor: default;
}

.terms-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.terms-checkbox input[type="checkbox"]:disabled + label {
  color: #999;
}

</style>