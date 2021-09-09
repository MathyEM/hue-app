<template>
	<!-- <div class="switch-container">
		<label class="switch" :class="{ big: big}">
			<input type="checkbox" :checked="onState" @change="control(!onState)">
			<span class="slider round"></span>
		</label>
	</div> -->
	<div class="switch-container">
		<button :class="{ on: onState || onClass===true }" @click="control(true); onClass=true">I</button>
		<button :class="{ on: !onState || onClass===false }" @click="control(false); onClass=false">O</button>
	</div>
</template>

<script>
import store from '../store'
import { mapGetters } from 'vuex';

export default {
	name: 'OnOffSwitch',
	props: {
		isGroup: {
			type: Boolean,
			default: true
		},
		id: {
			type: String,
			required: true,
		},
		big: Boolean,
		onClass: {
			type: Boolean,
			default: undefined,
		}
	},
	computed: {
		...mapGetters(['lights', 'groups']),
		light() {
            if (!this.isGroup) {
                return this.lights[this.id]
            }
            return this.groups[this.id]
		},
		onState() {
			if (!this.isGroup) {
                return this.light.state.on
            }
			return this.light.state.any_on
		}
	},
	methods: {
		control: function(on) {
            const payload = {
                id: this.id,
                on: on,
            }
			if (!this.isGroup) {
                return store.dispatch('controlLight', payload)
            }
            return store.dispatch('controlGroup', payload)
        },
	}
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/_colors.scss';
@import '../assets/scss/_btn-vars.scss';

$size: 29px;
$slider-size: $size*0.764706;
$gap: ($size - $slider-size) / 2;

.big {
	$size: $size * 2;
	$slider-size: $slider-size * 2;
	$gap: $gap * 2;
}

$background-color: lightgray;
$on-color: rgb(253, 218, 100);
$slider-color: whitesmoke;

.switch-container {
	display: flex;
	flex-direction: row;
	aspect-ratio: 2;
	height: 100%;

	button {
		width: 2rem;
		border: 1px $lightgray solid;
		color: $gray;

		&:active, &.on {
			background-color: darken($off-white, 9%);
			border-color: darken($lightgray, 7%);;
		}
	}
}

.switch {
	position: relative;
	display: inline-block;
	z-index: 1; // set to 1 and the button won't be blocked by the overlapping color picker
	width: $size*1.76470588;
	height: $size;

	input { 
		opacity: 0;
		width: 0;
		height: 0;
	}

	.slider {
		position: absolute;
		cursor: pointer;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: $background-color;
		-webkit-transition: .4s;
		transition: .4s;
	}

	.slider:before {
		position: absolute;
		content: "";
		height: $slider-size;
		width: $slider-size;
		left: $gap;
		bottom: $gap;
		background-color: $slider-color;
		-webkit-transition: .4s;
		transition: .4s;
	}

	input:checked + .slider {
		background-color: $on-color;
	}

	input:focus + .slider {
		box-shadow: 0 0 1px $background-color;
	}

	input:checked + .slider:before {
		transform: translateX($slider-size);
	}

	&.big {
		width: ($size*1.76470588) * 2;
		height: $size * 2;

		.slider:before {
			height: $slider-size * 2;
			width: $slider-size * 2;
			left: $gap * 2;
			bottom: $gap * 2;
		}
		
		input:checked + .slider:before {
			transform: translateX($slider-size * 2);
		}
	}

	/* Rounded sliders */
	// .slider.round {
		//   border-radius: $size;
	// }

	// .slider.round:before {
		//   border-radius: 50%;
	// }
}
</style>