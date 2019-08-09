import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import VueGtm from 'vue-gtm';
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'material-design-icons-iconfont/dist/material-design-icons.css'


axios.defaults.baseURL = 'https://api.imgur.com/3';
axios.defaults.headers.common['Authorization'] = 'Client-ID 51b00c37501acb3';
Vue.use(VueAxios, axios)


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
