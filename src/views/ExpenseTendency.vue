<template>
  <div class="dashboard">
    <!-- Header Section -->
    <header class="dashboardHeader">
      <h1 class="dashboardTitle">
        <img
          src="/src/assets/icons/logo.png"
          class="iconImage"
          @click="goToHome"
        />Piggy Bank
      </h1>
      <div class="flex items-center gap-2 relative">
        <button @click="toggleDarkMode" class="darkModeButton">
          {{ isDarkMode ? "☀️" : "🌙" }}
        </button>
        <button class="mypageButton" @click="mypageClick">마이페이지</button>
        <button class="logout" @click="logout">로그아웃</button>
      </div>
    </header>

    <!-- Main Content -->
    <SummaryCards />
    <MonthlyPatternChart />
    <router-link to="/Home" class="home-button">홈으로 이동</router-link>
  </div>
</template>

<script setup>
import SummaryCards from "@/components/TendencyCount.vue";
import MonthlyPatternChart from "@/components/MonthlyTendencyChart.vue";
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";

const router = useRouter();
const isDarkMode = ref(false); // 다크모드 상태

// 다크모드 상태 (localStorage 적용)
onMounted(() => {
  const savedMode = localStorage.getItem("darkMode");
  if (savedMode === "true") {
    isDarkMode.value = true;
  }
});

const mypageClick = () => {
  router.push("/myPage");
};
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  document.documentElement.classList.toggle("dark", isDarkMode.value);
};
const goToHome = () => {
  router.push("/home");
};
const logout = () => {
  alert("안녕히가세요!");

  localStorage.removeItem("loggedInUserId");
  localStorage.removeItem("loggedInUserInfo");

  router.push("/");
};
</script>

<style scoped>
.dark .dashboard {
  background: linear-gradient(to bottom, #121212, #121212);
  color: #1a1a2e;
}
.dashboard {
  background-color: #fff9fe;
  color: #000;
  min-height: 100vh;
  padding: 1rem;
  transition: all 0.3s ease;
}

/* 헤더 스타일 */
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

.iconImage {
  width: 60px;
  height: 60px;
}

.dashboardTitle {
  gap: 10px;
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
}

.mypageButton,
.inputValue,
.logout {
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

/* 홈 버튼 */
.home-button {
  display: block;
  text-align: center;
  padding: 1rem;
  background: #fbcee8;
  border-radius: 10px;
  font-weight: bold;
  margin: 2rem auto 1rem auto;
  max-width: 1300px;
  text-decoration: none;
  color: black;
}
</style>
