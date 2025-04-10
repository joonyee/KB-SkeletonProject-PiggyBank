<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import TransactionEditModal from '../components/TransactionEditModal.vue';
import FilterModal from '../components/FilterModal.vue';
import TransactionDetailModal from '../components/TransactionDetailModal.vue';
import TransactionModal from '../components/TransactionModal.vue';

const isModalOpen = ref(false);
const openModal = () => {
  isModalOpen.value = true;
};
const closeModal = () => {
  isModalOpen.value = false;
};

const isDetailModalOpen = ref(false);
const selectedDetailTransaction = ref(null);

const openDetailModal = (transaction) => {
  selectedDetailTransaction.value = transaction;
  isDetailModalOpen.value = true;
};

const closeDetailModal = () => {
  isDetailModalOpen.value = false;
};

const sortKey = ref('');
const sortOrder = ref('asc');

const sortBy = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortOrder.value = 'asc';
  }

  transactions.value.sort((a, b) => {
    let aVal = a[key];
    let bVal = b[key];

    // 날짜 문자열 정렬
    if (key === 'date') {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    }

    // 숫자 변환
    if (key === 'amount') {
      aVal = Number(aVal);
      bVal = Number(bVal);
    }

    if (sortOrder.value === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });
};

const transactions = ref([]);

const isEditModalOpen = ref(false);
const selectedTransaction = ref(null);
const isFilterModalOpen = ref(false);

const openFilterModal = () => {
  isFilterModalOpen.value = true;
};

const closeFilterModal = () => {
  isFilterModalOpen.value = false;
};

const applyFilter = (filterData) => {
  const { startDate, endDate, type, categories } = filterData;

  let filtered = [...originalTransactions.value];

  if (startDate) {
    filtered = filtered.filter((t) => t.date >= startDate);
  }
  if (endDate) {
    filtered = filtered.filter((t) => t.date <= endDate);
  }
  if (type !== 'all') {
    filtered = filtered.filter((t) => t.type === type);
  }
  if (categories && categories.length > 0) {
    filtered = filtered.filter((t) => categories.includes(t.category));
  }

  transactions.value = filtered;
  calculateTotals();
  isFilterModalOpen.value = false;
};

const openEditModal = (transaction) => {
  selectedTransaction.value = { ...transaction };
  isEditModalOpen.value = true;
};

const closeEditModal = () => {
  isEditModalOpen.value = false;
};

const updateTransaction = (updated) => {
  const index = transactions.value.findIndex((t) => t.id === updated.id);
  if (index !== -1) {
    transactions.value[index] = { ...updated };
  }
  closeEditModal();
};
const router = useRouter();

const totalIncome = ref(0);

const totalExpense = ref(0);

const allAccount = ref(0);

const originalTransactions = ref([]); // 원본 저장

const fetchTransactions = async () => {
  try {
    const response = await axios.get('http://localhost:3000/transactions');
    transactions.value = response.data;
    originalTransactions.value = response.data;
    calculateTotals();
  } catch (error) {
    console.error('데이터 불러오기 실패:', error);
  }
};

const calculateTotals = () => {
  totalIncome.value = transactions.value
    .filter((item) => item.type === 'income')
    .reduce((acc, item) => acc + item.amount, 0);
  totalExpense.value = transactions.value
    .filter((item) => item.type === 'expense')
    .reduce((acc, item) => acc + item.amount, 0);
  allAccount.value = totalIncome.value - totalExpense.value;
};

const goToAddTransaction = () => {
  router.push('/addTransaction');
};

const deleteTransaction = (id) => {
  if (confirm('정말 삭제하시겠습니까?')) {
    const index = transactions.value.findIndex((t) => t.id === id);
    if (index !== -1) {
      transactions.value.splice(index, 1); // 삭제
    }
    if (selectedTransaction.value?.id === id) {
      closeEditModal();
    }
  }
};

onMounted(() => {
  fetchTransactions();
});
</script>

<template>
  <div class="expense-list-container">
    <div class="container">
      <div class="summary-header">
        <div class="summary-cards">
          <div class="summary-card">
            <span>이번 달 수입</span>
            <span class="income">{{ totalIncome.toLocaleString() }}원</span>
          </div>
          <div class="summary-card">
            <span>이번 달 지출</span>
            <span class="expense">{{ totalExpense.toLocaleString() }}원</span>
          </div>
          <div class="summary-card">
            <span>이번 달 잔액</span>
            <span class="balance">{{ allAccount.toLocaleString() }}원</span>
          </div>
        </div>
      </div>
      <!-- 필터 버튼 상단 우측 -->
      <div class="table-toolbar">
        <button class="filter-btn" @click="openFilterModal">
          <i class="fa-solid fa-filter"></i> 필터
        </button>
      </div>
      <!-- 거래 목록 -->
      <table class="transaction-table">
        <thead>
          <tr>
            <th @click="sortBy('date')">
              날짜
              <i class="fa-solid fa-sort"></i>
            </th>
            <th>카테고리</th>
            <th @click="sortBy('amount')">
              금액
              <i class="fa-solid fa-sort"></i>
            </th>
            <th>내용</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="transaction in transactions"
            :key="transaction.id"
            @click="openDetailModal(transaction)"
          >
            <td>{{ transaction.date }}</td>
            <td>{{ transaction.category }}</td>
            <td :class="['transaction-amount', transaction.type]">
              {{ transaction.amount.toLocaleString() }}원
            </td>
            <td>{{ transaction.description }}</td>
            <td class="action-icons">
              <i
                class="fa-solid fa-pen-to-square edit-icon"
                @click.stop="openEditModal(transaction)"
              ></i>
              <i
                class="fa-solid fa-trash delete-icon"
                @click="
                  (e) => {
                    e.stopPropagation();
                    deleteTransaction(transaction.id);
                  }
                "
              ></i>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 수정 모달 -->
      <TransactionEditModal
        v-if="isEditModalOpen"
        :isOpen="isEditModalOpen"
        :transaction="selectedTransaction"
        @close="closeEditModal"
        @update="updateTransaction"
      />

      <!-- 필터 모달  -->
      <FilterModal
        v-if="isFilterModalOpen"
        :isOpen="isFilterModalOpen"
        @close="closeFilterModal"
        @apply="applyFilter"
      />
      <TransactionDetailModal
        v-if="isDetailModalOpen"
        :isOpen="isDetailModalOpen"
        :transaction="selectedDetailTransaction"
        @close="closeDetailModal"
      />

      <!-- 거래 추가 버튼 -->
      <button class="add-button" @click="openModal">
        <i class="fa-solid fa-plus"></i>
      </button>
      <TransactionModal
        :isOpen="isModalOpen"
        :date="selectedDate"
        @close="closeModal"
      />
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 20px;
}
.filter-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
.date-btn,
.category-btn {
  background-color: var(--primary-color);
  color: var(--text-white);
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font: var(--ng-bold-14);
}
.summary-header {
  display: flex;
  justify-content: center;
  margin: 30px 0 10px;
}
.summary-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  margin: 20px 0;
  justify-content: center;
  max-width: 100%;
}
.summary-card {
  background-color: var(--background-color);
  border-radius: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 24px 30px;
  text-align: center;
  min-width: 220px;
  width: 250px;
  flex: 1 1 250px;
  font: var(--ng-reg-18);
}
.summary-card span {
  display: block;
  margin: 10px 0;
}

.income {
  color: var(--text-income);
  font-size: 24px;
}
.expense {
  color: var(--text-expense);
  font-size: 24px;
}
.balance {
  color: var(--text-balance);
  font-size: 24px;
}
.transaction-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.transaction-table th,
.transaction-table td {
  padding: 12px;
  text-align: center;
  border-bottom: 1px solid #e0e0e0;
  font: var(--ng-reg-15);
}
.transaction-table th {
  font: var(--ng-reg-18);
  color: var(--text-color);
  letter-spacing: 0.5px;
}
th {
  cursor: pointer;
}

th i {
  margin-left: 4px;
  color: var(--text-secondary);
  font-size: 14px;
}

.transaction-table td {
  font: var(--ng-reg-16);
  color: var(--text-color);
  letter-spacing: 0.3px;
}

.transaction-amount.income {
  color: var(--text-income);
  font: var(--ng-reg-16);
}

.transaction-amount.expense {
  color: var(--text-expense);
  font: var(--ng-reg-16);
}

.edit-icon {
  cursor: pointer;
  color: var(--text-secondary);
}

.add-button {
  position: fixed;
  bottom: 40px;
  right: 40px;
  background-color: var(--primary-color);
  color: var(--text-white);
  border: none;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}

.delete-icon {
  cursor: pointer;
  margin-left: 20px;
}

.action-icons {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 14px;
}

.edit-icon,
.delete-icon {
  font-size: 18px;
}

.edit-icon {
  color: var(--text-secondary);
}

.delete-icon {
  color: var(--text-error);
}

.filter-btn {
  align-self: flex-start;
  background-color: var(--background-color);
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  margin-left: auto;
  font: var(--ng-reg-16);
  color: var(--hot-pink);
  display: flex;
  align-items: center;
  gap: 6px;
  height: 40px;
  margin-left: auto;
}
</style>
