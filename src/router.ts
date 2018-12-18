import Vue from 'vue';
import axios from 'axios'
import VueAxios from 'vue-axios'
import Router from 'vue-router';
import Home from './views/Home.vue';
import components from "./components/components.vue"
import properties from "./components/properties.vue"
import modules from "./components/modules.vue"
import templates from "./components/templates.vue"
import projects from "./components/projects.vue"

 
Vue.use(VueAxios, axios);

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/components',
      name: 'components',
      component: components,
    },
    {
      path: '/properties',
      name: 'properties',
      component: properties,
    },
    {
      path: '/Modules',
      name: 'modules',
      component: modules,
    },
    {
      path: '/Templates',
      name: 'templates',
      component: templates,
    },
    {
      path: '/projects',
      name: 'projects',
      component: projects,
    }
    // {
      // path: '/about',
      // name: 'about',
      // // route level code-splitting
      // // this generates a separate chunk (about.[hash].js) for this route
      // // which is lazy-loaded when the route is visited.
      //                component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    // },
  ],
});
