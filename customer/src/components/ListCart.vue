<template>
<div>
   <div class='line'></div>
            <table class='order-table'>
            <tbody>
                <tr>
                <td><img class='full-width' :src="listpending.image_url" >
                </td>
                <td>
                    <br> <span class='thin'>{{listpending.name}}</span>
                    <span class='thin small'> stock: {{listpending.stock}}<br><br></span>
                </td>

                </tr>
                <tr>
                <td class="ig">
                  <div class="tombol">
                  <button @click.prevent="del">-</button>
                  <p>   {{listpending.qty}}    </p>
                  <button @click.prevent="addcart">+</button>
                  </div>
                  <p>X {{listpending.price}}</p>
                  <div class='price'>Rp.{{listpending.valore}}</div>
                </td>
                </tr>
            </tbody>

            </table>
</div>
</template>

<script>
import { mapActions } from 'vuex'
import axios from '../axios'
export default {
  name: 'ListCard',
  props: ['listpending'],
  methods: {
    ...mapActions(['fetchPending', 'fetchJmlCart']),
    del () {
      axios({
        method: 'delete',
        url: '/trans',
        headers: {
          token: localStorage.token,
          idalamat: localStorage.idalamat
        },
        data: {
          id: this.listpending.ProductId
        }
      })
        .then(result => {
          this.fetchPending()
          this.fetchJmlCart()
          this.$toasted.global.my_app_info({
            message: 'Delete item in cart success'
          })
        })
        .catch(err => {
          // this.loginstate = false
          console.log(err)
        })
    },
    addcart () {
      axios({
        method: 'post',
        url: '/trans',
        headers: {
          token: localStorage.token,
          idalamat: localStorage.idalamat
        },
        data: {
          id: this.listpending.ProductId,
          price: this.listpending.price
        }
      })
        .then(result => { // this.loginstate = false
          this.$toasted.global.my_app_success({
            message: 'add to cart success'
          })
          this.fetchPending()
          this.fetchJmlCart()
        })
        .catch(err => {
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
.tombol {
  display: flex;
   justify-content: space-around;
   align-items: baseline;
}
</style>
