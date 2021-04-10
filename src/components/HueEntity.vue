<template>
    <div>
        <h3 class="lamp-title">{{ id }}: {{ lightName }}</h3>
        <p class="lamp-info">On: {{ state.on }}</p>
        <div class="color-picker-wrapper">
            <ColorPicker class="color-picker" v-bind="color" @input="onInput"></ColorPicker>
            <input type="range" class="saturation" name="saturation" id="saturation" min="0" max="254" v-model="state.sat">
        </div>
        <HueDimmerSwitch :id="id" :state="state" :controlLight="controlLight" />
    </div>
</template>

<script>
import store from '../store'
import axios from 'axios'
import ColorPicker from '@radial-color-picker/vue-color-picker'
import HueDimmerSwitch from './HueDimmerSwitch'
import tinycolor from "tinycolor2"

export default {
    name: 'HueEntity',
    components: {
        ColorPicker,
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
            color: {
                hue: 0,
                saturation: 0,
                luminosity: 50,
                alpha: 1
            },
        }
    },
    methods: {
        getHSL() {
            const hue = this.hueCalcPercent();
            const sat = this.satCalc();
            const bri = this.briCalc();

            const color = tinycolor(`hsv(${hue}%,${sat}%,${bri}%)`);

            const hsl = color.toHsl();
            const hsv = color.toHsv();

            this.color.hue = this.hueCalcRadial();
            this.color.saturation = hsl.s*100;
            this.color.luminosity = hsl.l*100;

            console.log("HSL:", hsl);
            console.log("HSV:", hsv);
        },
        hueCalcPercent() {
            const pHue = this.$props.state.hue;
            const pHueMax = 65535;
            const hueMax = 100;
            const hueRatio = hueMax/pHueMax;

            return pHue*hueRatio
        },
        hueCalcRadial() {
            const pHue = this.$props.state.hue;
            const pHueMax = 65535;
            const hueMax = 359;
            const hueRatio = hueMax/pHueMax;

            return pHue*hueRatio
        },
        satCalc() {
            const pSat = this.$props.state.sat;
            const pSatMax = 254;
            const satMax = 100;
            const satRatio = satMax/pSatMax;

            return pSat*satRatio;
        },
        briCalc() {
            const pBri = this.$props.state.bri;
            const pBriMax = 254;
            const briMax = 100;
            const briRatio = briMax/pBriMax;

            return pBri*briRatio;
        },
        onInput(hue) {
            this.color.hue = hue;
        },
        async controlLight (lightId, on, bri, hue, sat) {
            try {
                let self = this;
                return await axios.put(
                    `http://${process.env.VUE_APP_HUE_BRIDGE_IP}/api/${process.env.VUE_APP_HUE_USERNAME}/lights/${lightId}/state`,
                    {
                        on,
                        ...(bri && { bri }),
                        ...(hue && { hue }),
                        ...(sat && { sat })
                    }
                ).then(function () {
                    let temp = store.state.lights;
                    self.getHSL()
                    if (on !== undefined) {
                        temp[lightId].state.on = on;
                    }
                    if (bri !== undefined) {
                        temp[lightId].state.bri = bri;
                    }
                    if (hue !== undefined) {
                        temp[lightId].state.hue = hue;
                    }
                    if (sat !== undefined) {
                        temp[lightId].state.sat = sat;
                    }

                    store.commit('updateLights', temp);
                    console.log(store.state.lights[lightId].state);
                })
            } catch (error) {
                console.log(error);
            }
        },

    },
    async mounted() {
        this.getHSL();
    }
}
</script>

<style lang="scss">
@import '~@radial-color-picker/vue-color-picker/dist/vue-color-picker.min.css';

.color-picker-wrapper {
    position: relative;

    .color-picker {
        margin: auto;
    }

    .saturation {
        background: red;
        display: inline-block;
        transform: translateX(-50%) translatey(-50%) rotateZ(-90deg);
        pointer-events: all;
        z-index: 1;
        position: absolute;
        top: 50%;
        left: 56%;
    }
}

</style>