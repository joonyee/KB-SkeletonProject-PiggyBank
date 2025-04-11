<template>
  <div class="tendencyCountWrapper">
    <!-- 계획 지출 카드 -->
    <div class="tendencyCard">
      <p class="cardTitle">{{ thisMonth }} 계획 지출</p>
      <div class="cardCount green">
        {{ plannedCount }}회
        <span class="amount">₩{{ plannedAmount.toLocaleString() }}</span>
      </div>
      <div class="progressBar">
        <div
          class="progressFill green"
          :style="{ width: plannedPercent + '%' }"
        ></div>
      </div>
    </div>

    <!-- 충동 지출 카드 -->
    <div class="tendencyCard">
      <p class="cardTitle">{{ thisMonth }} 충동 지출</p>
      <div class="cardCount red">
        {{ impulseCount }}회
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

// 각 지출 유형별 건수 및 금액 상태
const plannedCount = ref(0);
const impulseCount = ref(0);
const plannedAmount = ref(0);
const impulseAmount = ref(0);

// 현재 월
const now = new Date();
const thisMonth = `${now.getMonth() + 1}월`;

onMounted(async () => {
  // 로그인된 유저 ID 추출
  const userInfo = JSON.parse(localStorage.getItem("loggedInUserInfo") || "{}");
  const userId = userInfo.id;

  // 거래 내역 가져오기
  const res = await fetch("https://kb-piggybank.glitch.me/money");
  const data = await res.json();

  // 로그인된 유저의 데이터만 필터링
  const userData = data.filter((item) => item.userid === userId);

  // tendency 또는 tendencyid 중 사용 가능한 값 사용
  const normalizedData = userData.map((item) => ({
    ...item,
    tendency: item.tendency ?? item.tendencyid ?? null,
  }));

  // 현재 달 ("YYYY-MM")
  const currentMonth = now.toISOString().slice(0, 7);

  // 이번 달 + 지출(수입 제외) 필터링
  const filtered = normalizedData.filter((item) => {
    const isExpense = item.tendency !== null && item.tendency !== 3;
    const isCurrentMonth = item.date?.slice(0, 7) === currentMonth;
    return isExpense && isCurrentMonth;
  });

  // 계획/충동 분류
  const planned = filtered.filter((item) => item.tendency === 1);
  const impulse = filtered.filter((item) => item.tendency === 2);

  // 개수 및 금액 계산
  plannedCount.value = planned.length;
  impulseCount.value = impulse.length;
  plannedAmount.value = planned.reduce((sum, cur) => sum + cur.amount, 0);
  impulseAmount.value = impulse.reduce((sum, cur) => sum + cur.amount, 0);
});

// 총 지출 금액
const totalAmount = computed(() => plannedAmount.value + impulseAmount.value);

// 지출 유형별 비율
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
  margin: 2rem auto 2rem auto; /* 가운데 정렬 및 상하 여백 */
}

.tendencyCard {
  flex: 1;
  max-width: 630px; /* 카드 최대 폭 제한 */
  min-width: 280px; /* 너무 좁아지는 것도 방지 */
  background: #fff;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.dark .tendencyCard {
  background: #e7e5e4;
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
  margin: 0.8rem 0 0.8rem 0;
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
    max-width: none; /* 모바일에서는 최대폭 제한 해제 */
  }
}
</style>
