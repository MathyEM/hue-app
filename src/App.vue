<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png"><br>
    <div v-for="light, index in lights" :key="index">
      <HueEntity :lightName="light.name" :state="light.state" :id="index"/>
    </div>
  </div>
</template>

<script>
import store from './store'
import axios from 'axios'
import HueEntity from './components/HueEntity.vue'

export default {
  name: 'App',
  components: {
    HueEntity
  },
  data() {
    return {

    };
  },
  computed: {
    lights() {
      return store.state.lights;
    }
  },
  async mounted() {
    const response = await axios.get(`http://${process.env.VUE_APP_HUE_BRIDGE_IP}/api/${process.env.VUE_APP_HUE_USERNAME}/lights`);
    store.commit('updateLights', response.data);
    console.log(store.state.lights);
  },
  
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
