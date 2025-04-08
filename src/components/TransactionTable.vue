<script setup>
import { ref } from 'vue';
import FilterModal from '../components/FilterModal.vue';

const showModal = ref(false);

const openModal = () => {
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const applyFilter = () => {
  console.log('필터 적용');
  showModal.value = false;
};

const props = defineProps({
  transactions: Array,
});
</script>

<template>
  <div class="table-container">
    <div class="table-header">
      <i
        class="fa-solid fa-list filter-icon"
        @click="openModal"
        aria-label="필터 열기"
        title="필터 열기"
      ></i>
    </div>
    <table class="transaction-table">
      <thead>
        <tr>
          <th>날짜</th>
          <th>구분</th>
          <th>카테고리</th>
          <th>내용</th>
          <th>금액</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in transactions" :key="index">
          <td>{{ item.date }}</td>
          <td :class="item.type === 'income' ? 'income' : 'expense'">
            {{ item.type === 'income' ? '수입' : '지출' }}
          </td>
          <td>{{ item.category }}</td>
          <td>{{ item.description }}</td>
          <td :class="item.type === 'income' ? 'income' : 'expense'">
            {{ item.amount.toLocaleString() }}원
          </td>
        </tr>
      </tbody>
    </table>
    <!-- 필터 모달 -->
    <FilterModal v-if="showModal" @close="closeModal" @apply="applyFilter" />
  </div>
</template>

<style scoped>
.table-container {
  background-color: var(--background-color);
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 20px auto;
  width: 100%;
  max-width: 1200px;
}

.table-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
  font: var(--ng-reg-14);
  color: var(--text-secondary);
}

.transaction-table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 15px;
  text-align: center;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: var(--primary-color);
  color: var(--text-white);
  font: var(--ng-bold-16);
}

.income {
  color: var(--text-income);
}

.expense {
  color: var(--text-expense);
}

.filter-icon {
  font-size: 20px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: transform 0.2s ease;
  margin-right: 10px;
}

.filter-icon:hover {
  transform: scale(1.1);
  color: var(--primary-color);
}
.fa-list {
  font-size: 22px;
  cursor: pointer;
}
</style>
