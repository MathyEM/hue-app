<template>
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
	},
	data () {
		return {
			onClass: undefined
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

$background-color: lightgray;
$on-color: rgb(253, 218, 100);
$slider-color: whitesmoke;

.switch-container {
	display: flex;
	flex-direction: row-reverse;
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
</style>