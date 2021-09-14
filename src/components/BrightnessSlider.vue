<template>
	<input type="range" class="brightness" name="brightness" id="brightness" :step="brightnessStep" min="1" max="254" :value="brightness" @change="onBriInput">
</template>

<script>
import store from '../store'
import { mapGetters } from 'vuex'

export default {
	name: 'Brightness',
	props: {
		isGroup: Boolean,
		id: String,
		brightnessStep: Number,
	},
	data() {
        return {
            
        }
    },
	computed: {
		...mapGetters(['lights', 'groups']),
        brightness() {
            if (!this.isGroup) { // if not a group
				return this.lights[this.id].state.bri;
			} else {
				return this.groups[this.id].action.bri;
			}
        },
    },
	methods: {
		async onBriInput(e) {
            const brightness = parseInt(e.target.value);

            const payload = {
                id: this.id,
                on: true,
                bri: brightness,
            }

			if (!this.isGroup) { // if light
				await store.dispatch('controlLight', payload)
			} else { // if group
				await store.dispatch('controlGroup', payload)
			}
        }
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

.brightness {
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
		background: linear-gradient(90deg, #433b1e, #ffde72);
	}
}
</style>