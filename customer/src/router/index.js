import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import CheckOut from '../components/CheckOut.vue'
// import Productcard from '../components/ProductCard.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/checkout',
    name: 'CheckOut',
    component: CheckOut,
    meta: { requiresLogin: true }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// router.beforeEach((to, from, next) => {
//   if (to.matched.some(record => record.meta.requiresLogin)) {
//     // You can use store variable here to access globalError or commit mutation
//     console.log('^&^&^&^', localStorage.getItem('token'))
//     if (localStorage.getItem('token')) {
//       next({ path: '/' })
//     } else {
//       next()
//     }
//   }
//   next()
// })
export default router
