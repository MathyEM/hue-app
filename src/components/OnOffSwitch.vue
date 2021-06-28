<template>
	<div class="switch-container">
		<label class="switch">
			<input type="checkbox" :checked="state.any_on" @change="controlGroup(!state.any_on)">
			<span class="slider round"></span>
		</label>
	</div>
</template>

<script>
import store from '../store'

export default {
	name: 'OnOffSwitch',
	props: {
		group: {
			type: Object,
			required: true
		},
		id: {
			type: String,
			required: true
		},
	},
	computed: {
		action() {
			return this.group.action
		},
		state() {
			return this.group.state
		}
	},
	methods: {
		controlGroup: function(on) {
            const payload = {
                id: this.id,
                on: on,
            }
            return store.dispatch('controlGroup', payload)
        },
	}
}
</script>

<style lang="scss" scoped>
$size: 29px;
$slider-size: $size*0.764706;
$gap: ($size - $slider-size) / 2;

$background-color: lightgray;
$on-color: rgb(253, 218, 100);
$slider-color: whitesmoke;

.switch {
	position: relative;
	display: inline-block;
	z-index: 1; // set to 1 and the button won't be blocked by the overlapping color picker
	width: $size*1.76470588;
	height: $size;
}

.switch input { 
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

/* Rounded sliders */
// .slider.round {
//   border-radius: $size;
// }

// .slider.round:before {
//   border-radius: 50%;
// }
</style>