<!-- components/TransactionDetailModal.vue -->
<template>
  <div v-if="isOpen" class="modal-backdrop">
    <div class="modal-card">
      <div class="modal-header">
        <h3 class="title">거래 상세</h3>
        <i class="fa-solid fa-xmark close-icon" @click="$emit('close')"></i>
      </div>
      <p class="date">{{ transaction.date }}</p>
      <div
        class="amount"
        :class="transaction.type === 'income' ? 'text-income' : 'text-expense'"
      >
        ₩{{ transaction.amount.toLocaleString() }}
      </div>
      <div class="info-section">
        <div class="info-item">
          <span class="label">카테고리</span>
          <div class="info-value">{{ transaction.category }}</div>
        </div>
        <div class="info-item">
          <span class="label">소비 유형</span>
          <div class="info-value">{{ transaction.subCategory || '-' }}</div>
        </div>
        <div class="info-item">
          <span class="label">내용</span>
          <div class="info-value">{{ transaction.description }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  isOpen: Boolean,
  transaction: Object,
});
const emit = defineEmits(['close']);
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}
.modal-card {
  background-color: var(--background-color);
  padding: 28px;
  border-radius: 16px;
  max-width: 420px;
  width: 90%;
}
.dark .modal-card {
  background-color: var(--background-color);
  padding: 28px;
  border-radius: 16px;
  max-width: 420px;
  width: 90%;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.title {
  font: var(--ng-bold-20);
}
.close-icon {
  font-size: 24px;
  cursor: pointer;
}
.amount {
  font-size: 28px;
  font-weight: bold;
  text-align: center;
  margin: 18px 0;
}
.text-income {
  color: var(--text-income);
}
.text-expense {
  color: var(--text-expense);
}
.info-section {
  margin-top: 10px;
}
.info-item {
  margin: 12px 0;
}
.label {
  font: var(--ng-bold-16);
  color: var(--text-subtitle);
}
.info-value {
  background-color: var(--card-color);
  padding: 12px;
  border-radius: 8px;
  margin-top: 6px;
  font: var(--ng-reg-16);
}
</style>
