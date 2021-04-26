<template>
	<div id="app">
		<img alt="Vue logo" src="./assets/logo.png">
		<div class="container">
			<div v-for="(group, g_index) in groups" :key="g_index" class="group-container">
				<h1 class="group-title">{{ group.name }}</h1>
				<div class="group-wrapper">
					<div class="entity-container" v-for="light, l_index in group.lights" :key="l_index">
						<HueEntity :id="light" />
					</div>
				</div>
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
			pollingInterval: process.env.VUE_APP_POLLING_RATE || 8000,
			updateHueStateInterval: Function,
		};
	},
	computed: {
		groups() {
			const groups = store.state.groups;

			var filteredGroups = [];

			console.log("groups:", groups);
			for (const key of Object.keys(groups)) {
				console.log("group", groups[key]);
				if (groups[key].class !== "TV") {
					filteredGroups.push(groups[key]);
				}
			}
			
			return filteredGroups;
		},
		lights() {
			return store.state.lights;
		},
	},
	methods: {
		...mapActions([
			'updateLocalLights',
			'updateLocalGroups',
		]),
	},
	async mounted() {
		this.updateLocalGroups();		
	},
	async created() {
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
		flex-wrap: wrap;
		flex-direction: column;
		padding: 0 3rem;

		.group-container {
			align-self: flex-start;
			margin-bottom: 3rem;

			h1 {
				margin-bottom: 2rem;
				text-align: left;
			}

			.group-wrapper {
				display: flex;
				justify-content: center;
				flex-wrap: wrap;
			}
		}

		.entity-container {
			margin: 0 1.5rem;
			display: flex;

			&:first-child {
				margin-left: 0;
			}
		}
	}
}
</style>
