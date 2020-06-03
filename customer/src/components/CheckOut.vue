<template >
<div>
    <div class='containercheckout'>
    <div class='window'>
        <div class='order-info'>
        <div class='order-info-content'>
            <h2>Order Summary</h2>
             <ListCart v-for="(listpending,idx) in pendingorder" :key="idx" :listpending="listpending"/>
            <div class='line'></div>
    </div>
    </div>
            <div class='credit-info'>
            <div class='credit-info-content'>
                <table class='half-input-table'>
                <div class="mt-3">Select address</div>
                <b-form-select class="mb-3" v-model="selected">
                <b-form-select-option  v-for="address in listaddress" :key="address.id"  :value="{id:address.id,name:address.name}">{{address.name}} / {{address.address}} </b-form-select-option>
                </b-form-select>
                New address name
                <input class='input-field' v-model="addressname">
                New address
                <input class='input-field' v-model="addressroad">
                <button @click.prevent="addAddress">Add New address</button>
                </table>
                payent Method
                <b-form-select v-model="paymentmethod" class="mb-3">
                <b-form-select-option value="Transfer" selected>Transfer</b-form-select-option>
                <b-form-select-option value="COD" >Cash On Delivery</b-form-select-option>
                </b-form-select>
                <button class='pay-btn' @click.prevent="checkout">Checkout</button>
                <button class='can-btn' @click.prevent="cancel">cancel</button>
        <div class='total'>
            <span style='float:left;' >
                TOTAL
            </span>
            <span style='float:right; text-align:right;'>
                Rp. {{totalprice}}
            </span>
            </div>
            </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import ListCart from '../components/ListCart.vue'
import { mapState, mapActions } from 'vuex'
import axios from '../axios'
export default {
  name: 'Checkout',
  data () {
    return {
      paymentmethod: 'Transfer',
      selected: '',
      addressname: '',
      addressroad: '',
      unix: 0
    }
  },
  components: {
    ListCart
  },
  computed: {
    ...mapState(['pendingorder', 'listaddress', 'jmlcart', 'totalprice'])
  },
  methods: {
    ...mapActions(['fetchPending', 'fetchAddress', 'fetchProduct', 'fetchJmlCart']),
    addAddress () {
      if (this.addressroad !== '' && this.addressname !== '') {
        axios({
          method: 'post',
          url: '/customerdetail',
          headers: {
            token: localStorage.token
          },
          data: {
            name: this.addressname,
            address: this.addressroad
          }
        })
          .then(result => {
            this.fetchAddress()
            this.addressname = ''
            this.addressroad = ''
            this.$toasted.global.my_app_success({
              message: 'Add New Address success'
            })
          })
      } else {
        this.$toasted.global.my_app_error({
          message: 'New Address name and New address is required'
        })
      }
    },
    checkout () {
      console.log('PENDING ORDER', this.pendingorder)
      console.log('=======', this.selected.id, this.selected.name, this.jmlcart)
      if (this.selected.name !== undefined && this.selected.name !== 'default' && this.selected.id !== '' && this.jmlcart !== 0) {
        const dt = new Date()
        this.unix = dt.getYear() + dt.getDay() + dt.getMonth() + dt.getHours() + dt.getMinutes() + dt.getSeconds()
        axios({
          method: 'post',
          url: '/mastertransaction',
          data: {
            number_trans: this.unix,
            total_price: this.totalprice
          }
        })
          .then(master => {
            for (const i in this.pendingorder) {
              console.log('alamat defaulttt', this.pendingorder[i].idalamatdefault)
              axios({
                method: 'put',
                url: '/trans',
                headers: {
                  token: localStorage.token
                },
                data: {
                  masterid: master.id,
                  id_alamat_default: this.pendingorder[i].idalamatdefault
                }
              })
            }
            axios({
              method: 'post',
              url: '/trans/mail',
              headers: {
                token: localStorage.token
              },
              data: {
                number_trans: this.unix,
                total_price: this.totalprice,
                email: localStorage.email
              }
            })
              .then(hsl => {
                console.log(hsl)
              })
              .catch(err => {
                console.log(err)
              })

            this.$toasted.global.my_app_success({
              message: 'Purchasing Confirm'
            })
            this.fetchProduct()
              .then(response => {
                this.fetchPending()
                this.fetchJmlCart()
                this.$router.push('/')
              })
              .catch(err => {
                console.log(err)
              })
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        this.$toasted.global.my_app_error({
          message: 'Address is required / Cart Empty'
        })
      }
    },
    cancel () {
      this.$router.push('/')
    }
  },
  created () {
    this.fetchJmlCart()
    this.fetchPending()
    this.fetchAddress()
    this.fetchProduct()
    if (!localStorage.token) {
      this.$router.push('/')
    }
  }
}
</script>

<style>
@import url(https://fonts.googleapis.com/css?family=Lato:400,300,700);
body,html {
  height:100%;
  margin:0;
  font-family:lato;
}

h2 {
  margin-bottom:0px;
  margin-top:25px;
  text-align:center;
  font-weight:200;
  font-size:19px;
  font-size:1.2rem;

}
.containercheckout {
  height:100%;
  -webkit-box-pack:center;
  -webkit-justify-content:center;
      -ms-flex-pack:center;
          justify-content:center;
  -webkit-box-align:center;
  -webkit-align-items:center;
      -ms-flex-align:center;
          align-items:center;
  display:-webkit-box;
  display:-webkit-flex;
  display:-ms-flexbox;
  display:flex;
  justify-content: center;
  background:-webkit-linear-gradient(#c5e5e5, #ccddf9);
  background:linear-gradient(#c9e5e9,#ccddf9);
}
.dropdown-select.visible {
  display:block;
}
.dropdown {
  position:relative;
}
ul {
  margin:0;
  padding:0;
}
ul li {
  list-style:none;
  padding-left:10px;
  cursor:pointer;
}
ul li:hover {
  background:rgba(255,255,255,0.1);
}
.dropdown-select {
  position:absolute;
  background:#77aaee;
  text-align:left;
  box-shadow:0px 3px 5px 0px rgba(0,0,0,0.1);
  border-bottom-right-radius:5px;
  border-bottom-left-radius:5px;
  width:90%;
  left:2px;
  line-height:2em;
  margin-top:2px;
  box-sizing:border-box;
}
.thin {
  font-weight:400;
}
.small {
  font-size:12px;
  font-size:.8rem;
}
.half-input-table {
  border-collapse:collapse;
  width:100%;
}
.half-input-table td:first-of-type {
  border-right:10px solid #4488dd;
  width:50%;
}
.window {
  height:540px;
  width:800px;
  background:#fff;
  display:-webkit-box;
  display:-webkit-flex;
  display:-ms-flexbox;
  display:flex;
  box-shadow: 0px 15px 50px 10px rgba(0, 0, 0, 0.2);
  border-radius:30px;
  z-index:10;
}
.order-info {
  height:100%;
  width:50%;
  padding-left:25px;
  padding-right:25px;
  box-sizing:border-box;
  display:-webkit-box;
  display:-webkit-flex;
  display:-ms-flexbox;
  display:flex;
  -webkit-box-pack:center;
  -webkit-justify-content:center;
      -ms-flex-pack:center;
          justify-content:center;
  position:relative;
}
.price {
  bottom:0px;
  position:absolute;
  right:0px;
  color:#4488dd;
}
.order-table td:first-of-type {
  width:25%;
}
.order-table {
    position:relative;
}
.line {
  height:1px;
  width:100%;
  margin-top:10px;
  margin-bottom:10px;
  background:#ddd;
}
.order-table td:last-of-type {
  vertical-align:top;
  padding-left:25px;
}
.order-info-content {
  table-layout:flex;
  overflow: scroll;
  width: 100%;
}

.full-width {
  width:100%;
}
.pay-btn {
  border:none;
  background:#22b877;
  line-height:2em;
  border-radius:10px;
  font-size:19px;
  font-size:1.2rem;
  color:#fff;
  cursor:pointer;
  position:absolute;
  bottom:75px;
  width:calc(100% - 50px);
  -webkit-transition:all .2s ease;
          transition:all .2s ease;
}
.pay-btn:hover {
  background:#22a877;
    color:#eee;
  -webkit-transition:all .2s ease;
          transition:all .2s ease;
}

.can-btn {
  border:none;
  background:#22b877;
  line-height:2em;
  border-radius:10px;
  font-size:19px;
  font-size:1.2rem;
  color:#fff;
  cursor:pointer;
  position:absolute;
  bottom:25px;
  width:calc(100% - 50px);
  -webkit-transition:all .2s ease;
          transition:all .2s ease;
}
.can-btn:hover {
  background:#22a877;
    color:#eee;
  -webkit-transition:all .2s ease;
          transition:all .2s ease;
}
.total {
  margin-top:0px;
  font-size:20px;
  font-size:1.3rem;
  position:absolute;
  top:10px;
  right:27px;
  left:35px;
}
.dense {
  line-height:1.2em;
  font-size:16px;
  font-size:1rem;
}
.input-field {
  background:rgba(255,255,255,0.1);
  margin-bottom:10px;
  margin-top:3px;
  line-height:1.5em;
  font-size:20px;
  font-size:1.3rem;
  border:none;
  padding:5px 10px 5px 10px;
  color:#fff;
  box-sizing:border-box;
  width:100%;
  margin-left:auto;
  margin-right:auto;
}
.credit-info {
  background:#4488dd;
  height:100%;
  width:50%;
  color:#eee;
  -webkit-box-pack:center;
  -webkit-justify-content:center;
      -ms-flex-pack:center;
          justify-content:center;
  font-size:14px;
  font-size:.9rem;
  display:-webkit-box;
  display:-webkit-flex;
  display:-ms-flexbox;
  display:flex;
  box-sizing:border-box;
  padding-left:25px;
  padding-right:25px;
  border-top-right-radius:30px;
  border-bottom-right-radius:30px;
  position:relative;
}
.dropdown-btn {
  background:rgba(255,255,255,0.1);
  width:100%;
  border-radius:5px;
  text-align:center;
  line-height:1.5em;
  cursor:pointer;
  position:relative;
  -webkit-transition:background .2s ease;
          transition:background .2s ease;
}
.dropdown-btn:after {
  content: '\25BE';
  right:8px;
  position:absolute;
}
.dropdown-btn:hover {
  background:rgba(255,255,255,0.2);
  -webkit-transition:background .2s ease;
          transition:background .2s ease;
}
.dropdown-select {
  display:none;
}
.credit-card-image {
  display:block;
  max-height:80px;
  margin-left:auto;
  margin-right:auto;
  margin-top:35px;
  margin-bottom:15px;
}
.credit-info-content {
  margin-top:25px;
  -webkit-flex-flow:column;
      -ms-flex-flow:column;
          flex-flow:column;
  display:-webkit-box;
  display:-webkit-flex;
  display:-ms-flexbox;
  display:flex;
  width:100%;
}
@media (max-width: 600px) {
  .window {
    width: 100%;
    height: 100%;
    display:block;
    border-radius:0px;
  }
  .order-info {
    width:100%;
    height:auto;
    padding-bottom:100px;
    border-radius:0px;
  }
  .credit-info {
    width:100%;
    height:auto;
    padding-bottom:100px;
    border-radius:0px;
  }
  .pay-btn {
    border-radius:0px;
  }
}
</style>
