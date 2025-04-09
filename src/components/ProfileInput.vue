<script setup>
import { ref, computed, onMounted } from 'vue';

// input 태그 내 초기값
const form = ref({
  password: 'abcd',
  confirmPassword: 'abcd',
  phone: '010-1234-1234',
  email: 'example@gmail.com',
  alarm: true,
});

const initialForm = ref({});

// 비밀번호 보기/숨기기
const showPassword = ref(false);
const showConfirmPassword = ref(false);

// 비밀번호 일치 확인
const passwordMatchMessage = computed(() => {
  if (!form.value.password || !form.value.confirmPassword) {
    return '비밀번호를 입력해 주세요';
  }
  return form.value.password === form.value.confirmPassword
    ? '비밀번호가 일치합니다.'
    : '비밀번호가 일치하지 않습니다.';
});

const isPasswordMatch = computed(
  () => form.value.password === form.value.confirmPassword
);

onMounted(() => {
  initialForm.value = { ...form.value };
});

// 초기화 버튼 클릭 이벤트
const initInfo = () => {
  alert('초기화');
  form.value = { ...initialForm.value };
};

// 수정 버튼 클릭 이벤트
const modifyInfo = () => {
  alert('정보를 수정하시겠습니까?');
};

// 비밀번호 보기/숨기기
const toggleShowPassword = (field) => {
  if (field === 'password') {
    showPassword.value = !showPassword.value;
  } else {
    showConfirmPassword.value = !showConfirmPassword.value;
  }
};

// input 요소 수정 사항 있는지 체크
const isFormChanged = computed(() => {
  return Object.keys(form.value).some(
    (key) => form.value[key] !== initialForm.value[key]
  );
});

// 알람 버튼 on/off
const toggleAlarm = () => {
  form.value.alarm = !form.value.alarm;
};
</script>

<template>
  <h3>정보 변경</h3>
  <hr />
  <div class="wrapper">
    <label class="label-wrapper">비밀번호</label>
    <div class="input-with-icon">
      <input
        :type="showPassword ? 'text' : 'password'"
        v-model="form.password"
        class="input-wrapper"
      />
      <button type="button" @click="toggleShowPassword('password')">
        {{ showPassword ? '숨기기' : '보기' }}
      </button>
    </div>

    <label class="label-wrapper">비밀번호 확인</label>
    <div class="input-with-icon">
      <input
        :type="showConfirmPassword ? 'text' : 'password'"
        v-model="form.confirmPassword"
        class="input-wrapper"
      />
      <button type="button" @click="toggleShowPassword('confirmPassword')">
        {{ showConfirmPassword ? '숨기기' : '보기' }}
      </button>
    </div>

    <label
      class="password-check-message"
      :class="{
        'error-text': !isPasswordMatch,
        'success-text': isPasswordMatch,
      }"
    >
      {{ passwordMatchMessage }}
    </label>

    <label class="label-wrapper">휴대전화</label>
    <input v-model="form.phone" type="text" class="input-wrapper" />

    <label class="label-wrapper">이메일</label>
    <input v-model="form.email" type="text" class="input-wrapper" />

    <div class="alarm-box">
      <div class="alarm-text-wrapper">
        <label class="alarm-label">알림 설정🔔</label>
        <label class="sub-alarm-label">푸시 알림을 설정합니다</label>
      </div>
      <button
        class="alarm-button"
        :class="{ off: !form.alarm }"
        @click="toggleAlarm"
      >
        {{ form.alarm ? 'ON' : 'OFF' }}
      </button>
    </div>

    <div class="button-box">
      <button class="init-button" @click="initInfo" :disabled="!isFormChanged">
        초기화
      </button>
      <button
        class="modify-button"
        @click="modifyInfo"
        :disabled="!isFormChanged"
      >
        수정
      </button>
    </div>
  </div>
</template>

<style scoped>
.label-wrapper {
  display: block;
  margin: 20px 0 2.5px 0;
}
.input-wrapper {
  width: 90%;
  height: 35px;
  padding-left: 10px;
  border: 1px solid #716a6c;
  border-radius: 10px;
}

/* 비밀번호 input (비밀번호 보기) */
.input-with-icon {
  position: relative;
  width: 100%;
}

/* 비밀번호 보기/숨기기 버튼 */
.input-with-icon button {
  position: absolute;
  right: 50px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: grey;
  z-index: 1;
}
.success-text,
.error-text {
  display: block;
  margin-top: 10px;
  font-size: 15px;
}
/* 비밀번호 비교 (일치 -> grey) (불일치 -> red) */
.error-text {
  color: red;
}
.success-text {
  color: grey;
}

/* 알람 label 및 on/off 버튼 */
.alarm-box {
  margin-top: 20px;
  display: flex;
  flex-direction: row;
}

.alarm-text-wrapper {
  display: flex;
  flex-direction: column;
  width: 79%;
}

.alarm-label {
  font-size: 16px;
  font-weight: bold;
}

.sub-alarm-label {
  margin: 5px 0;
  font-size: 13px;
  color: gray;
}

.alarm-button {
  background-color: #ffe4e6;
  border: none;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
  height: 40px;
  width: 60px;
  transition: background-color 0.3s ease;
}
.alarm-button.off {
  background-color: #d3d3d3;
}

/* 수정, 초기화 버튼 */
.modify-button,
.init-button {
  width: 45.5%;
  height: 40px;
  margin-top: 20px;
  font-weight: bold;
  border-style: none;
  border-radius: 10px;
  cursor: pointer;
}

.modify-button {
  margin-left: 5px;
  background-color: #ffe4e6;
}
</style>
