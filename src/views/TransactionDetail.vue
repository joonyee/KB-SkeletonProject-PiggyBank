<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const transaction = ref(null);

const fetchTransactionDetail = async () => {
  try {
    const response = await axios.get(
      `http://localhost:3000/transactions/${route.params.id}`
    );
    transaction.value = response.data;
  } catch (error) {
    console.error('상세 데이터를 불러오지 못했습니다.', error);
  }
};

onMounted(() => {
  fetchTransactionDetail();
});
</script>

<template>
  <div v-if="transaction">
    <h2>거래 상세 정보</h2>
    <div class="detail-card">
      <p><strong>거래 ID:</strong> {{ transaction.id }}</p>
      <p><strong>날짜:</strong> {{ transaction.date }}</p>
      <p>
        <strong>구분:</strong>
        {{ transaction.type === 'income' ? '수입' : '지출' }}
      </p>
      <p><strong>카테고리:</strong> {{ transaction.category }}</p>
      <p><strong>내용:</strong> {{ transaction.description }}</p>
      <p><strong>금액:</strong> {{ transaction.amount.toLocaleString() }}원</p>
    </div>
  </div>
  <div v-else>
    <p>거래 내역을 불러오는 중...</p>
  </div>
</template>

<style scoped>
.transaction-detail {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background-color: var(--background-color);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.title {
  font: var(--ng-bold-24);
  margin-bottom: 20px;
  text-align: center;
}

.detail-card {
  background-color: var(--secondary-color);
  padding: 15px;
  border-radius: 8px;
  margin-top: 10px;
}

p {
  margin: 5px 0;
  font: var(--ng-reg-18);
}
</style>
