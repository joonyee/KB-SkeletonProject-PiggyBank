<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  isOpen: Boolean,
});

const emits = defineEmits(['close', 'apply']);

const closeModal = () => {
  emits('close');
};

const applyFilter = () => {
  emits('apply');
};
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop">
    <div class="modal-content">
      <div class="modal-header">
        <h3 class="title">필터</h3>
        <i class="fa-solid fa-xmark close-icon" @click="closeModal"></i>
      </div>
      <div class="modal-body">
        <!-- 날짜 필터 -->
        <div class="filter-section">
          <label class="section-title">날짜</label>
          <div class="date-range">
            <input type="date" placeholder="시작일" v-model="startDate" />
            <span>~</span>
            <input type="date" placeholder="종료일" v-model="endDate" />
          </div>
        </div>

        <!-- 구분 필터 -->
        <div class="filter-section">
          <label class="section-title">구분</label>
          <div class="filter-options">
            <button @click="setType('all')" class="filter-btn">전체</button>
            <button @click="setType('income')" class="filter-btn">수입</button>
            <button @click="setType('expense')" class="filter-btn">지출</button>
          </div>
        </div>

        <!-- 카테고리 필터 -->
        <div class="filter-section">
          <label class="section-title">카테고리</label>
          <div class="category-list">
            <div>
              <input type="checkbox" id="all" v-model="categoryAll" /> 전체
            </div>

            <!-- 수입 카테고리 -->
            <label class="income-category-title">수입 카테고리</label>
            <div class="income-category">
              <input type="checkbox" id="salary" /> 급여
              <input type="checkbox" id="allowance" /> 용돈
              <input type="checkbox" id="side-income" /> 부수입
              <input type="checkbox" id="other-income" /> 기타수입
            </div>

            <!-- 지출 카테고리 -->
            <label class="expense-category-title">지출 카테고리</label>
            <div class="expense-category">
              <input type="checkbox" id="food" /> 식비
              <input type="checkbox" id="transport" /> 교통비
              <input type="checkbox" id="housing" /> 주거비
              <input type="checkbox" id="medical" /> 의료비
              <input type="checkbox" id="education" /> 교육비
              <input type="checkbox" id="clothing" /> 의류비
              <input type="checkbox" id="culture" /> 문화생활비
              <input type="checkbox" id="other-expense" /> 기타지출
            </div>
          </div>
        </div>
      </div>

      <!-- 모달 푸터 -->
      <div class="modal-footer">
        <button class="cancel-btn" @click="closeModal">취소</button>
        <button class="apply-btn" @click="applyFilter">적용</button>
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
}

.modal-content {
  background-color: var(--background-color);
  padding: 20px;
  border-radius: 10px;
  width: 350px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.title {
  font: var(--ng-bold-20);
}

.section-title {
  font: var(--ng-bold-16);
  margin-bottom: 8px;
}

.close-icon {
  cursor: pointer;
}

.modal-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.cancel-btn,
.apply-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font: var(--ng-bold-14);
  cursor: pointer;
}

.cancel-btn {
  background-color: var(--secondary-color);
  color: var(--text-color);
}

.apply-btn {
  background-color: var(--primary-color);
  color: var(--text-white);
}

.filter-btn {
  background-color: var(--primary-color);
  color: var(--text-white);
  border: none;
  padding: 5px 10px;
  margin: 5px;
  border-radius: 6px;
  cursor: pointer;
}

.income-category-title {
  color: var(--text-income);
}

.expense-category-title {
  color: var(--text-expense);
}

.date-range input {
  width: 100px;
  margin: 0 5px;
  padding: 4px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
