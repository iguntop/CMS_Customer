<template>
  <div class="home">
    <div class="container">
      <div v-show="loading" class="overlay flex flex-column items-center justify-center">
      <spinner size="large" message="loading..."></spinner>
      </div>
    <ProductCard v-for="product in allproduct" :key="product.id" :product="product" />
    </div>

  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import ProductCard from '../components/ProductCard.vue'
import { mapState, mapActions } from 'vuex'
import Spinner from 'vue-simple-spinner'
export default {
  name: 'Home',
  data () {
    return {
      loading: true
    }
  },
  components: {
    ProductCard, Spinner
  },
  methods: {
    ...mapActions(['fetchProduct'])
  },
  computed: {
    ...mapState(['allproduct'])
  },
  created () {
    this.fetchProduct()
      .then(response => {
        this.loading = true
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => {
        this.loading = false
      })
    // this.$store.dispatch('fetchProduct')
  }
}
</script>
<style >
.container {
  display :flex;
  padding: 10px;
}
</style>
