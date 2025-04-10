<script setup>
import { ref } from 'vue';
import Piggyface from './Piggyface.vue';

const fileInput = ref(null);
const previewImage = ref(null);
const userInfo = JSON.parse(localStorage.getItem('loggedInUserInfo'));

// 프로필 사진 변경
const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};
</script>

<template>
  <div class="info-container">
    <div class="photo-box">
      <!-- <Piggyface /> -->
      <img v-if="previewImage" :src="previewImage" class="profile-image" />
      <button class="edit-button" @click="triggerFileInput">+</button>
      <input type="file" ref="fileInput" @change="handleFileChange" hidden />
    </div>

    <div class="userName">{{ userInfo.name }}님</div>

    <div class="info-item">
      <!-- <span class="label">ID</span> -->
      <span class="value">{{ userInfo.userId }}</span>
    </div>
  </div>
</template>

<style scoped>
* {
  text-align: center;
}
.left-box label {
  margin: 20px auto 0 auto;
}
.userName {
  font-size: 25px;
  font-weight: bold;
  margin: 30px 0 35px 0;
}
.nickname-wrapper {
  margin-top: 20px;
}

/* 프로필 사진 */
.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.photo-box {
  width: 200px;
  height: 200px;
  background-color: gainsboro;
  border-radius: 50%;
  margin: 0 auto;
  margin-top: 50px;
  position: relative;
  overflow: visible;
}

/* 사진 추가 및 변경 버튼 */
.edit-button {
  position: absolute;
  bottom: 0;
  right: 0;
  transform: translate(-20%, -20%);
  width: 40px;
  height: 40px;
  font-size: 24px;
  cursor: pointer;
  color: white;
  background-color: pink;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  border: none;
  border-radius: 50%;
}

/* 유저 정보 박스 */
.info-container {
  background: #ffffff;
  border-radius: 20px;
  padding: 20px 30px;
  max-width: 300px;
  margin: 30px auto;
  box-shadow: 8px 8px 16px #d1d1d1, -8px -8px 16px #ffffff;
}

.info-item {
  display: flex;
  justify-content: center;
  margin: 12px 0;
}

.label {
  font-weight: 600;
  color: #555;
  font-size: 16px;
}

.value {
  font-size: 16px;
  color: #888;
}
</style>
