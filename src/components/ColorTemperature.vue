<template>
	<input type="range" class="color-temperature" name="color-temperature" id="color-temperature" min="153" max="500" :value="color.ct" @change="onCTInput">
</template>

<script>
import store from '../store'

export default {
	name: 'ColorTemperature',
	props: {
		group: Boolean,
		id: String,
		colorTemperature: Number,
	},
	data() {
        return {
            
        }
    },
	computed: {
        color() {
            if (!this.group) { // if not a group
				return store.state.localColors[this.id];
			} else {
				return store.state.localGroupColors[this.id];
			}
        },
    },
	methods: {
		async onCTInput(e) {
            const colorTemp = parseInt(e.target.value);

			const hsl = store.getters.colorTempToHSL(colorTemp);

            const payload = {
                id: this.id,
                on: true,
                ct: colorTemp,
            }

			var temp;

			if (!this.group) { // if light
				await store.dispatch('controlLight', payload)
	
				// change localColors
				temp = store.state.localColors;
	
				temp[this.id].hue = hsl.hue;
				temp[this.id].saturation = hsl.saturation;
				temp[this.id].luminosity = hsl.luminosity;
	
				store.commit('SET_LOCAL_COLORS', temp);
			} else { // if group
				await store.dispatch('controlGroup', payload)
	
				// change localColors
				temp = store.state.localGroupColors;
	
				temp[this.id].hue = hsl.hue;
				temp[this.id].saturation = hsl.saturation;
				temp[this.id].luminosity = hsl.luminosity;
	
				store.commit('SET_LOCAL_GROUP_COLORS', temp);
			}
        }
	},
	created() {
        
    },
}
</script>

<style lang="scss">
.color-temperature {
	position: relative; // This makes the slider clickable even when the color wheel is overlapping
	padding: 1rem 0;
}
</style>