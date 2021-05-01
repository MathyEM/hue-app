<template>
    <div class="entity-wrapper">
        <h3 class="lamp-title">{{ id }}: {{ light.name }}</h3>
        <div v-if="state.hue" class="color-picker-wrapper">
            <CombinedColorPicker :id="id" :onClass="{ 'off': !state.on }" />
            <ColorTemperature :id="id" />
        </div>
        <div v-else class="color-picker-wrapper">
            <ColorPicker class="color-picker white-disabled" :class="{ 'white-on': state.on, 'off': !state.on }" :initially-collapsed="true" />
        </div>
        <HueDimmerSwitch :id="id" @click="whiteColor" />
    </div>
</template>

<script>
import store from '../store';
import ColorPicker from '@radial-color-picker/vue-color-picker';
import CombinedColorPicker from './CombinedColorPicker.vue'
import ColorTemperature from './ColorTemperature.vue';
import HueDimmerSwitch from './HueDimmerSwitch'
import tinycolor from 'tinycolor2'

export default {
    name: 'HueEntity',
    components: {
        ColorPicker,
        ColorTemperature,
        CombinedColorPicker,
        HueDimmerSwitch,
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
        whiteColor() {
            let color = tinycolor('rgb(255, 223, 116)');
            const brightness = store.state.convertColorRange(this.state.bri, 254, 73);  //the tinycolor darken() method goes from 0-100
            color = color.darken(73-brightness).toString();                                     //but at 73, the color goes black.
            let elem = document.querySelector('.color-picker.white-on .rcp__well');
            if (elem) {
                elem.style.backgroundColor = color;
            }
            return color;
        }
    },
    methods: {
        
        
    },
    created() {

    },
    mounted() {
        this.whiteColor
    },
}
</script>

<style lang="scss">
@import '~@radial-color-picker/vue-color-picker/dist/vue-color-picker.min.css';

$border-radius: 4px;
$padding: 1rem;
$plane-depth: 4px;

.entity-wrapper {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    width: 15.5rem;
    padding: $padding;
    margin-bottom: 2rem;

    padding-left: calc(#{$padding} + #{$plane-depth});
    padding-bottom: calc(#{$padding} + #{$plane-depth});

    border-radius: $border-radius;
    background-color: lighten(lightgrey, 15%);
    
    box-shadow: inset 0 0 0 1px hsla(0,0%,0%,.2), /* allround shadow/border */
                // inset 0 4px 1px hsla(0,0%,100%,.5), /* highlight at the top */
                inset -4px 4px 1px hsla(0,0%,100%,.5), /* highlight on the right and at the top */
                inset #{$plane-depth} -#{$plane-depth} 0 hsla(0,0%,0%,.25), /* inner shadow that adds thickness */
                -1px 2px 3px hsla(0,0%,0%,.25);
}

.color-picker-wrapper {
    position: relative;
    width: fit-content;
    margin: auto;
}
</style>