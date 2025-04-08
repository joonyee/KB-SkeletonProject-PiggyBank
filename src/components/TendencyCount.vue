<template>
  <div class="tendencyCountWrapper">
    <div class="tendencyCard" v-if="plannedCount > 0">
      <p class="cardTitle">계획 지출</p>
      <div class="cardCount green">
        {{ plannedCount }}건
        <span class="amount">₩{{ plannedAmount.toLocaleString() }}</span>
      </div>
      <div class="progressBar">
        <div
          class="progressFill green"
          :style="{ width: plannedPercent + '%' }"
        ></div>
      </div>
    </div>

    <div class="tendencyCard" v-if="impulseCount > 0">
      <p class="cardTitle">충동 지출</p>
      <div class="cardCount red">
        {{ impulseCount }}건
        <span class="amount">₩{{ impulseAmount.toLocaleString() }}</span>
      </div>
      <div class="progressBar">
        <div
          class="progressFill red"
          :style="{ width: impulsePercent + '%' }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const plannedCount = ref(0);
const impulseCount = ref(0);
const plannedAmount = ref(0);
const impulseAmount = ref(0);

onMounted(async () => {
  const res = await fetch("http://localhost:3000/money");
  const data = await res.json();

  const filtered = data.filter(
    (item) => item.tendency && item.tendency !== "수입"
  );

  const planned = filtered.filter((item) => item.tendency.includes("계획"));
  const impulse = filtered.filter((item) => item.tendency.includes("충동"));

  plannedCount.value = planned.length;
  impulseCount.value = impulse.length;
  plannedAmount.value = planned.reduce((sum, cur) => sum + cur.amount, 0);
  impulseAmount.value = impulse.reduce((sum, cur) => sum + cur.amount, 0);
});

const totalAmount = computed(() => plannedAmount.value + impulseAmount.value);

const plannedPercent = computed(() =>
  totalAmount.value > 0 ? (plannedAmount.value / totalAmount.value) * 100 : 0
);
const impulsePercent = computed(() =>
  totalAmount.value > 0 ? (impulseAmount.value / totalAmount.value) * 100 : 0
);
</script>

<style scoped>
.tendencyCountWrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
}

.tendencyCard {
  flex: 1;
  background: #fff;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.cardTitle {
  font-size: 0.95rem;
  font-weight: bold;
  margin-bottom: 0.6rem;
  color: #333;
}

.cardCount {
  display: flex;
  justify-content: flex-start;
  align-items: baseline;
  margin-bottom: 0.8rem;
  gap: 0.5rem;
}

.cardCount.green {
  color: #22c55e;
  font-size: 1.5rem;
  font-weight: bold;
}

.cardCount.red {
  color: #ef4444;
  font-size: 1.5rem;
  font-weight: bold;
}

.amount {
  font-size: 0.95rem;
  color: #666;
  margin-bottom: 0.8rem;
}

/* div 기반 progress bar */
.progressBar {
  background-color: #e6eaf1;
  border-radius: 999px;
  height: 8px;
  width: 100%;
  overflow: hidden;
}

.progressFill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.3s ease;
}

.progressFill.green {
  background-color: #22c55e;
}

.progressFill.red {
  background-color: #ef4444;
}

/* 반응형 */
@media (max-width: 600px) {
  .tendencyCountWrapper {
    flex-direction: column;
    align-items: center;
  }

  .tendencyCard {
    width: 100%;
  }
}
</style>
