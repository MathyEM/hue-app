<template>
	<div>
		<ColorPicker class="color-picker" :class="onClass" v-bind="color" @change="onHueInput" :initially-collapsed="true"></ColorPicker>
		<input type="range" class="range hsl luminosity" name="luminosity" id="luminosity" min="0" max="100" :value="color.luminosity" @change="onLumInput" :style="lumGradient">
		<input type="range" class="range hsl saturation" name="saturation" id="saturation" min="0" max="100" :value="color.saturation" @change="onSatInput" :style="satGradient">
	</div>
</template>

<script>
import store from '../store';
import ColorPicker from '@radial-color-picker/vue-color-picker';


export default {
	name: 'CombinedColorPicker',
	components: {
		ColorPicker,
	},
	props: {
		group: Boolean,
		id: String,
		onClass: Object,
	},
	data() {
		return {
			// lumGradient: Object,
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
		lumGradient() {
			const gradient = {
				'--lum-gradient1': `hsl(${this.color.hue}, ${this.color.saturation}%, 0%)`,
				'--lum-gradient2': `hsl(${this.color.hue}, ${this.color.saturation}%, 50%)`,
				'--lum-gradient3': `hsl(${this.color.hue}, ${this.color.saturation}%, 100%)`,
			}
			return gradient;
		},
		satGradient() {
			const gradient = {
				'--sat-gradient1': `hsl(${this.color.hue}, 0%, ${this.color.luminosity}%)`,
				'--sat-gradient2': `hsl(${this.color.hue}, 100%, ${this.color.luminosity}%)`,
			}
			return gradient;
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

			if (!this.group) {
				store.dispatch('controlLight', payload)
			} else {
				store.dispatch('controlGroup', payload)
			}
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

            if (!this.group) {
				store.dispatch('controlLight', payload)
			} else {
				store.dispatch('controlGroup', payload)
			}
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
            
			if (!this.group) {
				store.dispatch('controlLight', payload)
			} else {
				store.dispatch('controlGroup', payload)
			}
        },
		created: {
			
		}
	}
}
</script>

<style lang="scss">
@import '~@radial-color-picker/vue-color-picker/dist/vue-color-picker.min.css';
$transition-speed: 400ms;
$color-picker-size: 150px;

* {
	--lum-gradient1: #000000;
	--lum-gradient2: #666666;
	--lum-gradient3: #ffffff;

	--sat-gradient1: #000000;
	--sat-gradient2: #ffffff;

}

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

	&.rcp.disabled {
		cursor: initial;
	}

	
}
.color-picker.off .rcp__well {
	background-color: #bfbfbf !important; // !important necessary here, since the original background-color is inline style
}

.color-picker[aria-expanded=true] {
	width: $color-picker-size;
	height: $color-picker-size;
	margin-top: 0%;
	margin-bottom: 2%;

	transition: transform 0.25s cubic-bezier(0.2, 0.3, 0.47, 2), margin $transition-speed*0.8 ease-in-out;
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

	&.luminosity, &.saturation {
		$thumb-width: 12px;
		$thumb-height: 14px;
		$track-height: 8px;
		$thumb-margin-top: ( $thumb-height * -0.55 ) + ( $track-height * 0.45 );

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
			// background: linear-gradient(90deg, #b1c1ff, #d4e0ff, #fff8cf, #f8fcff, #ffeb9b, #ffdd6f, #ffcf4d, #ffc031, #ffb11d);
		}

		&.luminosity {
			left: $lum-left + 20%;

			&::-webkit-slider-runnable-track {
				background: linear-gradient(90deg, var(--lum-gradient1), var(--lum-gradient2), var(--lum-gradient3));
			}
		}

		&.saturation {
			left: $sat-left - 20%;

			&::-webkit-slider-runnable-track {
				background: linear-gradient(90deg, var(--sat-gradient1), var(--sat-gradient2));
			}
		}
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
</style>