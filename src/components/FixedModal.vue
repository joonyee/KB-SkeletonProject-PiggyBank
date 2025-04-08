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

      <!-- 금융 일정 추가 탭 -->
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
      </div>
      <div v-if="activeTab === 'add'" class="submit-button">
        <button @click="addFixedExpense">금융 일정 추가하기</button>
      </div>

      <!-- 금융 일정 수정 탭 -->
      <div v-if="activeTab === 'edit'" class="tab-content edit-tab">
        <div class="schedule-item" :key="currentIndex">
          <p class="expense-description">{{ currentExpense.description }}</p>
          <p class="expense-details">
            매달 {{ currentExpense.day }}일 /
            {{ formatNumber(currentExpense.amount) }}원 / 지출
          </p>
          <p class="expense-notify" v-if="currentExpense.notify">알림 설정됨</p>
          <p class="expense-notify" v-else>알림 설정 안 됨</p>
        </div>

        <div class="navigation-buttons">
          <button @click="prevExpense" :disabled="currentIndex === 0">
            이전
          </button>
          <button
            @click="nextExpense"
            :disabled="currentIndex === (expenses.value?.length || 0) - 1"
          >
            다음
          </button>
        </div>
      </div>

      <div v-if="activeTab === 'edit'" class="submit-button">
        <button @click="enableEditMode">수정하기</button>
      </div>

      <button class="close-button" @click="emit('close')">닫기</button>
    </div>
  </div>

  <!-- 수정하기 모달 (별도 오버레이) -->
  <div v-if="editMode" class="edit-modal-overlay" @click.self="cancelEdit">
    <div class="edit-modal-content">
      <h2>수정하기</h2>
      <div class="form-group">
        <label>날짜</label>
        <input type="number" v-model="editableExpense.day" />
      </div>
      <div class="form-group">
        <label>금액</label>
        <input type="number" v-model="editableExpense.amount" />
      </div>
      <div class="form-group">
        <label>일정 이름</label>
        <input type="text" v-model="editableExpense.description" />
      </div>
      <div class="form-group">
        <label class="inline-label">
          <input type="checkbox" v-model="editableExpense.notify" />
          일정 하루 전날 알림
        </label>
      </div>
      <div class="edit-buttons">
        <button @click="updateFixedExpense">저장하기</button>
        <button @click="cancelEdit">취소하기</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const emit = defineEmits(['close']);

const expenses = ref([]);
const currentIndex = ref(0);
const currentExpense = ref({});

const activeTab = ref('add');
const newExpense = ref({
  day: null,
  description: '',
  amount: null,
  notify: false,
});

// 수정하기 모달 관련 상태
const editMode = ref(false);
const editableExpense = ref({});

// 데이터 가져오기
const fetchData = async () => {
  try {
    const res = await axios.get('http://localhost:3000/fixedExpenses');
    expenses.value = Array.isArray(res.data) ? res.data : [];
    if (expenses.value.length > 0) {
      currentExpense.value = expenses.value[currentIndex.value];
    }
  } catch (error) {
    console.error('데이터 로딩 실패:', error);
  }
};

const prevExpense = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
    currentExpense.value = expenses.value[currentIndex.value];
  }
};

const nextExpense = () => {
  if (currentIndex.value < (expenses.value?.length || 0) - 1) {
    currentIndex.value++;
    currentExpense.value = expenses.value[currentIndex.value];
  }
};

const formatNumber = (num) => {
  if (!num) return '';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const addFixedExpense = async () => {
  try {
    if (
      !newExpense.value.day ||
      !newExpense.value.description ||
      !newExpense.value.amount
    ) {
      alert('모든 필드를 입력해주세요.');
      return;
    }
    await axios.post('http://localhost:3000/fixedExpenses', {
      day: newExpense.value.day,
      description: newExpense.value.description,
      amount: newExpense.value.amount,
      notify: newExpense.value.notify,
    });
    alert('금융 일정이 성공적으로 추가되었습니다.');
    newExpense.value = {
      day: null,
      description: '',
      amount: null,
      notify: false,
    };
    emit('close');
  } catch (error) {
    console.error('금융 일정 추가 중 오류 발생:', error);
    alert('금융 일정 추가에 실패했습니다.');
  }
};

const enableEditMode = () => {
  editMode.value = true;
  editableExpense.value = { ...currentExpense.value };
};

const cancelEdit = () => {
  editMode.value = false;
};

const updateFixedExpense = async () => {
  try {
    if (
      !editableExpense.value.day ||
      !editableExpense.value.description ||
      !editableExpense.value.amount
    ) {
      alert('모든 필드를 입력해주세요.');
      return;
    }
    await axios.put(
      `http://localhost:3000/fixedExpenses/${
        editableExpense.value.id || currentIndex.value
      }`,
      {
        day: editableExpense.value.day,
        description: editableExpense.value.description,
        amount: editableExpense.value.amount,
        notify: editableExpense.value.notify,
      }
    );
    currentExpense.value = { ...editableExpense.value };
    expenses.value[currentIndex.value] = { ...editableExpense.value };
    alert('금융 일정이 수정되었습니다.');
    editMode.value = false;
  } catch (error) {
    console.error('금융 일정 수정 중 오류 발생:', error);
    alert('금융 일정 수정에 실패했습니다.');
  }
};

onMounted(() => {
  fetchData();
});
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
  position: relative;
  background: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  max-width: 600px;
  width: 100%;
  text-align: left;
}

h2 {
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
  color: #111827;
  text-align: center;
}

.description {
  font-size: 1rem;
  color: #6b7280;
  margin-bottom: 1.5rem;
  text-align: center;
}

.tabs {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.tabs button {
  padding: 0.75rem 1.5rem;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  color: #374151;
  transition: background 0.2s ease;
}

.tabs button.active {
  background: #ffc7ef;
  color: #1a1a1a;
  border-color: #ffc7ef;
}

.tab-content {
  margin-bottom: 2.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-size: 0.95rem;
  color: #374151;
  margin-bottom: 0.5rem;
}

input[type='text'],
input[type='number'] {
  width: 95%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  color: #374151;
  background-color: #f9fafb;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.inline-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  color: #374151;
}

.close-button {
  width: 100%;
  padding: 0.75rem;
  background: #e5e7eb;
  color: #374151;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.close-button:hover {
  background: #d1d5db;
}

.navigation-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

.navigation-buttons button {
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  border-radius: 6px;
  font-size: 1rem;
  color: #374151;
  cursor: pointer;
  transition: background 0.2s ease;
}

.navigation-buttons button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.submit-button {
  margin-top: 2rem;
  text-align: left;
}

.submit-button button {
  width: 100%;
  padding: 0.75rem;
  background: #ffc7ef;
  color: #1a1a1a;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s ease;
  margin-bottom: 1rem;
}

.submit-button button:hover {
  background: #ffb3e6;
}

/* 수정 모달 오버레이 */
.edit-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
}

.edit-modal-content {
  background: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  text-align: left;
}

.edit-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
}

/* 공통 버튼 스타일 */
.edit-buttons button {
  background-color: #ffc7ef;
  color: #1a1a1a;
  border: none;
  padding: 0.75rem 1.25rem;
  font-size: 0.875rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.edit-buttons button:hover {
  background-color: #ffb3e6;
}
</style>
