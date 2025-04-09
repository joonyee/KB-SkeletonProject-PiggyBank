import { createRouter, createWebHistory } from 'vue-router';
import PigIntro from '@/views/PigIntro.vue';
import Login from '@/views/Login.vue';
import SignUp from '@/views/SignUp.vue';
import AgeExpenseAnalysis from '@/views/AgeExpenseAnalysis.vue';
import ExpenseList from '@/views/ExpenseList.vue';
import MonthlyAnalysis from '@/views/MonthlyAnalysis.vue';
import ExpenseTendency from '@/views/ExpenseTendency.vue';
import calendar from '@/views/CalendarDashboard.vue';
import Home from '@/views/Home.vue';
import MyPage from '@/views/MyPage.vue';

const routes = [
  { path: '/', component: PigIntro },
  { path: '/login', component: Login },
  { path: '/signup', component: SignUp },
  { path: '/home', component: Home },
  { path: '/ageExpenseAnalysis', component: AgeExpenseAnalysis },
  { path: '/expenseList', component: ExpenseList },
  { path: '/monthlyAnalysis', component: MonthlyAnalysis },
  { path: '/expenseTendency', component: ExpenseTendency },
  { path: '/calendar', name: 'Calendar', component: calendar },
  { path: '/myPage', component: MyPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
