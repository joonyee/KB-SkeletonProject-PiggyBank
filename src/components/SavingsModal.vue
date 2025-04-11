<script setup>
import { ref, defineProps, defineEmits, watch, onMounted } from 'vue';

const props = defineProps({ show: Boolean });
const emit = defineEmits(['close', 'update']);

const monthlyIncome = ref(0);
const savingsRate = ref(20);
const expectedSavings = ref(0);

const closeModal = () => {
  emit('close');
};

const confirmSettings = async () => {
  const currentUser = JSON.parse(localStorage.getItem('loggedInUserInfo'));
  if (!currentUser || !currentUser.id) return;

  try {
    await fetch(`http://localhost:3000/user/${currentUser.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ goalSavings: savingsRate.value }),
    });

    const updatedUser = {
      ...currentUser,
      goalSavings: savingsRate.value,
    };
    localStorage.setItem('loggedInUserInfo', JSON.stringify(updatedUser));

    // ✅ 확인 후 update만 emit (닫기는 부모가 결정)
    emit('update', {
      savingsRate: savingsRate.value,
    });
  } catch (error) {
    console.error('저축률 업데이트 실패:', error);
  }
};

watch([monthlyIncome, savingsRate], () => {
  expectedSavings.value = Math.floor(
    (monthlyIncome.value * savingsRate.value) / 100
  );
});

onMounted(() => {
  const currentUser = JSON.parse(localStorage.getItem('loggedInUserInfo'));
  if (currentUser) {
    monthlyIncome.value = currentUser.monthlyIncome || 0;
    savingsRate.value = currentUser.goalSavings || 0;
  }
});
</script>

<template>
  <div v-if="show" class="modal-backdrop" @click="closeModal">
    <div class="modal-content" @click.stop>
      <h3 class="modal-title">목표 저축률 설정</h3>

      <!-- 슬라이더로 저축률 설정 -->
      <div class="slider-container">
        <label>목표 저축률 (%)</label>
        <div class="slider-wrapper">
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            v-model="savingsRate"
            class="slider"
          />
          <div class="slider-label">
            <span>{{ savingsRate }}%</span>
          </div>
        </div>
      </div>

      <!-- 모달 버튼 -->
      <div class="modal-buttons">
        <button class="confirm" @click="confirmSettings">확인</button>
        <button class="cancel" @click="closeModal">취소</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 30px 30px;
  border-radius: 16px;
  width: 350px;
  text-align: center;
}

.modal-title {
  font: var(--ng-bold-24);
  margin-bottom: 30px;
  color: var(--text-color);
}

.modal-input {
  margin: 20px 0;
}

input[type='number'] {
  width: 90%;
  padding: 10px;
  margin-top: 15px;
  border-radius: 8px;
  font: var(--ng-reg-16);
}

.slider-container {
  margin: 20px 0;
  text-align: center;
  color: black;
}

.slider-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
}

.slider {
  -webkit-appearance: none;
  width: 80%;
  height: 7px;
  background: var(--secondary-color);
  outline: none;
  border-radius: 10px;
  cursor: pointer;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  background: var(--primary-color);
  border-radius: 50%;
  cursor: pointer;
}

.slider-label {
  margin-left: 10px;
  font: var(--ng-bold-20);
  color: black;
}

.expected-savings {
  margin: 20px 0;
  color: var(--text-color);
}

.savings-amount {
  font: var(--ng-bold-28);
  color: var(--hot-pink);
}

.modal-buttons {
  margin-top: 20px;
  display: flex;
  gap: 15px;
  justify-content: center;
}
.confirm,
.cancel {
  background-color: var(--secondary-color);
  padding: 8px 20px;
  width: 80px;
  border-radius: 8px;
  color: var(--text-color);
  font: var(--ng-reg-14);
  border: none;
  outline: none;
  cursor: pointer;
}
</style>
