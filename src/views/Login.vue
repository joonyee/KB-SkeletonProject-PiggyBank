<template>
  <div class="login-wrapper">
    <Piggyface :eyeOffset="eyeOffset" />
    <div class="login-container">

      <div class="login-box">
        <h2 class="title">로그인</h2>
        <form @submit.prevent="handleLogin">
          <label>아이디</label>
          <input type="email" placeholder="example@email.com" v-model="email" @input="handleEmailInput"/>

          <label>비밀번호</label>
          <input type="password" placeholder="비밀번호를 입력해주세요" v-model="password" />

          <button type="submit" class="login-btn">로그인</button>
        </form>
        <p class="signup-text">
          아직 회원이 아니신가요?
          <router-link to="/signup" class="signup-link">회원가입</router-link>
        </p>
      </div>
    </div>
  </div>

</template>

<script setup>
import { ref} from 'vue'
import Piggyface from "@/components/Piggyface.vue";


const eyeOffset = ref({ x: 0, y: 0 })
const email = ref('')
const password = ref('')

const handleLogin = () => {
  console.log('로그인 시도:', email.value, password.value)
  // 여기에 이제 로그인 로직을 만들면 될 것 같아요.
}
//눈이 이메일을 입력하면 입력하는 이메일을 따라갑니다.
const handleEmailInput = (e) => {
  email.value = e.target.value

  const length = email.value.length
  const maxX = 6      // 눈이 이동하는 총 범위 (절대값)
  const maxChars = 20 // 최대 기준 문자 수

  // 입력 길이에 따라 이동
  const offsetX = -3 + Math.min(length, maxChars) / maxChars * maxX
  const offsetY = 3   // 살짝 아래로 고정

  eyeOffset.value = {
    x: offsetX,
    y: offsetY
  }
}
</script>

<style scoped>

.login-wrapper {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
}

.login-box {
  background-color: white;
  border: 2px solid #a6d1f2;
  border-radius: 10px;
  padding: 40px;
  width: 350px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  margin-bottom: 30px;
  font-size: 24px;
  font-weight: bold;
  color: #181818;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #181818;
}

input {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
}

.login-btn {
  width: 100%;
  padding: 12px;
  background-color: #ffb6dc;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
  font-weight: bold;
}

.login-btn:hover {
  background-color: #f59fc8;
}

.signup-text {
  margin-top: 15px;
  text-align: center;
  font-size: 14px;
  color: #181818;
}

.signup-link {
  color: #ff6aa6;
  text-decoration: none;
  font-weight: bold;
  margin-left: 5px;
}

.signup-link:hover {
  text-decoration: underline;
}
</style>
