<template>
  <div id="app">
    <div>
  <b-navbar toggleable="lg" type="dark" variant="info">
    <b-navbar-brand><strong>G-Ecommers</strong></b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-form>
          <b-form-input size="sm" class="mr-sm-2" placeholder="Search" v-model="productname"></b-form-input>
          <b-button size="sm" class="my-2 my-sm-0" @click.prevent="searchProductbyname(productname)">Search</b-button>
        </b-nav-form>
        <div v-if="loginstate === true" class="login" >
           <b-nav-item @click.prevent="checkout">Cart: {{jmlcart}}</b-nav-item>
        </div>
        <div v-if="loginstate === true" class="login">
          <b-nav-item-dropdown right>
            <!-- Using 'button-content' slot -->
            <template v-slot:button-content>
              <em>{{submittedNames}}</em>
            </template>
            <b-dropdown-item @click.prevent="logout">Log Out</b-dropdown-item>
          </b-nav-item-dropdown>
        </div>
        <div v-else>
          <div>
          <b-nav-item v-b-modal.modal-login>Login</b-nav-item>
          </div>
        </div>
        <div v-if="loginstate === false">
          <b-nav-item v-b-modal.modal-register>register</b-nav-item>
          </div>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</div>
    <div>
    <!-- <div class="mt-3">
      Login
      <div v-if="submittedNames.length === 0">--</div>
      <ul v-else class="mb-0 pl-3">
        <li v-for="(name,idx) in submittedNames" :key="idx">{{ name }}</li>
      </ul>
    </div> -->
    <b-modal
      id="modal-register"
      ref="modal"
      title="REGISTER"
      @show="resetModalRegister"
      @hidden="resetModalRegister"
      @ok="handleOkRegister"
    >
      <form ref="form" @submit.stop.prevent="handleSubmitRegister">
        <b-form-group
          :state="emailState"
          label="email"
          label-for="email"
          invalid-feedback="email is required"
        >
          <b-form-input
            id="email"
            v-model="email"
            :state="emailState"
            required
          ></b-form-input>
          </b-form-group>

          <b-form-group
          :state="passwordState"
          label="password"
          label-for="password"
          invalid-feedback="password is required"
        >
          <b-form-input
            id="password"
            type="password"
            v-model="password"
            :state="passwordState"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group
          :state="repasswordState"
          label="repeat your password"
          label-for="repassword"
          invalid-feedback="password is required"
        >
          <b-form-input
            id="repassword"
            type="password"
            v-model="repassword"
            :state="repasswordState"
            required
          ></b-form-input>
        </b-form-group>
      </form>
    </b-modal>

    <b-modal
      id="modal-login"
      ref="modal"
      title="LOGIN"
      @show="resetModalLogin"
      @hidden="resetModalLogin"
      @ok="handleOkLogin"
    >
      <form ref="form" @submit.stop.prevent="handleSubmitLogin">
        <b-form-group
          :state="emailState"
          label="email"
          label-for="email"
          invalid-feedback="email is required"
        >
          <b-form-input
            id="email"
            v-model="email"
            :state="emailState"
            required
          ></b-form-input>
          </b-form-group>

          <b-form-group
          :state="passwordState"
          label="password"
          label-for="password"
          invalid-feedback="password is required"
        >
          <b-form-input
            id="password"
            type="password"
            v-model="password"
            :state="passwordState"
            required
          ></b-form-input>
        </b-form-group>
      </form>
    </b-modal>
  </div>

    <router-view/>
  </div>
</template>
<script>
import axios from './axios'
import { mapState, mapActions, mapMutations } from 'vuex'
export default {
  data () {
    return {
      email: '',
      emailState: null,
      password: '',
      passwordState: null,
      repassword: '',
      repasswordState: null,
      submittedNames: '',
      loginstate: false,
      productname: ''
    }
  },
  computed: {
    ...mapState(['pendingorder', 'jmlcart'])
  },
  methods: {
    ...mapActions(['fetchPending', 'fetchJmlCart', 'fetchProductbyname']),
    ...mapMutations(['SET_PENDING']),
    handleClickSignIn () {
      this.$gAuth
        .signIn()
        .then(GoogleUser => {
          // on success do something
          console.log('GoogleUser', GoogleUser)
          console.log('getId', GoogleUser.getId())
          console.log('getBasicProfile', GoogleUser.getBasicProfile())
          console.log('getAuthResponse', GoogleUser.getAuthResponse())
          console.log(
            'getAuthResponse',
            this.$gAuth.GoogleAuth.currentUser.get().getAuthResponse()
          )
          this.isSignIn = this.$gAuth.isAuthorized
        })
        .catch(error => {
          // on fail do something
          console.log(error)
        })
    },
    logout () {
      this.loginstate = false
      this.submittedNames = ''
      this.SET_PENDING([])
      localStorage.clear()
      this.$router.push('/')
    },
    checkout () {
      this.$router.push('/checkout')
    },
    searchProductbyname (name) {
      this.fetchProductbyname(name)
    },
    checkFormValidityLogin () {
      const valid = this.$refs.form.checkValidity()
      this.emailState = valid
      this.passwordState = valid
      return valid
    },
    resetModalLogin () {
      this.password = ''
      this.emailState = null
      this.passwordState = null
    },
    handleOkLogin (bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault()
      // Trigger submit handler
      this.handleSubmitLogin()
    },
    handleSubmitLogin () {
      // Exit when the form isn't valid
      if (!this.checkFormValidityLogin()) {
        return
      }
      // Push the name to submitted names
      axios({
        method: 'post',
        url: '/customer/login',
        data: {
          email: this.email,
          password: this.password
        }
      })
        .then(result => {
          this.$toasted.global.my_app_success({
            message: 'Welcome to G-Ecommers'
          })
          localStorage.setItem('token', result.data.token)
          localStorage.setItem('idalamat', result.data.idalamat)
          localStorage.setItem('email', this.email)
          this.fetchPending()
          this.fetchJmlCart()
          this.submittedNames = this.email
          this.loginstate = true
          this.$nextTick(() => {
            this.$bvModal.hide('modal-login')
          })
        })
        .catch(err => {
          this.loginstate = false
          console.log(err)
          this.$toasted.global.my_app_error({
            message: 'Username/Password not Found'
          })
        })
    },
    checkFormValidityRegister () {
      const valid = this.$refs.form.checkValidity()
      this.emailState = valid
      this.passwordState = valid
      return valid
    },
    resetModalRegister () {
      this.password = ''
      this.repassword = ''
      this.emailState = null
      this.passwordState = null
      this.repasswordState = null
    },
    handleOkRegister (bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault()
      // Trigger submit handler
      this.handleSubmitRegister()
    },
    handleSubmitRegister () {
      // Exit when the form isn't valid
      if (!this.checkFormValidityRegister()) {
        return
      }
      // Push the name to submitted names
      if (this.password === this.repassword) {
        axios({
          method: 'post',
          url: '/customer/Register',
          data: {
            email: this.email,
            password: this.password
          }
        })
          .then(result => {
            console.log('>>>', result.data)
            localStorage.setItem('token', result.data.token)
            localStorage.setItem('idalamat', result.data.idalamat)
            localStorage.setItem('email', this.email)
            this.loginstate = true
            this.submittedNames = this.email
            this.fetchPending()
            this.fetchJmlCart()
          })
          .catch(err => {
            console.log(err)
            this.loginstate = false
          })
        // Hide the modal manually
        this.$nextTick(() => {
          this.$bvModal.hide('modal-register')
        })
      } else {
        this.loginstate = false
        console.log('not match pass')
        this.$toasted.global.my_app_error({
          message: 'Password not Match'
        })
      }
    }
  },
  created () {
    this.fetchPending()
    this.fetchJmlCart()
    console.log(this.pendingorder)

    if (localStorage.token) {
      this.loginstate = true
      this.submittedNames = localStorage.email
    } else {
      this.loginstate = false
    }
    this.$toasted.register('my_app_error',
      (payload) => {
        return payload.message
      }, { duration: 1500, theme: 'bubble', type: 'error' }
    )

    this.$toasted.register('my_app_success',
      (payload) => {
        return payload.message
      }, { duration: 1500, theme: 'bubble', type: 'success' }
    )

    this.$toasted.register('my_app_info',
      (payload) => {
        return payload.message
      }, { duration: 1500, theme: 'bubble', type: 'info' }
    )
  }

}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
.container1 {
  width: 100vw;
  display: flex;
  justify-content: space-between;
}
.item {
  color: #42b983;
  display: flex;
  margin: 5px;
}
.login {
  display: flex;
  align-items: baseline;
 margin: 10px;
padding: 10px;
}
.besar {
  padding: 20px;
}
</style>
