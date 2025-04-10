<template>
  <div class="dashboard">
    <!-- <Header /> -->
    <SummaryCards />
    <MonthlyPatternChart />
    <router-link to="/Home" class="home-button">홈으로 이동</router-link>
  </div>
</template>

<script setup>
import Header from "@/components/Header.vue";
import SummaryCards from "@/components/TendencyCount.vue";
import MonthlyPatternChart from "@/components/MonthlyTendencyChart.vue";
</script>

<style scoped>
.dashboard {
  background-color: #fff9fe;
  min-height: 100vh;
  padding: 1rem;
}

.home-button {
  display: block;
  text-align: center;
  padding: 1rem;
  background: #ffc7ef;
  border-radius: 10px;
  font-weight: bold;
  margin: 2rem auto 1rem auto;
  max-width: 1300px;
  text-decoration: none;
  color: black;
}
</style>
