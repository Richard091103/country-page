import { createRouter, createWebHistory } from 'vue-router';
import MainContent from '../view/MainContent.vue';
import InformationPage from '../view/InformationPage.vue';

const routes = [
  { 
    path: '/', 
    component: MainContent 
  },
  { 
    path: '/country/:id',
    name: 'country',
    component: InformationPage,
    props: true // This allows route params to be passed as props
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;