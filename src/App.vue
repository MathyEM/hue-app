<template>
	<div id="app">
		<img alt="Vue logo" src="./assets/logo.png">
		<div class="container">
			<div v-for="group, g_index in groups" :key="g_index" class="group-container">
				<div class="group-header">
					<h1 class="group-title">{{ group.name }}</h1>
					<div class="group-controls">
						<OnOffSwitch :id="g_index.toString()" />
						<div v-if="group.action.hue" class="color-picker-container">
							<div class="color-picker-wrapper">
								<CombinedColorPicker :group="true" :id="g_index.toString()" :onClass="{ 'off': !group.action.on }" />
							</div>
							<ColorTemperature :group="true" :id="g_index.toString()" />
						</div>
						<div v-else class="color-picker-wrapper">
							<!-- <ColorPicker class="color-picker" v-bind="groupColors[g_index]" :initially-collapsed="true" :disabled="true"></ColorPicker> -->
						</div>
					</div>
				</div>
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
// import ColorPicker from '@radial-color-picker/vue-color-picker';
import CombinedColorPicker from './components/CombinedColorPicker.vue'
import ColorTemperature from './components/ColorTemperature.vue';
import OnOffSwitch from './components/OnOffSwitch.vue';
import { mapActions } from 'vuex';

export default {
	name: 'App',
	components: {
		// ColorPicker,
        ColorTemperature,
        CombinedColorPicker,
		HueEntity,
		OnOffSwitch,
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
		groupColors() {
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

		this.updateLocalLights();
		this.updateLocalGroups();	

		this.$data.updateHueStateInterval = setInterval(() => {
			self.updateLocalLights();
			self.updateLocalGroups();
		}, this.$data.pollingInterval)
	},
	destroy() {
		clearInterval(this.updateHueStateInterval)
	}
}
</script>

<style lang="scss">
$margin: 1.5rem;

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
		padding: 0 2rem;

		.group-container {
			align-self: flex-start;
			margin-bottom: 3rem;

			.group-header {
				display: flex;
				flex-wrap: wrap;
				align-items: center;
				margin-bottom: 1rem;

				h1 {
					display: inline-flex;
					flex-wrap: wrap;
					text-align: left;
					margin-right: 2rem;
				}
			}

			.group-controls {
				display: inline-flex;
				align-items: center;
				flex-wrap: wrap;
				margin: 0 1rem;

				.switch-container {
					margin: auto;
				}

				.color-picker-container {
					display: flex;
					margin: 0;
					flex-wrap: wrap;
					justify-content: center;

					.color-picker-wrapper {
						margin: 0 2rem;
						
						.hsl {
							top: 45%;
						}
					}

					.color-temperature {
						margin: 0 2rem;
						
					}
				}
			}

			.group-wrapper {
				display: flex;
				flex-wrap: wrap;
				margin-left: -#{$margin};
			}
			@media screen and (max-width: 649px) {
				.group-wrapper {
					justify-content: center;
				}
				.group-controls {
					margin: auto;
				}
			}
		}

		.entity-container {
			margin: 0 1.5rem;
			display: flex;

		}
	}
}
</style>
