<template>
  <div>
    <footer class="liquor-footer">
      <div class="container">
        <div class="footer-content">
          <!-- 회사 정보 및 소셜 아이콘 -->
          <div class="footer-info">
            <p>&copy; 2024 Company, Inc. All Rights Reserved</p>
            <div class="social-icons">
              <a href="#" class="social-icon"><i class="fab fa-facebook-f"></i></a>
              <a href="#" class="social-icon"><i class="fab fa-instagram"></i></a>
              <a href="#" class="social-icon"><i class="fab fa-twitter"></i></a>            
            </div>
            <!-- 이름을 추가하는 부분 -->
            <div class="footer-names">
              <p>최동진, 신누리, 김인규, 황대준, 김우진, 김규태</p>
            </div>
          </div>

          <!-- 링크들 -->
          <ul class="footer-links">
            <li><a href="/">Home</a></li>
            <li><a href="liqueur">liqueur</a></li>
            <li><a href="#">Best Sellers</a></li>
            <li><a href="#">Shop by Category</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.liquor-footer {
  background-color: #1c1c1c; /* 어두운 회색/검정 배경 */
  color: #fff; /* 흰색 텍스트 */
  padding: 40px 0;
  font-family: 'Noto Serif KR', serif;
  width: 100%; /* 전체 너비 사용 */
  position: relative;
  bottom: 0;
  left: 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-content {
  display: flex;
  justify-content: space-between; /* 좌측, 우측 정렬 */
  align-items: center;
  flex-wrap: wrap; /* 작은 화면에서 내용이 자동으로 줄 바뀌게 함 */
}

.footer-info {
  text-align: left;
  margin-bottom: 10px;
}

.footer-info p {
  margin: 0;
  font-size: 14px;
  color: #bbb;
}

.social-icons {
  margin-top: 10px;
}

.social-icon {
  margin-right: 15px;
  text-decoration: none;
  font-size: 20px;
  color: #bbb;
  transition: color 0.3s;
}

.social-icon:hover {
  color: #f76c6c; /* 붉은색으로 호버 */
}

.footer-names {
  margin-top: 15px;
  font-size: 14px;
  color: #bbb;
}

.footer-names p {
  margin: 0;
}

.footer-links {
  list-style-type: none;
  padding-left: 0;
  margin: 0;
  display: flex;
  gap: 30px;
  justify-content: flex-end;
}

.footer-links li {
  margin: 0;
}

.footer-links a {
  text-decoration: none;
  color: #bbb;
  font-size: 14px;
  transition: color 0.3s;
}

.footer-links a:hover {
  color: #f76c6c; /* 붉은색으로 호버 */
}
</style>
