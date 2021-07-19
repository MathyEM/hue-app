import GroupList from './components/GroupList.vue'
import GroupEntities from './components/GroupEntities.vue'
import HueEntity from './components/HueEntity.vue'
import HueEntitySmall from './components/HueEntitySmall.vue'
import store from './store/module'

export default {
    install (Vue, options) {
        if (!options || !options.store) {
            throw new Error('Please initialise plugin with a Vuex store.')
        }
        
        options.store.registerModule('hueapp', store)

        Vue.component('GroupList', GroupList)
        Vue.component('GroupEntities', GroupEntities)
        Vue.component('HueEntity', HueEntity)
        Vue.component('HueEntitySmall', HueEntitySmall)
    }
  }

// yarn build --target lib --name local-hue-app src/main-lib.js