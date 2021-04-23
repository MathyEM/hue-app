<template>
    <div class="entity-wrapper">
        <h3 class="lamp-title">{{ id }}: {{ light.name }}</h3>
        <p class="lamp-info">On: {{ state.on }}</p>
        <div v-if="color.hue" class="color-picker-wrapper">
            <CombinedColorPicker :id="id" :color="color" :onClass="{ 'off': !state.on }" />
            <ColorTemperature :id="id" :colorTemperature="color.ct" />
        </div>
        <div v-else class="color-picker-wrapper">
            <ColorPicker class="color-picker" v-bind="color" :initially-collapsed="true" :disabled="true"></ColorPicker>
        </div>
        <HueDimmerSwitch :id="id" />
    </div>
</template>

<script>
import store from '../store';
import ColorPicker from '@radial-color-picker/vue-color-picker';
import CombinedColorPicker from './CombinedColorPicker.vue'
import ColorTemperature from './ColorTemperature.vue';
import HueDimmerSwitch from './HueDimmerSwitch'

export default {
    name: 'HueEntity',
    components: {
        ColorPicker,
        HueDimmerSwitch,
        ColorTemperature,
        CombinedColorPicker,
    },
    props: {
        id: {
            type: String,
            required: true
        },
    },
    data() {
        return {
            temperatureGradient: Object,
        }
    },
    computed: {
		light() {
			return store.state.lights[this.id];
		},
        state() {
			return store.state.lights[this.id].state;
		},
        color() {
            return store.state.localColors[this.id];
        },
    },
    methods: {
        
        
    },
    created() {
    },
    mounted() {

    },
}
</script>

<style lang="scss">
@import '~@radial-color-picker/vue-color-picker/dist/vue-color-picker.min.css';

.entity-wrapper {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
}

.color-picker-wrapper {
    position: relative;
    width: fit-content;
    margin: auto;
}
</style>