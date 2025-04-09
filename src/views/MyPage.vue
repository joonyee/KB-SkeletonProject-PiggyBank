<script setup>
import { ref, computed, onMounted } from 'vue';
import Profile from '@/components/Profile.vue';
import ProfileInput from '@/components/ProfileInput.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const goToHome = () => {
  router.push('./home');
};
</script>

<template>
  <header class="dashboardHeader">
    <h1 class="dashboardTitle">
      <img
        src="/src/assets/icons/logo.png"
        class="iconImage"
        @click="goToHome"
      />Piggy Bank Piggy Bank
    </h1>
    <div class="flex items-center gap-2 relative">
      <button @click="toggleDarkMode" class="darkModeButton">
        {{ isDarkMode ? '☀️' : '🌙' }}
      </button>
      <button class="mypageButton" @click="mypageClick">마이페이지</button>
      <button class="inputValue" @click="inputClick">새 거래추가</button>
      <button class="logout" @click="logout">로그아웃</button>
    </div>
  </header>
  <div class="background">
    <div class="container">
      <h2 class="page-title">마이페이지</h2>
      <div class="wrapper">
        <div class="left-box">
          <Profile />
        </div>
        <div class="right-box">
          <ProfileInput />
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.iconImage {
  width: 60px;
  height: 60px;
  /* object-fit: contain; */
}
.background {
  background-color: #ffe4e6;
  min-height: 100vh;
}

.container {
  width: 90%;
  max-width: 1000px;
  margin: 0 auto;
  padding-top: 2rem;
}

.page-title {
  margin-bottom: 1rem;
  font-weight: bold;
  font-size: 1.8em;
}

.wrapper {
  background-color: white;
  display: flex;
  gap: 1rem;
  padding: 2rem;
  border-radius: 8px;
}

.left-box,
.right-box {
  width: 50%;
}
.bottom-box {
  width: 50%;
  background-color: #ffe4e6;
}
@media screen and (max-width: 830px) {
  .wrapper {
    flex-direction: column; /* 가로 → 세로로 변경 */
    padding: 1.5rem;
    min-width: 500px;
  }
  .left-box,
  .right-box {
    width: 100%; /* 전체 너비로 확장 */
  }
}
.dark .dashboard {
  background: linear-gradient(to bottom right, #1f2937, #111827);
  color: black;
}
.dark .dashboardHeader {
  background-color: #ae7695;
}
.dashboardHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f9a8d4;
  padding: 1rem;
  border-radius: 1rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
