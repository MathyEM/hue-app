import GroupList from './components/GroupList.vue'
import store from './store'

export default {
    install (Vue, options) {
        if (!options || !options.store) {
            throw new Error('Please initialise plugin with a Vuex store.')
        }
        
        options.store.registerModule('hueapp', store)

        Vue.component('group-list', GroupList)
    }
  }