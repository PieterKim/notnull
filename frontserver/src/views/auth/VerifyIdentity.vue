<template>
<div>
    <button @click="checkIdentify">인증하세요</button>
</div>
</template>


<script>
import axios from 'axios';

export default{ 
    name:'',
    components:{},
    data(){
        return{
            sampleData:''
        };
    },
    setup(){},
    created(){},
    mounted(){},
    unmounted(){},
    methods:{

        // 인증함수
        checkIdentify() {
            //포트원 초기화
            IMP.init('imp07771767'); // 프론트에서 .env 하려면 'VUE_APP_'  를 붙여줘야 한대


            // 사용자 인증 요청, 응답으로 'success'나 'error'를 보냄
            IMP.certification(
                {
                    pg : "html5_inicis", // 사용할 PG사
                    merchant_uid: `order_${new Date().getTime()}`, // 주문번호
                    m_redirect_url : `import.meta.env.VUE_APP_API_BASE_URL/`, // 리디렉션 URL (모바일 고려)
                    popup : true, // pc에서는 팝업이가능, 모바일에선 안됨. 그래서 redir 해줘야함
                },
                // callback, 인증성공데이터 (인증고유id와 주문번호 등이 돌아온다) 포함해 다음 함수 실행
                (rsp) => { 
                    if (rsp.success) {
                        console.log('인증성공', rsp);

                        ///인증성공시 사용자 정보를 불러와 나이를 확인하는 함수 실행
                        this.sendVerificationData(rsp);                       

                    } else {
                        console.error('인증실패', rsp.error_msg);
                        alert(`사용자 인증 실패 : ${rsp.error_msg}`);
                    }
                }
            )
        },

        //인증성공한 유저의 rsp(안에 imp_uid, merchant_uid 포함)를 받아, 포트원에 유저 data 요청하는 함수
        async sendVerificationData(rsp) {
            try{
                console.log('##############################sendVerificationData 실행시작');
                const response = await axios.post('import.meta.env.VUE_APP_API_BASE_URL/verify', {
                    imp_uid: rsp.imp_uid, // 인증 고유 id
                    merchant_uid : rsp.merchant_uid, //주문번호
                });
                if(response.status === 200) {
                    console.log('포트원에 인증데이터 전송 성공 :', response.data);
                    alert('인증 성공')
                } else {
                    console.error('서버 응답 오류:', response.status);
                    alert('서버오류로 인증 실패')
                }
            } catch (error) {
                console.error('인증데이터 전송 중 오류:', error);
                alert('네트워크 오류로 인증 데이터를 전송하지 못했습니다.');
            }
        },

    }
}

</script>