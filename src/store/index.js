import Vue from 'vue'
import Vuex from 'vuex'
import tinycolor from 'tinycolor2'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		lights: {
	
		},
		localColors: {
			// hue: 0-359,
			// saturation: 0-100,
			// luminosity: 0-100,
		},
		convertColorRange: (prop, from, to) => {
			const propRatio = to/from;
		
			return prop*propRatio;
		},
	},
	getters : {
		getHSL: (state) => (light) => {
			const hue = state.convertColorRange(light.state.hue, 65535, 360); // Convert pHue to radial hue
			const sat = state.convertColorRange(light.state.sat, 254, 100);
			const bri = state.convertColorRange(light.state.bri, 254, 100);
			
			const color = tinycolor(`hsv(${hue},${sat}%,${bri}%)`);

			const hsl = color.toHsl()

			const radialHsl = {
				hue: state.convertColorRange(hsl.h, 360, 359),
				saturation: hsl.s*100,
				luminosity: hsl.l*100
			}

			return radialHsl;
		},
		getHSB: (state) => (hsl) => {
			const hue = hsl.hue
			const sat = hsl.saturation
			const lum = hsl.luminosity
			
			const color = tinycolor(`hsl(${hue},${sat}%,${lum}%)`);

			const hsv = color.toHsv();

			const hsb = {
				hue: state.convertColorRange(hsv.h, 360, 65535),
				sat: state.convertColorRange(hsv.s*100, 100, 254),
				bri: state.convertColorRange(hsv.v*100, 100, 254)
			}

			return hsb;
		},
		getRGB: () => (hsl) => {
			const hue = hsl.hue
			const sat = hsl.saturation
			const lum = hsl.luminosity

			const color = tinycolor(`hsl(${hue},${sat}%,${lum}%)`);

			const rgb = color.toRgb();

			return rgb;
		},
		getHEX: () => (hsl) => {
			const hue = hsl.hue
			const sat = hsl.saturation
			const lum = hsl.luminosity

			const color = tinycolor(`hsl(${hue},${sat}%,${lum}%)`);

			const hex = color.toHex();

			return hex;
		},
	},
	mutations: {
		SET_LOCAL_LIGHTS(state, payload) {
			state.lights = payload;
		},
		SET_LOCAL_COLORS(state, payload) {
			state.localColors = payload;
		},
	},
	actions: {
		async updateLocalLights({ commit, dispatch }) {
			try {
				const response = await axios.get(`http://${process.env.VUE_APP_HUE_BRIDGE_IP}/api/${process.env.VUE_APP_HUE_USERNAME}/lights`)
				commit('SET_LOCAL_LIGHTS', response.data)
				dispatch('updateLocalColors', response.data)	
				console.log("updateLocalLights: ", response.data[5].state)
			} catch (error) {
				console.log(error);
			}
		},
		async updateLocalColors(context, payload) {
			const lights = payload;
			var colors = {};
			
			Object.keys(lights).forEach(id => {
				const hsl = context.getters.getHSL(lights[id]);
				const ct = lights[id].state.ct;
				
				colors[id] = {
					hue: hsl.hue,
					saturation: hsl.saturation,
					luminosity: hsl.luminosity,
					ct: ct,
				}
			});
			context.commit('SET_LOCAL_COLORS', colors)
		},
		async controlLight(context, payload) {
			const hsb = payload.hsl ? context.getters.getHSB(payload.hsl) : undefined;

			const id = payload.id;
			const on = payload.on;
			const hue = hsb ? Math.round(hsb.hue) : undefined;
			const sat = hsb ? Math.round(hsb.sat) : undefined;
			const bri = hsb ? Math.round(hsb.bri) : undefined;
			const ct = payload.ct || undefined;
			const bri_inc = payload.bri_inc || undefined;

			try {
				await axios.put(
					`http://${process.env.VUE_APP_HUE_BRIDGE_IP}/api/${process.env.VUE_APP_HUE_USERNAME}/lights/${id}/state`,
					{
						on,
                        ...(hue && { hue }),
                        ...(sat && { sat }),
						...(bri && { bri }),
						...(ct && { ct }),
						...(bri_inc && { bri_inc }),
					}
				).then(function(response) {
					console.log("controlLight",response);
				})
				await context.dispatch('updateLocalLights');
				
			} catch (error) {
				console.log(error);
			}
		}
	},
	modules: {
	}
})
