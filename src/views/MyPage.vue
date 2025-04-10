<script setup>
import { ref } from 'vue';
import Profile from '@/components/Profile.vue';
import ProfileInput from '@/components/ProfileInput.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const goToHome = () => {
  router.push('./home');
};

const isDarkMode = ref(false);

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  document.documentElement.classList.toggle('dark', isDarkMode.value);
};
</script>

<template>
  <div :class="['dashboard', { dark: isDarkMode }]">
    <header class="dashboardHeader">
      <h1 class="dashboardTitle">
        <img
          src="/src/assets/icons/logo.png"
          class="iconImage"
          @click="goToHome"
        />Piggy Bank
      </h1>
      <div class="flex items-center gap-4 relative">
        <button @click="toggleDarkMode" class="darkModeButton">
          {{ isDarkMode ? '☀️' : '🌙' }}
        </button>
        <button class="mypageButton" @click="mypageClick">마이페이지</button>
        <button class="inputValue" @click="openModal">새 거래추가</button>

        <TransactionModal
          :isOpen="isModalOpen"
          :date="selectedDate"
          @close="closeModal"
        />
        <button class="logout" @click="logout">로그아웃</button>
      </div>
    </header>

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
.dashboard {
  padding: 2rem;
  margin: 0;
  background: linear-gradient(to bottom, #fff9fe, #ffffff);
  font-family: sans-serif;
  box-sizing: border-box;
  color: black;
}

.dark .dashboard {
  background: linear-gradient(to bottom, #121212, #121212);
  color: #f3f3f3;
}

.dashboardHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fbcee8;
  padding: 1rem;
  border-radius: 1rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.dark .dashboardHeader {
  background-color: #fbcee8;
  color: black;
}

.left-box,
.right-box {
  width: 50%;
}

.bottom-box {
  width: 50%;
  background-color: #ffe4e6;
}

.dark .left-box {
  color: black;
}

.dark .left-box div {
  box-shadow: 8px 8px 16px #646485, -8px -8px 16px #61617d;
}

.iconImage {
  width: 60px;
  height: 60px;
}

.flex {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.darkModeButton {
  padding: 8px 12px;
  font-size: 1.2rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  cursor: pointer;
  align-self: center;
}

.mypageButton,
.logout,
.inputValue {
  background-color: rgb(254, 235, 253);
  border: 1px solid rgb(251, 209, 251);
  border-radius: 0.5rem;
  padding: 12px 24px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  font-weight: 600;
  color: #333;
}

.page-title {
  font-weight: bold;
  font-size: 1.8em;
}

.dark .page-title {
  color: #f3f3f3;
}

.container {
  width: 90%;
  max-width: 1100px;
  margin: 0 auto;
  padding-top: 2rem;
}

.wrapper {
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 1rem;
  padding: 2rem;
  border-radius: 8px;
}

.dark .wrapper {
  background-color: #2e2e4d;
  color: #f3f3f3;
}

@media screen and (max-width: 830px) {
  .wrapper {
    flex-direction: column;
    padding: 1.5rem;
    min-width: 500px;
  }

  .left-box,
  .right-box {
    width: 100%;
  }
}
</style>
