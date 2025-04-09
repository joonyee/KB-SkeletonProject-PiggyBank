import { createRouter, createWebHistory } from 'vue-router';
import PigIntro from '@/views/PigIntro.vue';
import Login from '@/views/Login.vue';
import SignUp from '@/views/SignUp.vue';
import AgeExpenseAnalysis from '@/views/AgeExpenseAnalysis.vue';
import ExpenseList from '@/views/ExpenseList.vue';
import MonthlyAnalysis from '@/views/MonthlyAnalysis.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'PigIntro',
      component: PigIntro,
    },

    { path: '/login', component: Login },
    { path: '/signup', component: SignUp },
    {
      path: '/ageExpenseAnalysis',
      name: 'AgeExpenseAnalysis',
      component: AgeExpenseAnalysis,
    },

    {
      path: '/monthlyAnalysis',
      name: 'MonthlyAnalysis',
      component: MonthlyAnalysis,
    },
    {
      path: '/expenseList',
      name: 'ExpenseList',
      component: ExpenseList,
    },
    // {
    //   path: '/expenseList/transaction/:id',
    //   name: 'TransactionDetail',
    //   component: TransactionDetail,
    //   props: true,
    // },
    // {
    //   path: '/transactionDetail',
    //   name: 'TransactionDetail',
    //   component: TransactionDetail,
    // },
  ],
});

export default router;
