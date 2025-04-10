<script setup>
// ✅ 기본 Vue 및 라이브러리 임포트
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

// ✅ 모달 컴포넌트 임포트
import TransactionEditModal from '../components/TransactionEditModal.vue';
import FilterModal from '../components/FilterModal.vue';
import TransactionDetailModal from '../components/TransactionDetailModal.vue';
import TransactionModal from '../components/TransactionModal.vue';

// ✅ 라우터 이동 관련
const router = useRouter();
const goToHome = () => router.push('/home');
const mypageClick = () => router.push('/myPage');
const logout = () => {
  alert('안녕히가세요!');

  localStorage.removeItem('loggedInUserId');
  localStorage.removeItem('loggedInUserInfo');

  router.push('/');
};

// ✅ 다크 모드
const isDarkMode = ref(false);
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  document.documentElement.classList.toggle('dark', isDarkMode.value);
};

// ✅ 거래 관련 상태
const transactions = ref([]);
const originalTransactions = ref([]);
const categories = ref([]);

// ✅ 필터 모달 상태
const isFilterModalOpen = ref(false);
const openFilterModal = () => (isFilterModalOpen.value = true);
const closeFilterModal = () => (isFilterModalOpen.value = false);

// ✅ 거래 추가 모달 상태
const isTransactionModalOpen = ref(false);
const openTransactionModal = () => (isTransactionModalOpen.value = true);
const closeTransactionModal = () => (isTransactionModalOpen.value = false);

// ✅ 거래 상세 모달 상태
const isDetailModalOpen = ref(false);
const selectedDetailTransaction = ref(null);
const openDetailModal = (transaction) => {
  selectedDetailTransaction.value = transaction;
  isDetailModalOpen.value = true;
};
const closeDetailModal = () => (isDetailModalOpen.value = false);

const showEditModal = ref(false);
const editTarget = ref(null);

const handleEditClick = (transaction) => {
  editTarget.value = { ...transaction };
  showEditModal.value = true;
};
const closeEdit = () => {
  showEditModal.value = false;
  editTarget.value = null;
};

const applyEdit = async (updated) => {
  try {
    await axios.patch(`http://localhost:3000/money/${updated.id}`, updated);

    const categoryName = getCategoryName(updated.categoryid);
    const updatedDisplayData = {
      id: updated.id,
      date: updated.date,
      category: categoryName,
      amount: updated.amount,
      description: updated.memo,
      type: updated.typeid === 1 ? 'income' : 'expense',
    };

    const index = transactions.value.findIndex((t) => t.id === updated.id);
    if (index !== -1) transactions.value[index] = { ...updatedDisplayData };

    closeEdit();
    calculateTotals();
  } catch (err) {
    console.error('수정 실패:', err);
    alert('수정 중 오류가 발생했습니다.');
  }
};

const deleteTransaction = async (id) => {
  if (confirm('정말 삭제하시겠습니까?')) {
    try {
      await axios.delete(`http://localhost:3000/money/${id}`);
      transactions.value = transactions.value.filter((t) => t.id !== id);
      calculateTotals();
    } catch (err) {
      console.error('삭제 실패:', err);
      alert('삭제 중 오류가 발생했습니다.');
    }
  }
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
    let aVal = key === 'date' ? new Date(a[key]) : Number(a[key]) || a[key];
    let bVal = key === 'date' ? new Date(b[key]) : Number(b[key]) || b[key];
    return sortOrder.value === 'asc'
      ? aVal > bVal
        ? 1
        : -1
      : aVal < bVal
      ? 1
      : -1;
  });
};

const getCategoryName = (id) => {
  const cat = categories.value.find((c) => c.id === id);
  return cat ? cat.name : '기타';
};

const totalIncome = ref(0);
const totalExpense = ref(0);
const allAccount = ref(0);

const calculateTotals = () => {
  totalIncome.value = transactions.value
    .filter((item) => item.type === 'income')
    .reduce((acc, item) => acc + Number(item.amount), 0);

  totalExpense.value = transactions.value
    .filter((item) => item.type === 'expense')
    .reduce((acc, item) => acc + Number(item.amount), 0);

  allAccount.value = totalIncome.value - totalExpense.value;
};

const fetchTransactions = async () => {
  try {
    const userId = localStorage.getItem('loggedInUserId');
    if (!userId) return alert('로그인이 필요합니다.');

    const response = await axios.get('http://localhost:3000/money');
    const userData = response.data.filter((item) => item.userid === userId);
    const mapped = userData.map((item) => ({
      id: item.id,
      date: item.date,
      category: getCategoryName(item.categoryid),
      amount: Number(item.amount),
      description: item.memo,
      type: item.typeid === 1 ? 'income' : 'expense',
    }));
    transactions.value = mapped;
    originalTransactions.value = mapped;
    calculateTotals();
  } catch (error) {
    console.error('데이터 불러오기 실패:', error);
  }
};

const applyFilter = (filterData) => {
  const { startDate, endDate, type, categories } = filterData;
  let filtered = [...originalTransactions.value];

  if (startDate) filtered = filtered.filter((t) => t.date >= startDate);
  if (endDate) filtered = filtered.filter((t) => t.date <= endDate);
  if (type !== 'all') filtered = filtered.filter((t) => t.type === type);
  if (categories?.length)
    filtered = filtered.filter((t) => categories.includes(t.category));

  transactions.value = filtered;
  calculateTotals();
};
const handleAddTransaction = async (newTransaction) => {
  try {
    const userId = localStorage.getItem('loggedInUserId');
    if (!userId) {
      alert('로그인이 필요합니다.');
      return;
    }

    // 사용자 ID 포함한 payload 생성
    const payload = {
      ...newTransaction,
      userid: userId,
    };

    // POST 요청 → DB 저장
    const res = await axios.post(`http://localhost:3000/money`, payload);

    // 응답값 기반으로 프론트에 표시할 데이터 생성
    const newItem = {
      id: res.data.id,
      date: res.data.date,
      category: getCategoryName(res.data.categoryid),
      amount: Number(res.data.amount),
      description: res.data.memo,
      type: res.data.typeid === 1 ? 'income' : 'expense',
    };

    // 중복 방지 후 추가
    const exists = transactions.value.some((t) => t.id === newItem.id);
    if (!exists) {
      transactions.value.unshift(newItem);
      // originalTransactions.value.unshift(newItem);
    }

    // 모달 닫기 및 합계 계산
    closeTransactionModal();
    calculateTotals();
  } catch (err) {
    console.error('추가 실패:', err);
    alert('추가 중 오류가 발생했습니다.');
  }
};

onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:3000/category');
    categories.value = res.data;
    await fetchTransactions();
  } catch (err) {
    console.error('카테고리 불러오기 실패:', err);
  }
});
</script>

<template>
  <header class="dashboardHeader">
    <h1 class="dashboardTitle">
      <img
        src="/src/assets/icons/logo.png"
        class="iconImage"
        @click="goToHome"
      />Piggy Bank
    </h1>
    <div class="flex items-center gap-2 relative">
      <button @click="toggleDarkMode" class="darkModeButton">
        {{ isDarkMode ? '☀️' : '🌙' }}
      </button>
      <button class="mypageButton" @click="mypageClick">마이페이지</button>
      <button class="inputValue" @click="openTransactionModal">
        새 거래추가
      </button>
      <button class="logout" @click="logout">로그아웃</button>
    </div>
  </header>
  <div class="expense-list-container">
    <div class="container">
      <div class="summary-header">
        <div class="summary-cards">
          <div class="summary-card">
            <span>총 수입</span>
            <span class="income">{{ totalIncome.toLocaleString() }}원</span>
          </div>
          <div class="summary-card">
            <span>총 지출</span>
            <span class="expense">{{ totalExpense.toLocaleString() }}원</span>
          </div>
          <div class="summary-card">
            <span>총 자산</span>
            <span class="balance">{{ allAccount.toLocaleString() }}원</span>
          </div>
        </div>
      </div>
      <!-- 필터 버튼 상단 우측 -->
      <div class="table-toolbar">
        <button class="round-btn" @click="openFilterModal">
          <i class="fa-solid fa-filter"></i>
          <span>필터</span>
        </button>
        <button
          class="round-btn"
          @click="
            applyFilter({
              startDate: '',
              endDate: '',
              type: 'all',
              categories: [],
            })
          "
        >
          <i class="fa-solid fa-arrow-rotate-left"></i>
          <span>초기화</span>
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
                @click.stop="handleEditClick(transaction)"
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
        v-if="showEditModal && editTarget"
        :isOpen="showEditModal"
        :transaction="editTarget"
        @close="closeEdit"
        @update="applyEdit"
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
      <button class="add-button" @click="openTransactionModal">
        <i class="fa-solid fa-plus"></i>
      </button>
      <TransactionModal
        v-if="isTransactionModalOpen"
        :isOpen="isTransactionModalOpen"
        @close="closeTransactionModal"
        @add="handleAddTransaction"
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
.reset-btn {
  background-color: var(--background-color);
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  margin-left: 10px;
  font: var(--ng-reg-16);
  color: var(--hot-pink);
  display: flex;
  align-items: center;
  gap: 6px;
  height: 40px;
  cursor: pointer;
}
.table-toolbar {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin: 10px 0;
}

.round-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  border: 1px solid #fbcee8;
  border-radius: 999px;
  background-color: white;
  color: black;
  padding: 6px 14px;
  font: var(--ng-reg-14);
  cursor: pointer;
}

/* 헤더  */
.dashboardHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fbcee8;
  padding: 1rem;
  border-radius: 1rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.dashboardTitle {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 24px;
  font-weight: bold;
}
.iconImage {
  width: 60px;
  height: 60px;
  cursor: pointer;
}

.flex {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.darkModeButton {
  padding: 8px 12px;
  font-size: 1.2rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  cursor: pointer;
}

.mypageButton,
.logout,
.inputValue {
  background-color: rgb(254, 235, 253);
  border: 1px solid rgb(251, 209, 251);
  border-radius: 0.5rem;
  padding: 12px 24px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  font-weight: 600;
  color: #333;
}
</style>
