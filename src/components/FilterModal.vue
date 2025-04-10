<script setup>
import { ref, computed } from 'vue';
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  isOpen: Boolean,
});

const emits = defineEmits(['close', 'apply']);

const startDate = ref('');

const endDate = ref('');

const selectedType = ref('all');

const selectedCategories = ref([]);

const closeModal = () => {
  emits('close');
};

const applyFilter = () => {
  emits('apply', {
    startDate: startDate.value,
    endDate: endDate.value,
    type: selectedType.value,
    categories: selectedCategories.value,
  });
};

const categories = {
  income: ['급여', '용돈', '부수입', '환급/지원금', '기타수입'],
  expense: [
    '식사/카페',
    '배달/간식',
    '쇼핑',
    '교통/차량',
    '주거/관리',
    '건강/병원',
    '취미/여가',
    '구독서비스',
    '여행/외출',
    '기타지출',
  ],
};

const toggleCategory = (category) => {
  if (selectedCategories.value.includes(category)) {
    selectedCategories.value = selectedCategories.value.filter(
      (item) => item !== category
    );
  } else {
    selectedCategories.value.push(category);
  }
};

const isCategorySelected = (category) => {
  return selectedCategories.value.includes(category);
};
</script>
<template>
  <div v-show="isOpen" class="modal-backdrop">
    <div class="modal-content">
      <div class="modal-header">
        <h3 class="title">상세 필터</h3>
        <i class="fa-solid fa-xmark close-icon" @click="$emit('close')"></i>
      </div>
      <div class="modal-body">
        <!-- 날짜 필터 -->
        <div class="filter-section">
          <label>기간 선택</label>
          <div class="date-range">
            <input type="date" v-model="startDate" class="input-field" />
            <span>~</span>
            <input type="date" v-model="endDate" class="input-field" />
          </div>
        </div>
        <div class="line-divider"></div>
        <!-- 구분 필터 -->
        <div class="filter-section">
          <label>구분</label>
          <select v-model="selectedType" class="select-box">
            <option value="all">전체</option>
            <option value="income">수입</option>
            <option value="expense">지출</option>
          </select>
        </div>
        <!-- <div class="line-divider"></div> -->
        <!-- 카테고리 필터 -->
        <div v-if="selectedType !== 'all'" class="filter-section">
          <label>카테고리</label>
          <div class="category-buttons">
            <button
              v-for="category in categories[selectedType]"
              :key="category"
              :class="[
                'category-btn',
                isCategorySelected(category) ? 'selected' : '',
              ]"
              @click="toggleCategory(category)"
            >
              {{ category }}
            </button>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="cancel-btn" @click="$emit('close')">취소</button>
        <button class="apply-btn" @click="applyFilter">완료</button>
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
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background-color: var(--background-color);
  padding: 30px 30px;
  border-radius: 16px;
  min-width: 350px;
  max-width: 420px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 8px;
}
.title {
  font: var(--ng-bold-20);
  color: var(--text-color);
}
.close-icon {
  cursor: pointer;
  font-size: 28px;
  color: var(--text-secondary);
}

.modal-body {
  margin: 10px 0;
}
.filter-section {
  margin-bottom: 18px;
}
.filter-section label {
  font: var(--ng-reg-15);
  color: var(--text-color);
  margin-bottom: 8px;
  display: block;
}
.input-field,
.select-box {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 8px;
  font: var(--ng-reg-15);
  background-color: #f4f4f4;
}
.input-field:focus,
.select-box:focus {
  outline: none;
  border-color: var(--primary-color);
  background-color: #fff;
}
.date-range {
  display: flex;
  gap: 10px;
  align-items: center;
}
.modal-footer {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 20px 0;
}
button {
  width: 100px;
  height: 35px;
  padding: 10px 20px;
  font: var(--ng-reg-14);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.cancel-btn,
.apply-btn {
  background-color: #f4f4f4;
  color: var(--text-color);
  border: 1px solid transparent;
}

.cancel-btn.selected,
.apply-btn.selected {
  background-color: var(--primary-color);
  color: var(--text-white);
}
.line-divider {
  border-top: 1px solid #e0e0e0;
  margin: 12px 0;
}
.category-buttons {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}
.category-btn {
  padding: 8px 14px;
  margin: 5px 0;
  background-color: #f4f4f4;
  color: var(--text-color);
  cursor: pointer;
}

.category-btn.selected {
  background-color: var(--primary-color);
  color: var(--text-white);
}
.select-box {
  font: var(--ng-reg-14);
  background-color: #f4f4f4;
}
input[type='date']::-webkit-calendar-picker-indicator {
  color: var(--primary-color);
  cursor: pointer;
}
input[type='date'] {
  color: var(--text-color);
  background-color: #f4f4f4;
}
button:focus {
  outline: none;
}
</style>
