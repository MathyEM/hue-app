<template>
	<div>
		<label class="switch">
			<input type="checkbox" :checked="action.on" @change="controlGroup(!action.on)">
			<span class="slider round"></span>
		</label>
	</div>
</template>

<script>
import store from '../store'

export default {
	name: 'OnOffSwitch',
	props: {
		id: {
			type: String,
			required: true
		},
	},
	computed: {
		group() {
			return store.state.groups[this.id];
		},
		action() {
			return store.state.groups[this.id].action;
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
$size: 34px;
$ball-size: $size*0.764706;
$gap: ($size - $ball-size) / 2;

.switch {
  position: relative;
  display: inline-block;
  margin: 0.5rem;
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
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
	position: absolute;
	content: "";
	height: $ball-size;
	width: $ball-size;
	left: $gap;
	bottom: $gap;
	background-color: white;
	-webkit-transition: .4s;
	transition: .4s;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  transform: translateX($ball-size);
}

/* Rounded sliders */
.slider.round {
  border-radius: $size;
}

.slider.round:before {
  border-radius: 50%;
}
</style>