import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useMainStore = defineStore('main', () => {
    const totalIncome = ref(0);
    const balance = ref(0);

    const savingsRate = computed(() => {
        if (totalIncome.value === 0) return 0;
        return Math.round((balance.value / totalIncome.value) * 100);
    });

    return {
        totalIncome,
        balance,
        savingsRate, // 다른 컴포넌트에서 호출 가능
    };
});