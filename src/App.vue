<template>
	<div id="app">
		<img alt="Vue logo" src="./assets/logo.png">
		<div class="container">
			<div class="entity-container" v-for="light, index in lights" :key="index">
				<HueEntity :id="index" />
			</div>
		</div>
	</div>
</template>

<script>
import store from './store'
import HueEntity from './components/HueEntity.vue'
import { mapActions } from 'vuex';

export default {
	name: 'App',
	components: {
		HueEntity
	},
	data() {
		return {
			pollingInterval: process.env.VUE_APP_POLLING_RATE || 5000,
			updateHueStateInterval: Function,
		};
	},
	computed: {
		lights() {
			return store.state.lights;
		},
	},
	methods: {
		...mapActions([
			'updateLocalLights',
		]),
	},
	async mounted() {
		
	},
	created() {
		this.updateLocalLights(this.$data.pollingInterval);

		this.$data.updateHueStateInterval = setInterval(this.updateLocalLights, this.$data.pollingInterval)
	},
	destroy() {
		clearInterval(this.updateHueStateInterval)
	}
}
</script>

<style lang="scss">
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 60px;

	.container {
		display: flex;
		justify-content: center;

		.entity-container {
			padding: 0 2rem;
			display: flex;
		}
	}
}
</style>
