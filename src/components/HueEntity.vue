<template>
    <div>
        <h3 class="lamp-title">{{ id }}: {{ lightName }}</h3>
        <p class="lamp-info">On: {{ state.on }}</p>
        <div class="color-picker-wrapper">
            <ColorPicker class="color-picker" v-bind="color" @change="onHueInput"></ColorPicker>
            <input type="range" class="saturation" name="saturation" id="saturation" min="0" max="254" :value="satCalcPhilips(color.saturation)" @change="onSatInput">
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
const converter = require('@q42philips/hue-color-converter');


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
        getColors() { // Get HSL color for the radial-color-picker
            const hue = this.hueCalcPercent(this.$props.state.hue);
            const sat = this.satCalcPercent(this.$props.state.sat);
            const bri = this.briCalcPercent(this.$props.state.bri);

            const color = tinycolor(`hsv(${hue}%,${sat}%,${bri}%)`);

            const hsl = color.toHsl(); // For radial-color-picker
            const hsv = color.toHsv(); // For Hue lights

            return {hsl, hsv};
        },
        setHSL() { // Set the color for the radial-color-picker
            this.color.hue = this.hueCalcRadial(this.$props.state.hue);
            this.color.saturation = this.getColors().hsl.s*100;
            this.color.luminosity = this.getColors().hsl.l*100;
        },
        hueCalcPercent(hue) { // Used for converting Philips Hue's hue-scale to a 100% scale
            const pHue = hue;
            const pHueMax = 65535;
            const hueMax = 100;
            const hueRatio = hueMax/pHueMax;

            return pHue*hueRatio
        },
        hueCalcRadial(hue) { // Used for converting Philips Hue's hue-scale to a 359deg scale
            const pHue = hue;
            const pHueMax = 65535;
            const hueMax = 359;
            const hueRatio = hueMax/pHueMax;

            return pHue*hueRatio
        },
        hueCalcPhilips(hue) { // Used for converting 100% hue-scale to Philips Hue's scale
            const pHue = hue;
            const pHueMax = 65535;
            const hueMax = 100;
            const hueRatio = pHueMax/hueMax;

            return pHue*hueRatio
        },
        hueCalcRadialToPercent(hue) { // Used for converting 100% hue-scale to Philips Hue's scale
            const pHue = hue;
            const pHueMax = 359;
            const hueMax = 100;
            const hueRatio = hueMax/pHueMax;

            return pHue*hueRatio
        },
        satCalcPercent(sat) { // Used for converting Philips Hue's saturation scale to a 100% scale
            const pSat = sat;
            const pSatMax = 254;
            const satMax = 100;
            const satRatio = satMax/pSatMax;

            return pSat*satRatio;
        },
        satCalcPhilips(sat) { // Used for converting 100% saturation scale to Philips Hue's scale
            const pSat = sat;
            const pSatMax = 254;
            const satMax = 100;
            const satRatio = pSatMax/satMax;

            return pSat*satRatio;
        },
        briCalcPercent(bri) { // Used for converting Philips Hue's brightness scale to a 100% scale
            const pBri = bri;
            const pBriMax = 254;
            const briMax = 100;
            const briRatio = briMax/pBriMax;

            return pBri*briRatio;
        },
        briCalcPhilips(bri) { // Used for converting 100% brightness scale to Philips Hue's scale
            const pBri = bri;
            const pBriMax = 254;
            const briMax = 100;
            const briRatio = pBriMax/briMax;

            return pBri*briRatio;
        },
        onHueInput(hue) {
            this.color.hue = hue;

            // Control the lights
            const color = tinycolor("hsl("+this.hueCalcRadialToPercent(this.color.hue)+"%, "+this.color.saturation+"%, "+this.color.luminosity+"%)");
            const rgbColor = color.toRgb();
            const xyColor = converter.calculateXY(rgbColor.r, rgbColor.g, rgbColor.b, "LCA001");

            console.log(color, rgbColor, xyColor);

            this.controlLightXY(this.$props.id, true, xyColor);
        },
        onSatInput(e) {
            // Change lights locally
            const colorSat = e.target.value;
            this.color.saturation = this.satCalcPercent(colorSat);

            // Control the lights
            const color = tinycolor("hsl("+this.hueCalcRadialToPercent(this.color.hue)+"%, "+this.color.saturation+"%, "+this.color.luminosity+"%)");
            const rgbColor = color.toRgb();
            const xyColor = converter.calculateXY(rgbColor.r, rgbColor.g, rgbColor.b, "LCA001");

            console.log(color, rgbColor, xyColor);

            this.controlLightXY(this.$props.id, true, xyColor);
        },
        async controlLight(lightId, on, bri, hue, sat) {
            try {
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
        async controlLightXY(lightId, on, xy, bri) {
            try {
                return await axios.put(
                    `http://${process.env.VUE_APP_HUE_BRIDGE_IP}/api/${process.env.VUE_APP_HUE_USERNAME}/lights/${lightId}/state`,
                    {
                        on,
                        ...(xy && { xy }),
                        ...(bri && { bri }),
                    }
                ).then(function () {
                    let temp = store.state.lights;
                    if (on !== undefined) {
                        temp[lightId].state.on = on;
                    }
                    if (xy !== undefined) {
                        temp[lightId].state.xy = xy;
                    }
                    if (bri !== undefined) {
                        temp[lightId].state.bri = bri;
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
        this.setHSL();
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