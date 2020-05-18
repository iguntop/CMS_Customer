<template>
  <div id="app">
    <div id="nav" >
      <nav class="navbar navbar-expand-sm bg-light navbar-light ">
        <div class="container1">
          <div class="item">
            <router-link to="/"><strong>G-Ecommers</strong> </router-link>
          </div>
          <div class="item">
            <div v-if="loginstate === true" class="login">
              <div class="item besar">
              <p>{{submittedNames}}</p>
              </div>
              <div class="item besar">
              <router-link to="/checkout">Cart: {{jmlcart}} </router-link>
              </div>
              <div class="item">
              <button @click.prevent="logout">logout</button>
              </div>
            </div>
            <div v-else class="login">
            <button v-b-modal.modal-login>Login</button>
            <button v-b-modal.modal-register>register</button>
            <!-- <button @click.prevent="handleClickSignIn">login with Gmail</button> -->
            </div>

          </div>
        </div>
      </nav>
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
      loginstate: false
    }
  },
  computed: {
    ...mapState(['pendingorder', 'jmlcart'])
  },
  methods: {
    ...mapActions(['fetchPending', 'fetchJmlCart']),
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
          console.log('>>>', result.data)
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
