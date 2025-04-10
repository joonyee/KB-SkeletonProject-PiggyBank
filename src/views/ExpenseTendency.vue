<template>
  <div :class="['dashboard', { dark: isDarkMode }]">
    <!-- Header Section -->
    <div class="dashboardHeader">
      <div class="flex dashboardTitle">
        <img src="@/assets/icons/logo.png" alt="로고" class="iconImage" />
        <h1>Piggy Bank</h1>
      </div>
      <div class="flex">
        <button class="darkModeButton" @click="toggleDarkMode">
          {{ isDarkMode ? "☀️" : "🌙" }}
        </button>
        <button class="mypageButton" @click="goToMypage">마이페이지</button>
        <button class="logout" @click="logout">로그아웃</button>
      </div>
    </div>

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

//#2e2e4d

// ✅ 다크모드 상태 (localStorage 적용)
const isDarkMode = ref(false);

onMounted(() => {
  const savedMode = localStorage.getItem("darkMode");
  if (savedMode === "true") {
    isDarkMode.value = true;
  }
});

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  localStorage.setItem("darkMode", isDarkMode.value.toString());
};

// 마이페이지 이동
const goToMypage = () => {
  router.push("/mypage");
};

// 로그아웃
const logout = () => {
  alert("안녕히가세요!");
  router.push("/");
};
</script>

<style scoped>
.dashboard {
  background-color: #fff9fe;
  color: #000;
  min-height: 100vh;
  padding: 1rem;
  transition: all 0.3s ease;
}

.dashboard.dark {
  background-color: #121212;
  color: #fff;
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
