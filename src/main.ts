import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';
import BootstrapVue from 'bootstrap-vue';
import VueAxios from 'vue-axios';
import VModal from 'vue-js-modal';
import Multiselect from 'vue-multiselect';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.config.productionTip = false;

Vue.use(VModal, { dynamic: true });
Vue.use(VueAxios);
Vue.use(BootstrapVue);
Vue.component('multiselect', Multiselect);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
