<template>
	<input type="range" class="color-temperature" name="color-temperature" id="color-temperature" min="153" max="500" :value="colorTemperature" @change="onCTInput">
</template>

<script>
import store from '../store'
import tinycolor from 'tinycolor2';
import Gradient from "javascript-color-gradient";

export default {
	name: 'ColorTemperature',
	props: {
		id: String,
		colorTemperature: Number,
	},
	data() {
        return {
            temperatureGradient: Object,
        }
    },
	methods: {
		async onCTInput(e) {
            const colorTemp = parseInt(e.target.value);

            // get the current color temperature as a percentage
            const ctMin = 153;
            const ctMax = 500;
            const ctRatio = 100/(ctMax-ctMin);

            const ctPercent = Math.round(ctRatio*(colorTemp-ctMin));

            // convert the color to hsl
            const color = tinycolor(this.temperatureGradient.getColor(ctPercent));
            const hsl = color.toHsl();

            const payload = {
                id: this.id,
                on: true,
                ct: colorTemp,
            }
            await store.dispatch('controlLight', payload)

            // change localColors
            var temp = store.state.localColors;

            temp[this.id].hue = hsl.h;
            temp[this.id].saturation = hsl.s*100;
            temp[this.id].luminosity = hsl.l*100;

            store.commit('SET_LOCAL_COLORS', temp);
        }
	},
	created() {
        this.temperatureGradient = new Gradient();

        const color0 = "#b1c1ff";
        const color125 = "#d4e0ff";
        const color25 = "#fff8cf";
        const color375 = "#f8fcff";
        const color50 = "#ffeb9b";
        const color625 = "#ffdd6f";
        const color75 = "#ffcf4d";
        const color875 = "#ffc031";
        const color100 = "#ffb11d";

        this.temperatureGradient.setMidpoint(100); // number of steps (individual colors) in the gradient
        
        this.temperatureGradient.setGradient(color0,color125,color25,color375,color50,color625,color75,color875,color100);
    },
}
</script>

<style lang="scss">
.color-temperature {
	position: relative; // This makes the slider clickable even when the color wheel is overlapping
	padding: 1rem 0;
}
</style>