import Vue from 'vue';
import VueRouter from 'vue-router';
import Postcards from '../views/Postcards.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Postcards',
    component: Postcards,
  },
];

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes,
});

export default router;
