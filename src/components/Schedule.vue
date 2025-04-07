<template>
  <!-- 모달 배경 (overlay) -->
  <div class="modal-overlay" v-if="show" @click.self="closeModal">
    <div class="modal-container">
      <!-- 탭 헤더 -->
      <div class="modal-header">
        <ul class="tab-list">
          <li
            :class="{ active: currentTab === 'add' }"
            @click="currentTab = 'add'"
          >
            금융 일정 추가
          </li>
          <li
            :class="{ active: currentTab === 'edit' }"
            @click="currentTab = 'edit'"
          >
            금융 일정 수정
          </li>
        </ul>
        <button class="close-btn" @click="closeModal">×</button>
      </div>

      <!-- 모달 본문 -->
      <div class="modal-body">
        <!-- 왼쪽: 일정 등록/수정 폼 -->
        <div class="left-section">
          <h2 v-if="currentTab === 'add'">새 금융 일정 추가</h2>
          <h2 v-else>금융 일정 수정</h2>

          <div class="form-box">
            <label class="form-label">날짜</label>
            <input
              type="text"
              class="form-input"
              v-model="scheduleDate"
              placeholder="매월 10일"
            />

            <label class="form-label">금액</label>
            <input
              type="number"
              class="form-input"
              v-model.number="scheduleAmount"
              placeholder="예: 4500"
            />

            <label class="form-label">분류</label>
            <div class="radio-group">
              <label>
                <input type="radio" value="expense" v-model="scheduleType" />
                지출
              </label>
              <label>
                <input type="radio" value="income" v-model="scheduleType" />
                수입
              </label>
            </div>

            <label class="form-label">일정 이름</label>
            <input
              type="text"
              class="form-input"
              v-model="scheduleName"
              placeholder="예: 넷플릭스 정기 구독"
            />

            <div class="alarm-setting">
              <span>알림 설정</span>
              <label class="switch">
                <input type="checkbox" v-model="alarmOn" />
                <span class="slider"></span>
              </label>
            </div>

            <button class="submit-btn" @click="handleSubmit">
              {{ currentTab === 'add' ? '금융 일정 추가' : '수정 내용 저장' }}
            </button>
          </div>
        </div>

        <!-- 오른쪽: 일정 목록 -->
        <div class="right-section">
          <h3>현재 일정 목록</h3>
          <ul class="schedule-list">
            <li
              v-for="(item, index) in scheduleList"
              :key="index"
              class="schedule-item"
            >
              <div class="schedule-title">{{ item.name }}</div>
              <div class="schedule-detail">
                <span>{{ item.date }} / {{ Math.abs(item.amount) }}원</span>
                <span v-if="item.amount < 0"> (지출) </span>
                <span v-else> (수입) </span>
              </div>
              <button class="edit-button" @click="editItem(index)">
                수정하기
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 모달 표시 여부를 부모에서 컨트롤하기 위해 show(불리언) 받음
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits(['close']);

// 탭 상태: 'add' or 'edit'
const currentTab = ref('add');

// 폼 필드
const scheduleDate = ref('');
const scheduleAmount = ref(0);
const scheduleType = ref('expense'); // 'expense' | 'income'
const scheduleName = ref('');
const alarmOn = ref(false);

// 기존 일정 목록 (실제로는 부모나 API에서 받아올 수 있음)
const scheduleList = ref([
  {
    date: '매월 10일',
    amount: -4500,
    type: 'expense',
    name: '넷플릭스 정기 구독',
    alarm: true,
  },
  {
    date: '매월 1일',
    amount: 3000000,
    type: 'income',
    name: '월급',
    alarm: false,
  },
]);

// 모달 닫기
function closeModal() {
  emits('close');
}

// 등록/수정 처리
function handleSubmit() {
  if (currentTab.value === 'add') {
    // 새 일정 추가
    scheduleList.value.push({
      date: scheduleDate.value,
      amount:
        scheduleType.value === 'expense'
          ? -Math.abs(scheduleAmount.value)
          : Math.abs(scheduleAmount.value),
      type: scheduleType.value,
      name: scheduleName.value,
      alarm: alarmOn.value,
    });
  } else {
    // 수정 모드라면, 편집 중인 항목을 업데이트
    // (아래 editItem()에서 index나 항목 정보를 저장하고 수정 로직을 구현)
    // 여기서는 간단히 alert로만 처리
    alert('수정 내용이 저장되었습니다.');
  }
  // 폼 리셋
  resetForm();
}

// 수정 버튼 클릭 시
function editItem(index) {
  currentTab.value = 'edit';
  const item = scheduleList.value[index];
  scheduleDate.value = item.date;
  scheduleAmount.value = Math.abs(item.amount);
  scheduleType.value = item.type;
  scheduleName.value = item.name;
  alarmOn.value = item.alarm;
  // 이후 handleSubmit() 시에 실제로 scheduleList[index]를 갱신하는 로직 추가 가능
}

// 폼 리셋
function resetForm() {
  scheduleDate.value = '';
  scheduleAmount.value = 0;
  scheduleType.value = 'expense';
  scheduleName.value = '';
  alarmOn.value = false;
  currentTab.value = 'add';
}
</script>

<style scoped>
/* 모달 배경 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 모달 컨테이너 */
.modal-container {
  background: #fff;
  width: 900px;
  max-width: 90%;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.3s ease;
}

/* 헤더 - 탭 */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f4f5f7;
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
}
.tab-list {
  list-style: none;
  display: flex;
  gap: 1rem;
  padding: 0;
  margin: 0;
}
.tab-list li {
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 8px;
}
.tab-list li:hover {
  background-color: #e2e8f0;
}
.tab-list li.active {
  background-color: #e2e8f0;
  font-weight: bold;
}
.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

/* 바디 */
.modal-body {
  display: flex;
  gap: 2rem;
  padding: 1.5rem;
}

/* 왼쪽 섹션 */
.left-section {
  flex: 1;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
}
.form-box {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.form-label {
  font-weight: 500;
  color: #4b5563;
}
.form-input {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
}
.radio-group {
  display: flex;
  gap: 1rem;
  align-items: center;
}
.alarm-setting {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
}
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 34px;
}
.slider:before {
  position: absolute;
  content: '';
  height: 14px;
  width: 14px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}
.switch input:checked + .slider {
  background-color: #3b82f6;
}
.switch input:checked + .slider:before {
  transform: translateX(20px);
}

.submit-btn {
  background-color: #3b82f6;
  color: #fff;
  border: none;
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
}
.submit-btn:hover {
  background-color: #2563eb;
}

/* 오른쪽 섹션 */
.right-section {
  flex: 1;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
}
.schedule-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.schedule-item {
  background: #f9fafb;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.schedule-title {
  font-weight: 600;
  color: #374151;
}
.schedule-detail {
  font-size: 0.9rem;
  color: #6b7280;
}
.edit-button {
  align-self: flex-end;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 0.4rem 0.75rem;
  cursor: pointer;
  font-size: 0.85rem;
}
.edit-button:hover {
  background: #e5e7eb;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
