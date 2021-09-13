<template>
	<input type="range" class="color-temperature" name="color-temperature" id="color-temperature" :step="colorTemperatureStep" min="153" max="500" :value="color.ct" @change="onCTInput">
</template>

<script>
import store from '../store'
import { mapGetters } from 'vuex'

export default {
	name: 'ColorTemperature',
	props: {
		isGroup: Boolean,
		id: String,
		colorTemperature: Number,
		colorTemperatureStep: Number,
	},
	data() {
        return {
            
        }
    },
	computed: {
		...mapGetters(['localColors', 'localGroupColors']),
        color() {
            if (!this.isGroup) { // if not a group
				return this.localColors[this.id];
			} else {
				return this.localGroupColors[this.id];
			}
        },
    },
	methods: {
		async onCTInput(e) {
            const colorTemp = parseInt(e.target.value);

            const payload = {
                id: this.id,
                on: true,
                ct: colorTemp,
            }

			if (!this.isGroup) { // if light
				await store.dispatch('controlLight', payload)
			} else { // if group
				await store.dispatch('controlGroup', payload)
			}
        }
	},
	created() {
        
    },
}
</script>

<style lang="scss">
$thumb-width: 14px;
$thumb-height: 28px;
$track-height: 10px;
$thumb-margin-top: ( $thumb-height * -0.5 ) + ( $track-height * 0.5 );

* {
	--thumb-color: whitesmoke;
}

.color-temperature {
	position: relative; // This makes the slider clickable even when the color wheel is overlapping
	padding-top: 0.5rem;
	padding-bottom: 0.5rem;
	-webkit-appearance: none;
	background: transparent;

	&:focus {
		outline: none;
	}

	&::-webkit-slider-thumb {
		-webkit-appearance: none;
		border: 1px solid lightgray;
		width: $thumb-width;
		height: $thumb-height;
		border-radius: 3px;
		background: var(--thumb-color);
		cursor: pointer;
		justify-self: center;
		margin-top: $thumb-margin-top; /* You need to specify a margin in Chrome, but in Firefox and IE it is automatic */
	}
	&::-webkit-slider-runnable-track {
		cursor: pointer;
		height: $track-height;
		border: 1px solid lightgray;
		border-radius: 2px;
		background: linear-gradient(90deg, #b1c1ff, #d4e0ff, #fff8cf, #f8fcff, #ffeb9b, #ffdd6f, #ffcf4d, #ffc031, #ffb11d);
	}
}
</style>