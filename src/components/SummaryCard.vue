<script setup>
import { computed } from "vue";

const props = defineProps({
  title: String,
  amount: String,
  type: String,
});

const cardClass = computed(() => {
  if (props.type === "income") return "income";
  if (props.type === "expense") return "expense";
  return "balance";
});
</script>

<template>
  <div class="summary-card" :class="cardClass">
    <h3>{{ title }}</h3>
    <p>{{ amount }}</p>
  </div>
</template>

<style scoped>
.summary-card {
  background-color: var(--background-color);
  padding: 20px;
  border-radius: 15px;
  text-align: center;
  width: 300px;
  margin: 0 auto;
  font: var(--ng-bold-16);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.income {
  color: var(--text-income);
}

.expense {
  color: var(--text-expense);
}

.balance {
  color: var(--text-color);
}

p {
  font: var(--ng-bold-20);
}
</style>
