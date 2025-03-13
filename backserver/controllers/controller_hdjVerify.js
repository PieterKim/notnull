const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

exports.hdjVerify = async (req,res,next)=>{
        const { imp_uid } = req.body; // 클라이언트에서 imp_uid 전달
      
        if (!imp_uid) {
          return res.status(400).json({ message: 'imp_uid가 필요합니다.' });
        }
      
        try {
          // 1. 아임포트 액세스 토큰 발급
          const tokenResponse = await axios.post('https://api.iamport.kr/users/getToken', {
            imp_key: process.env.IMP_KEY,
            imp_secret: process.env.IMP_SECRET,
          });
      
          const { access_token } = tokenResponse.data.response;
          console.log(access_token)
      
          // 2. 인증 정보 조회
          const certificationResponse = await axios.get(
            `https://api.iamport.kr/certifications/${imp_uid}`,
            {
              headers: { Authorization: access_token },
            }
          );
      
          const certificationsInfo = certificationResponse.data.response;
      
          if (!certificationsInfo) {
            return res.status(404).json({ message: '인증 정보를 찾을 수 없습니다.' });
          }
      
          // 3. 고객 정보 추출
          const { name, gender, birth, unique_key, phone } = certificationsInfo;
      
          // 4. 연령 제한 로직
          const birthDate = new Date(birth * 1000); // UNIX 타임스탬프 변환
          const birthYear = birthDate.getFullYear();
          const currentYear = new Date().getFullYear();
          const age = currentYear - birthYear;
      
          if (age >= 20) {
            // 연령 만족
            console.log('인증 성공 및 연령 제한 통과:', {
              name,
              gender,
              birth: birthDate.toLocaleDateString(),
              unique_key,
              phone,
              age,
            });
            res.status(200).json({
              message: '인증 성공 및 연령 제한 통과',
              data: { name, gender, birth: birthDate.toLocaleDateString(), unique_key, phone, age, adult: true },
            });
          } else {
            // 연령 미달
            console.log('연령 제한 미달:', { name, age });
            res.status(200).json({
              message: '연령 제한 미달',
              data: { name,birth:birthDate.toLocaleDateString(), phone,age, adult: false },
            });
          }
        } catch (error) {
          console.error('인증 처리 중 오류:', error.response?.data || error.message);
      
          res.status(500).json({
            message: '서버 오류로 인증 처리 실패',
            error: error.response?.data || error.message,
          });
        }
};