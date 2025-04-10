import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import axios from 'axios';

export const useDashboardStore = defineStore('dashboard', () => {
  const chartData = ref([]);
  const categorySpending = ref([]);
  const transactions = ref([]);
  const loading = ref(true);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/money');

      const moneyData = response.data;
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

      console.log(chartData);
      const sorted = moneyData.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      // 가장 최근 달 구하기 (예: '2025-04')
      const latestMonth =
        sorted.length > 0
          ? new Date(sorted[0].date).toISOString().slice(0, 7)
          : null;

      // 최근 달 지출 내역만 필터링
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

      // 카테고리별 합산
      const categoryTotals = {};
      recentMonthData.forEach((entry) => {
        const catId = entry.categoryid;
        if (!categoryTotals[catId]) {
          categoryTotals[catId] = 0;
        }
        categoryTotals[catId] += entry.amount;
      });

      console.log(categoryTotals);

      const categoryRes = await axios.get('http://localhost:3000/category');
      const categoryMap = categoryRes.data.reduce((map, cat) => {
        map[cat.id] = cat.name;
        return map;
      }, {});

      // 트랜잭션 출력용 가공 (지출/수입 전부)
      const recentTransactions = sorted
        .filter((entry) => {
          const entryMonth = new Date(entry.date).toISOString().slice(0, 7);
          return entryMonth === latestMonth;
        })
        .map((entry) => ({
          date: entry.date,
          category: categoryMap[entry.categoryid] || '기타',
          description: entry.memo,
          amount: entry.typeid === 1 ? entry.amount : -entry.amount,
        }));

      // const sorted = moneyData.sort(
      //   (a, b) => new Date(b.date) - new Date(a.date)
      // );

      // 차트용 데이터 세팅
      transactions.value = recentTransactions;
      categorySpending.value = Object.entries(categoryTotals).map(
        ([id, amount]) => ({
          category: categoryMap[id] || '기타',
          amount,
        })
      );
    } catch (error) {
      console.error('데이터 로딩 실패:', error);
    } finally {
      loading.value = false;
    }
  };
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

  return {
    chartData,
    categorySpending,
    transactions,
    loading,
    fetchData,
  };
});
