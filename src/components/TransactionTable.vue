<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { defineProps } from 'vue';
import axios from 'axios';
import FilterModal from '../components/FilterModal.vue';

const showModal = ref(false);
const transactions = ref([]);
const filteredTransactions = ref([]);
const currentPage = ref(1);
const itemsPerPage = 5;
const router = useRouter();

// TransactionDetail 페이지로 이동
const goToDetail = (id) => {
  router.push({ name: 'TransactionDetail', params: { id: String(id) } });
};

const props = defineProps({
  transactions: {
    type: Array,
    default: () => [],
  },
});
console.log('TransactionTable transactions:', props.transactions);
const openModal = () => {
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const applyFilter = (filterData) => {
  console.log('필터 적용', filterData);
  filterTransactions(filterData);
  showModal.value = false;
};

// 데이터 필터링 함수
const filterTransactions = (filterData) => {
  filteredTransactions.value = transactions.value.filter((transaction) => {
    const isDateInRange =
      (!filterData.startDate || transaction.date >= filterData.startDate) &&
      (!filterData.endDate || transaction.date <= filterData.endDate);

    const isTypeMatch =
      filterData.type === 'all' || transaction.type === filterData.type;

    const isCategoryMatch =
      filterData.categories.length === 0 ||
      filterData.categories.includes(transaction.category);

    return isDateInRange && isTypeMatch && isCategoryMatch;
  });

  if (filteredTransactions.value.length === 0) {
    console.log('해당 내역이 없음');
  }
  currentPage.value = 1; // 필터 적용 후 첫 페이지로 이동
};

// 데이터 페이징 처리
const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredTransactions.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredTransactions.value.length / itemsPerPage);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

// DB에서 데이터 가져오기
const fetchTransactions = async () => {
  try {
    const response = await axios.get('http://localhost:3000/transactions');
    transactions.value = response.data;
    filteredTransactions.value = transactions.value;
    console.log('데이터 불러오기 성공');
  } catch (error) {
    console.error('데이터 불러오기 실패:', error);
  }
};

onMounted(() => {
  fetchTransactions();
});
</script>

<template>
  <div class="table-container">
    <div class="table-header">
      <i class="fa-solid fa-list filter-icon" @click="openModal"></i>
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
        <tr
          v-for="(item, index) in paginatedTransactions"
          :key="item.id"
          @click="goToDetail(item.id)"
          class="transaction-row"
        >
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
        <tr v-if="filteredTransactions.length === 0">
          <td colspan="5" class="no-data">해당 거래 내역이 없습니다.</td>
        </tr>
      </tbody>
    </table>

    <!-- 페이지네이션 -->
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">이전</button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">
        다음
      </button>
    </div>

    <!-- 필터 모달 -->
    <FilterModal
      v-if="showModal"
      :is-open="showModal"
      @close="closeModal"
      @apply="applyFilter"
    />
  </div>
</template>

<style scoped>
.table-container {
  background-color: var(--background-color);
  border-radius: 10px;
  padding: 20px;
  /* box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1); */
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
  box-sizing: border-box;
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
  font: var(--ng-reg-18);
}

.no-data {
  text-align: center;
  color: var(--text-secondary);
}

.income {
  color: var(--text-income);
}

.expense {
  color: var(--text-expense);
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 15px;
}

.pagination button {
  padding: 8px 12px;
  background-color: var(--primary-color);
  color: var(--text-white);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font: var(--ng-reg-15);
}

.pagination span {
  margin-top: 7px;
  font: var(--ng-reg-16);
}

.filter-icon {
  font-size: 22px;
  color: var(--text-secondary);
  cursor: pointer;
  margin-right: 10px;
}

.filter-icon:hover {
  color: var(--primary-color);
}

.fa-list {
  font-size: 22px;
  cursor: pointer;
  margin-right: 10px;
}
</style>
