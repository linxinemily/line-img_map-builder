import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import html2canvas from 'html2canvas';

Vue.config.productionTip = false
Vue.use(html2canvas)
new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
