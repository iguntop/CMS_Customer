import Vue from 'vue'
import Vuex from 'vuex'
import axios from '../axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    allproduct: [],
    pendingorder: [],
    listaddress: [],
    jmlcart: 0,
    totalprice: 0
  },
  mutations: {
    SET_CART (state, databaru) {
      console.log('==set cart', databaru)
      state.jmlcart = databaru.jmlcart
      state.totalprice = databaru.totalprice
    },
    SET_PRODUCT (state, databaru) {
      state.allproduct = databaru
    },
    SET_PENDING (state, databaru) {
      state.pendingorder = databaru
    },
    SET_ADDRESS (state, databaru) {
      state.listaddress = databaru
    }
  },
  actions: {
    fetchProduct (context, payload) {
      return new Promise((resolve, reject) => {
        axios({
          method: 'GET',
          url: '/product/customer/all'
        })
          .then(result => {
            const newproducts = result.data.data
            context.commit('SET_PRODUCT', newproducts)
            resolve(result)
          })
          .catch(err => {
            console.log(err)
            context.commit('SET_PRODUCT', [])
            reject(err)
          })
      })
    },
    fetchProductbyname (context, findname) {
      axios({
        method: 'GET',
        url: '/product/customer/all'
      })
        .then(result => {
          const newproducts = result.data.data
          const datafilter = newproducts.filter(data => data.name.includes(findname))
          context.commit('SET_PRODUCT', datafilter)
        })
        .catch(err => {
          console.log(err)
          context.commit('SET_PRODUCT', [])
        })
    },
    fetchPending (context, payload) {
      axios({
        method: 'GET',
        url: '/trans/pending',
        headers: {
          token: localStorage.token,
          idalamat: localStorage.idalamat
        }
      })
        .then(result => {
          const data = result.data.data
          const sumsArray = {}
          let sums
          data.forEach(item => {
            sums = sumsArray[item.ProductId]
            if (sums) {
              sums.qty++
              sums.valore += item.price
            } else {
              sumsArray[item.ProductId] = {
                ProductId: item.ProductId,
                name: item.Product.name,
                qty: 1,
                valore: item.price,
                image_url: item.Product.image_url,
                stock: item.Product.stock,
                price: item.Product.price,
                idalamatdefault: localStorage.idalamat
              }
            }
          })
          console.log('<><><><><>', sumsArray)

          context.commit('SET_PENDING', sumsArray)
        })
        .catch(err => {
          console.log(err)
        })
    },
    fetchJmlCart (context, payload) {
      const carttemp = []
      axios({
        method: 'GET',
        url: '/trans/pending',
        headers: {
          token: localStorage.token,
          idalamat: localStorage.idalamat
        }
      })
        .then(result => {
          let data
          let jml = 0
          for (const i in result.data.data) {
            jml += result.data.data[i].price
            carttemp.push(result.data.data[i].ProductId)
          }
          console.log('dataaaaa', carttemp)
          if (carttemp.length !== 0) {
            const uniqueid = carttemp.filter((x, i, a) => a.indexOf(x) === i)
            data = uniqueid.length
          } else {
            data = 0
          }
          context.commit('SET_CART', { jmlcart: data, totalprice: jml })
        })
        .catch(err => {
          console.log(err)
        })
    },
    fetchAddress (context, payload) {
      axios({
        method: 'GET',
        url: '/customerdetail',
        headers: {
          token: localStorage.token,
          idalamat: localStorage.idalamat
        }
      })
        .then(result => {
          const count = result.data.data
          console.log('adddresssss', count)
          context.commit('SET_ADDRESS', count)
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  modules: {
  }
})
