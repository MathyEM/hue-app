<template>
	<div>
		<ColorPicker class="color-picker" :class="onClass" v-bind="color" @change="onHueInput" :initially-collapsed="true"></ColorPicker>
		<input type="range" class="range hsl luminosity" name="luminosity" id="luminosity" min="0" max="100" :value="color.luminosity" @change="onLumInput">
		<input type="range" class="range hsl saturation" name="saturation" id="saturation" min="0" max="100" :value="color.saturation" @change="onSatInput">
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
		id: String,
		color: Object,
		onClass: Object,
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
	}
}
</script>

<style lang="scss">
@import '~@radial-color-picker/vue-color-picker/dist/vue-color-picker.min.css';
$transition-speed: 400ms;
$color-picker-size: 150px;

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
</style>