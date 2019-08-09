import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import VueGtm from 'vue-gtm';

Vue.config.productionTip = false
new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
Vue.use(VueGtm, {
  id: 'GTM-THPTKXQ', // Your GTM ID
  enabled: true, // defaults to true. Plugin can be disabled by setting this to false for Ex: enabled: !!GDPR_Cookie (optional)
  debug: true // Whether or not display console logs debugs (optional)
});