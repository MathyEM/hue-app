<template>
	<div id="app">
		<div class="container">
			<GroupList />
			<template v-for="group, g_index in groups">
				<GroupEntities :key="g_index" :group="group" :id="g_index" />
			</template>
			<h3>Hello</h3>
			<br>
			<HueEntitySmall :isGroup="false" :id="'7'" />
		</div>
	</div>
</template>

<script>
import store from './store'
import GroupEntities from './components/GroupEntities'
import HueEntitySmall from './components/HueEntitySmall'
import GroupList from './components/GroupList'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import ConfigProvider from '../ConfigProvider'

const hueBridgeIP = ConfigProvider.value('hueBridgeIP')
const hueUsername = ConfigProvider.value('hueUsername')

export default {
	name: 'App',
	components: {
		GroupEntities,
		GroupList,
		HueEntitySmall,
	},
	data() {
		return {
			pollingInterval: ConfigProvider.value('pollingRate') || 8000,
			updateHueStateInterval: Function,
			store: store,
		};
	},
	computed: {
		...mapGetters(['groups', 'localGroupColors']),
	},
	methods: {
		...mapActions(['updateLocalLights']),
		...mapMutations(['SET_HUE_BRIDGE_INFO']),
	},
	async mounted() {

	},
	async created() {
		this.SET_HUE_BRIDGE_INFO({ ip: hueBridgeIP, username: hueUsername })
		var self = this;
		self;

		this.$data.updateHueStateInterval = setInterval(() => {
			self.updateLocalLights();
		}, this.$data.pollingInterval)

		this.updateLocalLights();
	},
	beforeDestroy() {
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
