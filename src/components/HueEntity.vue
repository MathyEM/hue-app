<template>
    <div class="entity-wrapper">
        <h3 class="lamp-title">{{ id }}: {{ light.name }}</h3>
        <p class="lamp-info">On: {{ state.on }}</p>
        <div v-if="color.hue" class="color-picker-wrapper">
            <ColorPicker class="color-picker" :class="{ 'off': !state.on }" v-bind="color" @change="onHueInput" :initially-collapsed="true"></ColorPicker>
            <input type="range" class="range hsl luminosity" name="luminosity" id="luminosity" min="0" max="100" :value="color.luminosity" @change="onLumInput">
            <input type="range" class="range hsl saturation" name="saturation" id="saturation" min="0" max="100" :value="color.saturation" @change="onSatInput">
            <input type="range" class="color-temperature" name="color-temperature" id="color-temperature" min="153" max="500" :value="color.ct" @change="onCTInput">
        </div>
        <div v-else class="color-picker-wrapper">
            <ColorPicker class="color-picker" v-bind="color" @change="onHueInput" :initially-collapsed="true" :disabled="true"></ColorPicker>
        </div>
        <HueDimmerSwitch :id="id" />
    </div>
</template>

<script>
import store from '../store'
import ColorPicker from '@radial-color-picker/vue-color-picker'
import HueDimmerSwitch from './HueDimmerSwitch'
import tinycolor from 'tinycolor2';

const mired = require('mired');
const ct = require('color-temperature');

export default {
    name: 'HueEntity',
    components: {
        ColorPicker,
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
        onHueInput(hue) {
            const hsl = {
                hue: hue,
                saturation: this.color.saturation,
                luminosity: this.color.luminosity,
            };
            const payload = {
                id: this.id,
                on: true,
                hsl: hsl,
            }
            store.dispatch('controlLight', payload)
        },
        onLumInput(e) {
            const luminosity = e.target.value;

            const hsl = {
                hue: this.color.hue,
                saturation: this.color.saturation,
                luminosity: luminosity,
            };
            const payload = {
                id: this.id,
                on: true,
                hsl: hsl,
            }
            store.dispatch('controlLight', payload)
        },
        onSatInput(e) {
            const saturation = e.target.value;

            const hsl = {
                hue: this.color.hue,
                saturation: saturation,
                luminosity: this.color.luminosity,
            };
            const payload = {
                id: this.id,
                on: true,
                hsl: hsl,
            }
            store.dispatch('controlLight', payload)
        },
        onCTInput(e) {
            const colorTemp = parseInt(e.target.value);

            const k = mired.miredToKelvin(colorTemp);
            const rgb = ct.colorTemperature2rgbUsingTH(k);

            const color = tinycolor({
                r: rgb.red,
                g: rgb.green,
                b: rgb.blue,
            });

            const colorTempHSL = color.toHsl();

            const payload = {
                id: this.id,
                on: true,
                ct: colorTemp,
                colorTempHSL: {
                    hue: colorTempHSL.h,
                    saturation: colorTempHSL.s*100,
                    luminosity: colorTempHSL.l*100,
                },
            }
            store.dispatch('controlLight', payload)
        }
    },
    mounted() {
    },
}
</script>

<style lang="scss">
@import '~@radial-color-picker/vue-color-picker/dist/vue-color-picker.min.css';
$transition-speed: 400ms;
$color-picker-size: 150px;

.entity-wrapper {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
}

.color-picker-wrapper {
    position: relative;
    width: fit-content;
    margin: auto;

    .color-picker {
        width: $color-picker-size;
        height: $color-picker-size;
        margin-top: -25%;
        margin-bottom: -25%;

        &.rcp {
            transition: transform 0.25s cubic-bezier(0.2, 0.3, 0.47, 2), margin $transition-speed*1.2 ease-in-out;
        }

        .rcp__palette { // expansion speed
            transition: transform 0.4s cubic-bezier(0.35, 0, 0.25, 1), opacity 0.4s cubic-bezier(0.35, 0, 0.25, 1);
        }

        .rcp__knob {    // knob contraction speed
            transition: transform 0.25s cubic-bezier(0.35, 0, 0.25, 1);
        }

        .rcp__well.pressed {
            -webkit-animation: rcp-beat 0.35s cubic-bezier(0.35, 0, 0.25, 1) forwards;
            animation: rcp-beat 0.35s cubic-bezier(0.35, 0, 0.25, 1) forwards;
        }

        .rcp__ripple.rippling {
            -webkit-animation: rcp-ripple 0.35s cubic-bezier(0.35, 0, 0.25, 1) forwards;
            animation: rcp-ripple 0.35s cubic-bezier(0.35, 0, 0.25, 1) forwards;
        }

        
    }
    .color-picker.off .rcp__well {
        background-color: #bfbfbf !important;
    }

    .color-picker[aria-expanded=true] {
        width: $color-picker-size;
        height: $color-picker-size;
        margin-top: 0%;
        margin-bottom: 2%;

        transition: transform 0.25s cubic-bezier(0.2, 0.3, 0.47, 2), margin $transition-speed*0.8 ease-in-out;
    }

    .color-temperature {
        position: relative; // This makes the slider clickable even when the color wheel is overlapping
        padding: 1rem 0;
    }

    $sat-left: 72%;
    $lum-left: 28%;
    .hsl {
        display: inline-block;
        pointer-events: none;
        z-index: 1;
        position: absolute;
        top: 35%;
        width: 0;
        opacity: 0;
        transform: translateX(-50%) rotateZ(-90deg);
        transition: $transition-speed*0.7 opacity, $transition-speed*1.2 width, $transition-speed left;

        &.luminosity {
            left: $lum-left + 20%;
        }
    
        &.saturation {
            left: $sat-left - 20%;
        }
    }
    .color-picker[aria-expanded=true]~.luminosity {
        pointer-events: all;
        opacity: 1;
        width: 45%;
        left: $lum-left;
        transition: $transition-speed*0.5 opacity, $transition-speed width, $transition-speed left;
    }
    .color-picker[aria-expanded=true]~.saturation {
        pointer-events: all;
        opacity: 1;
        width: 45%;
        left: $sat-left;
        transition: $transition-speed*0.5 opacity, $transition-speed width, $transition-speed left;
    }
}
</style>