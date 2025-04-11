<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
    viewBox="0 0 200 200"
  >
    <!-- 그라디언트 정의 -->
    <defs>
      <radialGradient id="faceGradient" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stop-color="#FFD8F0" />
        <stop offset="100%" stop-color="#FFA8DC" />
      </radialGradient>
      <radialGradient id="earGradient" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#FFD0EB" />
        <stop offset="100%" stop-color="#FF9FD6" />
      </radialGradient>
    </defs>

    <!-- 귀 -->
    <circle
      :cx="earLeft.cx"
      :cy="earLeft.cy"
      :r="earSize"
      fill="url(#earGradient)"
    />
    <circle
      :cx="earRight.cx"
      :cy="earRight.cy"
      :r="earSize"
      fill="url(#earGradient)"
    />

    <!-- 얼굴 -->
    <circle cx="100" cy="100" :r="faceRadius" fill="url(#faceGradient)" />

    <!-- 왼쪽 눈 -->
    <rect
      :x="eyeLeft.x"
      :y="eyeLeft.y"
      :width="eyeSize.width"
      :height="eyeSize.height"
      rx="3"
      fill="#000"
      class="blink"
    />
    <circle
      :cx="eyeLeft.x + eyeSize.width / 2"
      :cy="eyeLeft.y + eyeSize.height / 2"
      :r="eyeHighlightSize"
      fill="white"
    />

    <!-- 오른쪽 눈 -->
    <rect
      :x="eyeRight.x"
      :y="eyeRight.y"
      :width="eyeSize.width"
      :height="eyeSize.height"
      rx="3"
      fill="#000"
      class="blink"
    />
    <circle
      :cx="eyeRight.x + eyeSize.width / 2"
      :cy="eyeRight.y + eyeSize.height / 2"
      :r="eyeHighlightSize"
      fill="white"
    />

    <!-- 코 -->
    <ellipse
      cx="100"
      :cy="nosePosition.cy"
      :rx="noseSize.rx"
      :ry="noseSize.ry"
      fill="#FFB6DC"
    />
    <ellipse
      cx="100"
      :cy="nosePosition.cy"
      :rx="noseSize.rx"
      :ry="noseSize.ry"
      fill="rgba(0, 0, 0, 0.05)"
    />
    <circle
      :cx="noseHoles.left.cx"
      :cy="noseHoles.left.cy"
      :r="noseHoleSize"
      fill="#000"
    />
    <circle
      :cx="noseHoles.right.cx"
      :cy="noseHoles.right.cy"
      :r="noseHoleSize"
      fill="#000"
    />
  </svg>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
const chartData = ref([]);
const categorySpending = ref([]);
const transactions = ref([]);
const loading = ref(true); // 로딩 상태 추가

const fetchData = async () => {
  try {
    const userId = localStorage.getItem("loggedInUserId");
    if (!userId) {
      throw new Error("로그인 정보가 없습니다.");
    } else {
      console.log("현재 로그인한 유저 ID:", userId);
    }

    const response = await axios.get("https://kb-piggybank.glitch.me/money");
    const moneyData = response.data.filter((entry) => entry.userid == userId); // 👈 유저별 필터

    const monthlyTotals = {};
    moneyData.forEach((entry) => {
      const month = entry.date.slice(0, 7);
      if (!monthlyTotals[month]) {
        monthlyTotals[month] = { income: 0, expense: 0 };
      }
      if (entry.typeid === 1) {
        monthlyTotals[month].income += entry.amount;
      } else if (entry.typeid === 2) {
        monthlyTotals[month].expense += entry.amount;
      }
    });

    chartData.value = Object.entries(monthlyTotals).map(
      ([month, { income, expense }]) => ({
        month,
        income,
        expense,
      })
    );

    const sorted = moneyData.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    const latestMonth =
      sorted.length > 0
        ? new Date(sorted[0].date).toISOString().slice(0, 7)
        : null;

    const recentMonthData = moneyData.filter((entry) => {
      const entryMonth = new Date(entry.date).toISOString().slice(0, 7);
      return (
        entry.typeid === 2 &&
        entry.categoryid >= 5 &&
        entryMonth === latestMonth
      );
    });

    const recentMonthInData = moneyData.filter((entry) => {
      const entryMonth = new Date(entry.date).toISOString().slice(0, 7);
      return (
        entry.typeid === 1 &&
        entry.categoryid <= 4 &&
        entryMonth === latestMonth
      );
    });

    const categoryTotals = {};
    recentMonthData.forEach((entry) => {
      const catId = entry.categoryid;
      if (!categoryTotals[catId]) {
        categoryTotals[catId] = 0;
      }
      categoryTotals[catId] += entry.amount;
    });

    const categoryRes = await axios.get(
      "https://kb-piggybank.glitch.me/category"
    );
    const categoryMap = categoryRes.data.reduce((map, cat) => {
      map[cat.id] = cat.name;
      return map;
    }, {});

    const recentTransactions = sorted
      .filter((entry) => {
        const entryMonth = new Date(entry.date).toISOString().slice(0, 7);
        return entryMonth === latestMonth;
      })
      .map((entry) => ({
        date: entry.date,
        category: categoryMap[entry.categoryid] || "기타",
        description: entry.memo,
        amount: entry.typeid === 1 ? entry.amount : -entry.amount,
      }));

    transactions.value = recentTransactions;
    categorySpending.value = Object.entries(categoryTotals).map(
      ([id, amount]) => ({
        category: categoryMap[id] || "기타",
        amount,
      })
    );
  } catch (error) {
    console.error("데이터 로딩 실패:", error);
  } finally {
    loading.value = false;
  }
};
//여기까지
onMounted(() => {
  fetchData();
});
const totalIncome = computed(() =>
  transactions.value
    .filter((tx) => tx.amount > 0)
    .reduce((sum, tx) => sum + tx.amount, 0)
);

const totalExpense = computed(() =>
  transactions.value
    .filter((tx) => tx.amount < 0)
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0)
);

const balance = computed(() => totalIncome.value - totalExpense.value);

const savingsRate = computed(() => {
  if (totalIncome.value === 0) return 0;
  return Math.round((balance.value / totalIncome.value) * 100);
});

console.log(savingsRate);

// import {useDashboardStore} from "@/stores/store.js";

// const dashboard = useDashboardStore();
// const savingsRate = dashboard.savingsRate;

// 기본 크기 설정
const baseSize = 200;

// 크기 비율 계산 (저축률 기반)

const sizeRatio = savingsRate / 100 + 0.2; // 크기 비율 (0~1 사이) + 기본값 0.2
const size = baseSize * (0.6 + sizeRatio * 0.4); // 결과 60% ~ 100% 크기
console.log(size);

// 얼굴 크기
const faceRadius = 80 * sizeRatio; // 얼굴 반지름

// 귀 크기와 위치 계산
const earSize = 15 * sizeRatio; // 귀 크기
const earLeft = { cx: 100 - faceRadius * 0.55, cy: 100 - faceRadius * 0.7 }; // 왼쪽 귀 중심
const earRight = { cx: 100 + faceRadius * 0.55, cy: 100 - faceRadius * 0.7 }; // 오른쪽 귀 중심

// 눈 크기와 위치 계산
const eyeSize = {
  width: 10 * sizeRatio, // 눈 너비
  height: 25 * sizeRatio, // 눈 높이
};
const eyeHighlightSize = 2 * sizeRatio; // 눈 하이라이트 크기
const eyeLeft = {
  x: 100 - faceRadius * 0.3 - eyeSize.width / 2,
  y: 100 - faceRadius * 0.1 - eyeSize.height / 2,
};
const eyeRight = {
  x: 100 + faceRadius * 0.3 - eyeSize.width / 2,
  y: 100 - faceRadius * 0.1 - eyeSize.height / 2,
};

// 코 크기와 위치 계산
const noseSize = {
  rx: 30 * sizeRatio, // 코 타원의 x 반지름
  ry: 20 * sizeRatio, // 코 타원의 y 반지름
};
const nosePosition = {
  cy: 100 + faceRadius * 0.3, // 얼굴 크기에 따라 코의 y 위치를 조정
};

// 코 구멍 크기와 위치
const noseHoleSize = 5 * sizeRatio; // 코 구멍 크기
const noseHoles = {
  left: {
    cx: 100 - noseSize.rx * 0.4, // 코 타원의 중심에서 좌측 위치
    cy: nosePosition.cy, // 코 위치와 동일
  },
  right: {
    cx: 100 + noseSize.rx * 0.4, // 코 타원의 중심에서 우측 위치
    cy: nosePosition.cy, // 코 위치와 동일
  },
};
</script>

<style scoped>
.blink {
  animation: blinkAnim 3s infinite;
  transform-origin: center center;
}

@keyframes blinkAnim {
  0%,
  94%,
  100% {
    transform: scaleY(1);
  }
  95%,
  97% {
    transform: scaleY(0.1);
  }
}
</style>
