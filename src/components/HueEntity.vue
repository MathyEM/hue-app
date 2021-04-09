<template>
    <div>
        <h3>{{ id }}: {{ lightName }}</h3>
        <p>On: {{ state.on }}</p>
        <HueDimmerSwitch :id="id" :state="state" :toggle="controlLight" :brighten="controlLight" :dim="controlLight" />
    </div>
</template>

<script>
import store from '../store'
import axios from 'axios'
import HueDimmerSwitch from './HueDimmerSwitch'

export default {
    name: 'HueEntity',
    components: {
        HueDimmerSwitch
    },
    props: {
        id: {
            type: String,
            required: true
        },
        state: {
            type: Object,
            required: true
        },
        lightName: {
            type: String,
            required: true
        },
    },
    data() {
        return {
        }
    },
    methods: {
        async controlLight (lightId, on) {
            try {
                return await axios.put(
                    `http://${process.env.VUE_APP_HUE_BRIDGE_IP}/api/${process.env.VUE_APP_HUE_USERNAME}/lights/${lightId}/state`,
                    {"on": on}
                ).then(function () {
                    let temp = store.state.lights;
                    temp[lightId].state.on = on;
                    store.commit('updateLights', temp);
                })
            } catch (error) {
                console.log(error);
            }
        }
    }
}
</script>

<style lang="scss">

</style>