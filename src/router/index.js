import { createRouter, createWebHistory } from 'vue-router'
import PigIntro from "@/views/PigIntro.vue";
import Login from "@/views/Login.vue";
import SignUp from "@/views/SignUp.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'PigIntro',
      component: PigIntro,
    },
    { path: '/login', component: Login },
    { path: '/signup', component: SignUp }

  ],
})

export default router
