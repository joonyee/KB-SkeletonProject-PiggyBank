<template>
  <div class="dashboard">
    <Header />
    <SummaryCards />
    <MonthlyPatternChart />
    <router-link to="/" class="home-button">홈으로 이동</router-link>
  </div>
</template>

<script setup>
import Header from "@/components/Header.vue";
import SummaryCards from "@/components/TendencyCount.vue";
import MonthlyPatternChart from "@/components/MonthlyTendencyChart.vue";
</script>

<style scoped>
.home-button {
  display: block;
  text-align: center;
  padding: 1rem;
  background: #ffc7ef;
  border-radius: 10px;
  font-weight: bold;
  margin-top: 2rem;
  text-decoration: none;
  color: black;
}
</style>
