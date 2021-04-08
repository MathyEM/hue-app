import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    lights: {}
  },
  mutations: {
    updateLights(state, payload) {
      state.lights = payload
    },

  },
  actions: {
  },
  modules: {
  }
})
