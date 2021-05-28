<template>
	<div id="app">
		<div class="container">
			<GroupList />
			<template v-for="group, g_index in groups">
				<GroupEntities :key="g_index" :id="g_index" />
			</template>
		</div>
	</div>
</template>

<script>
import store from './store'
import GroupEntities from './components/GroupEntities';
import GroupList from './components/GroupList';
import { mapActions } from 'vuex';
import ConfigProvider from '../ConfigProvider';

export default {
	name: 'App',
	components: {
		GroupEntities,
		GroupList,
	},
	data() {
		return {
			pollingInterval: ConfigProvider.value('pollingRate') || 8000,
			updateHueStateInterval: Function,
		};
	},
	computed: {
		groups() {
			const groups = store.state.groups;
			var filteredGroups = {};

			for (const key of Object.keys(groups)) {
				if (groups[key].class !== "TV") {
					filteredGroups[key] = groups[key];
				}
			}
			
			return filteredGroups;
		},
		lights() {
			return store.state.lights;
		},
		localGroupColors() {
			return store.state.localGroupColors;
		}
	},
	methods: {
		...mapActions([
			'updateLocalLights',
			'updateLocalGroups',
		]),
	},
	async mounted() {

	},
	async created() {
		var self = this;
		self;

		this.$data.updateHueStateInterval = setInterval(() => {
			self.updateLocalLights();
		}, this.$data.pollingInterval)

		this.updateLocalLights();
	},
	destroy() {
		clearInterval(this.updateHueStateInterval)
	}
}
</script>

<style lang="scss">
@import './assets/scss/_colors.scss';

:root {
	scroll-behavior: smooth;
}

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
	margin-top: 20px;

	.container {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		flex-direction: column;
		padding: 0 2rem;

		.entity-container {
			margin: 0 1.5rem;
			display: flex;

		}
	}
}
</style>
