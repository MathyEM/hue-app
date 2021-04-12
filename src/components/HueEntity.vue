<template>
    <div>
        <h3 class="lamp-title">{{ id }}: {{ lightName }}</h3>
        <p class="lamp-info">On: {{ state.on }}</p>
        <div class="color-picker-wrapper">
            <ColorPicker class="color-picker" v-bind="localColor" @change="onHueInput"></ColorPicker>
            <input type="range" class="saturation" name="saturation" id="saturation" min="0" max="254" :value="$store.state.convertColorRange(localColor.saturation, 100, 254)" @change="onSatInput">
        </div>
        <HueDimmerSwitch :id="id" :state="state" :controlLight="controlLight" />
    </div>
</template>

<script>
import store from '../store'
import axios from 'axios'
import ColorPicker from '@radial-color-picker/vue-color-picker'
import HueDimmerSwitch from './HueDimmerSwitch'
// import tinycolor from "tinycolor2"
// const converter = require('@q42philips/hue-color-converter');


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
        localColor: {
            type: Object,
            required: true
        }
    },
    data() {
        return {

        }
    },
    methods: {
        onHueInput(hue) {
            let temp = store.state.localColor;
            temp[this.id].hue = Math.round(hue);

            console.log("localColor", store.state.localColor[this.id]);
            store.commit('updateLocalColor', temp);

            // store.commit('setHSL');

            const xyColor = store.getters.getLocalColorXY(this.id);

            this.controlLightXY(this.$props.id, true, xyColor);
        },
        onSatInput(e) {
            // Change lights locally
            //const colorSat = e.target.value;
            //this.color.saturation = this.satCalcPercent(colorSat);
            e;
            const xyColor= store.getters.getLocalColorXY(this.id);

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
                    // console.log(store.state.lights[lightId].state);
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
                    // console.log(store.state.lights[lightId].state);
                })
            } catch (error) {
                console.log(error);
            }
        },

    },
    async mounted() {

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