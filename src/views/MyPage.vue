<script setup>
import { ref, computed, onMounted } from 'vue';
import Profile from '@/components/Profile.vue';
import ProfileInput from '@/components/ProfileInput.vue';
</script>

<template>
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
</style>
