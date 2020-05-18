import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import Toasted from 'vue-toasted'
// import GAuth from 'vue-google-oauth2'
// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)
Vue.config.productionTip = false
Vue.use(Toasted)

// Vue.use(GAuth, {
//   clientId: '"720573661600-qgjsb75f9a0gjo5s3h58asoevoniug5i.apps.googleusercontent.com', scope: 'email', prompt: 'consent', fetch_basic_profile: false
// })
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
