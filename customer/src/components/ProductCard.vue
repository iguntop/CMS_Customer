<template>

  <div class="card" style="width:200px">
  <img class="card-img-top" :src="product.image_url" alt="Card image">
  <div class="card-body">
    <h4 class="card-title">{{product.name}}</h4>
    <p class="card-text">productid : {{product.id}}</p>
    <p class="card-text">price : {{product.price}}</p>
    <p class="card-text">stock : {{product.stock}}</p>
  </div>
  <div class="card-footer">
    <button @click.prevent="addcart" class="btn btn-primary">add to cart</button>
  </div>
</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import axios from '../axios'
export default {
  name: 'ProductCard',
  props: ['product'],
  computed: {
    ...mapState(['pendingorder', 'jmlcart', 'totalprice'])
  },
  methods: {
    ...mapActions(['fetchPending', 'fetchJmlCart']),
    addcart () {
      axios({
        method: 'post',
        url: '/trans',
        headers: {
          token: localStorage.token,
          idalamat: localStorage.idalamat
        },
        data: {
          id: this.product.id,
          price: this.product.price
        }
      })
        .then(result => {
          this.fetchPending()
          this.fetchJmlCart()
        })
        .catch(err => {
          // this.loginstate = false
          this.$toasted.global.my_app_error({
            message: 'You have to log in before add to cart'
          })
          console.log(err)
        })
    }
  },
  created () {
    this.fetchPending()
    this.fetchJmlCart()
  }
}
</script>

<style>

</style>
