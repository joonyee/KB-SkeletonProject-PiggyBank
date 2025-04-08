<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal-content">
      <h2>금융 일정 관리</h2>
      <p class="description">
        정기적인 지출을 저장해두고, 효과적으로 관리해보세요!
      </p>

      <!-- 탭 메뉴 -->
      <div class="tabs">
        <button
          :class="{ active: activeTab === 'add' }"
          @click="activeTab = 'add'"
        >
          금융 일정 추가
        </button>
        <button
          :class="{ active: activeTab === 'edit' }"
          @click="activeTab = 'edit'"
        >
          금융 일정 수정
        </button>
      </div>

      <!-- 금융 일정 추가 -->
      <div v-if="activeTab === 'add'" class="tab-content">
        <div class="form-group">
          <label for="date-picker">날짜</label>
          <input
            id="date-picker"
            type="number"
            v-model="newExpense.day"
            placeholder="일자 입력 (예: 7)"
            class="date-input"
          />
        </div>
        <div class="form-group">
          <label>금액</label>
          <input
            type="number"
            v-model="newExpense.amount"
            placeholder="금액 입력"
            class="amount-input"
          />
        </div>

        <div class="form-group">
          <label>일정 이름</label>
          <input
            type="text"
            v-model="newExpense.description"
            placeholder="일정 이름 입력"
            class="description-input"
          />
        </div>
        <div class="form-group">
          <label class="inline-label">
            <input type="checkbox" v-model="newExpense.notify" />
            일정 하루 전날 알림을 받으실 수 있습니다.
          </label>
        </div>
        <button class="submit-button" @click="addFixedExpense">
          금융 일정 추가하기
        </button>
      </div>

      <!-- 금융 일정 수정 -->
      <div v-if="activeTab === 'edit'" class="tab-content">
        <p>현재 추가된 목록</p>
        <div class="schedule-item">
          <p>넷플릭스 정기 구독</p>
          <p>매달 10일 / 4,950원 / 지출</p>
          <p>알림 설정됨</p>
          <button class="edit-button">수정하기</button>
        </div>
      </div>

      <button class="close-button" @click="emit('close')">닫기</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

// defineEmits를 통해 이벤트 발생 함수(emit)를 받아옴
const emit = defineEmits(['close']);

const activeTab = ref('add'); // 기본 탭은 '금융 일정 추가'
const newExpense = ref({
  day: null, // 일자
  description: '', // 일정 이름
  amount: null, // 금액
  notify: false, // 알림 설정 여부
});

// 새로운 고정 지출 추가 함수
const addFixedExpense = async () => {
  try {
    // 입력값 검증
    if (
      !newExpense.value.day ||
      !newExpense.value.description ||
      !newExpense.value.amount
    ) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    // POST 요청으로 db.json에 데이터 추가
    await axios.post('http://localhost:3000/fixedExpenses', {
      day: newExpense.value.day,
      description: newExpense.value.description,
      amount: newExpense.value.amount,
    });

    alert('금융 일정이 성공적으로 추가되었습니다.');
    // 입력 필드 초기화
    newExpense.value = {
      day: null,
      description: '',
      amount: null,
      notify: false,
    };

    // 모달 닫기
    emit('close');
  } catch (error) {
    console.error('금융 일정 추가 중 오류 발생:', error);
    alert('금융 일정 추가에 실패했습니다.');
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  max-width: 600px;
  width: 100%;
  text-align: left;
}
input[type='text'],
input[type='number'] {
  width: 95%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #374151;
  background-color: #f9fafb;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
h2 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #111827;
}
.description {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 1.5rem;
}
.tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.tabs button {
  flex: 1;
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  color: #374151;
  transition: background 0.2s ease;
}
.tabs button.active {
  background: #2563eb;
  color: #fff;
  border-color: #2563eb;
}
.form-group {
  margin-bottom: 1rem;
}
.form-group label {
  display: block;
  font-size: 0.875rem;
  color: #374151;
  margin-bottom: 0.5rem;
}
.date-input,
.amount-input,
.description-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
}
.inline-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #374151;
}
.submit-button {
  width: 100%;
  padding: 0.75rem;
  background: #ffc7ef;
  color: #1a1a1a;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background 0.2s ease;
}
.submit-button:hover {
  background: #ffb3e6;
}
.close-button {
  margin-top: 1rem;
  width: 100%;
  padding: 0.75rem;
  background: #e5e7eb;
  color: #374151;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background 0.2s ease;
}
.close-button:hover {
  background: #d1d5db;
}
</style>
