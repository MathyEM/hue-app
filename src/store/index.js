import Vue from 'vue'
import Vuex from 'vuex'
import tinycolor from 'tinycolor2'
import Gradient from "javascript-color-gradient";
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		groups: {

		},
		lights: {
	
		},
		localColors: {
			// hue: 0-359,
			// saturation: 0-100,
			// luminosity: 0-100,
		},
		localGroupColors: {

		},
		convertColorRange: (prop, from, to) => {
			const propRatio = to/from;
		
			return prop*propRatio;
		},
	},
	getters: {
		getHSL: (state) => (light) => {
			const hue = state.convertColorRange(light.hue, 65535, 360); // Convert pHue to radial hue
			const sat = state.convertColorRange(light.sat, 254, 100);
			const bri = state.convertColorRange(light.bri, 254, 100);
			
			const color = tinycolor(`hsv(${hue},${sat}%,${bri}%)`);

			const hsl = color.toHsl();

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
		getCT: () => (ctPercent) => { // ct = 0-100 scale
			let temperatureGradient = new Gradient();

			const color0 = "#b1c1ff";
			const color125 = "#d4e0ff";
			const color25 = "#fff8cf";
			const color375 = "#f8fcff";
			const color50 = "#ffeb9b";
			const color625 = "#ffdd6f";
			const color75 = "#ffcf4d";
			const color875 = "#ffc031";
			const color100 = "#ffb11d";

			temperatureGradient.setMidpoint(100); // number of steps (individual colors) in the gradient
			
			temperatureGradient.setGradient(color0,color125,color25,color375,color50,color625,color75,color875,color100);

			return temperatureGradient.getColor(ctPercent);
		},
		colorTempToHSL: (state, getters) => (colorTemp) => {
			state;
            // get the current color temperature as a percentage
            const ctMin = 153;
            const ctMax = 500;
            const ctRatio = 100/(ctMax-ctMin);

            const ctPercent = Math.round(ctRatio*(colorTemp-ctMin));

            // convert the color to hsl
            const color = tinycolor(getters.getCT(ctPercent));
            const hsl = color.toHsl();

			const radialHsl = {
				hue: state.convertColorRange(hsl.h, 360, 359),
				saturation: hsl.s*100,
				luminosity: hsl.l*100,
				ct: colorTemp,
			}

			// console.log("radialHSL:", radialHsl);

			return radialHsl;
		}
	},
	mutations: {
		SET_LOCAL_GROUPS(state, payload) {
			state.groups = payload;
		},
		SET_LOCAL_GROUP_COLORS(state, payload) {
			state.localGroupColors = payload;
		},
		SET_LOCAL_LIGHTS(state, payload) {
			state.lights = payload;
		},
		SET_LOCAL_COLORS(state, payload) {
			state.localColors = payload;
		},
	},
	actions: {
		async updateLocalGroups({ commit, dispatch }) {
			try {
				const response = await axios.get(`http://${process.env.VUE_APP_HUE_BRIDGE_IP}/api/${process.env.VUE_APP_HUE_USERNAME}/groups`)
				commit('SET_LOCAL_GROUPS', response.data)
				console.log("updateLocalGroups: ", response.data)
				dispatch('updateLocalGroupColors', response.data)
			} catch (error) {
				console.log(error);
			}
		},
		async updateLocalGroupColors(context, payload) {
			const groups = payload;
			console.log("updateLocalGroupColors:", payload);
			var colors = {};

			var hsl;
			
			Object.keys(groups).forEach(id => {
				const ct = groups[id].action.ct;
				if (groups[id].action.colormode !== "ct") {
					hsl = context.getters.getHSL(groups[id].action)
				} else {
					hsl = context.getters.colorTempToHSL(ct)
				}

				colors[id] = {
					hue: hsl.hue,
					saturation: hsl.saturation,
					luminosity: hsl.luminosity,
					ct: ct,
				}
			});
			context.commit('SET_LOCAL_GROUP_COLORS', colors);
			await context.dispatch('updateLocalLights');
		},
		async controlGroup(context, payload) {
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
					`http://${process.env.VUE_APP_HUE_BRIDGE_IP}/api/${process.env.VUE_APP_HUE_USERNAME}/groups/${id}/action`,
					{
						on,
						...(hue && { hue }),
						...(sat && { sat }),
						...(bri && { bri }),
						...(ct && { ct }),
						...(bri_inc && { bri_inc }),
					}
				).then(function(response) {
					console.log("controlGroup",response);
				})
				await context.dispatch('updateLocalGroups');
				
			} catch (error) {
				console.log(error);
			}
		},
		async updateLocalLights({ commit, dispatch }) {
			try {
				const response = await axios.get(`http://${process.env.VUE_APP_HUE_BRIDGE_IP}/api/${process.env.VUE_APP_HUE_USERNAME}/lights`)
				commit('SET_LOCAL_LIGHTS', response.data)
				console.log("updateLocalLights: ", response.data[5].state)
				dispatch('updateLocalColors', response.data)	
			} catch (error) {
				console.log(error);
			}
		},
		async updateLocalColors(context, payload) {
			const lights = payload;
			console.log("updateLocalColors:", payload);
			var colors = {};

			var hsl;
			
			Object.keys(lights).forEach(id => {
				const ct = lights[id].state.ct;
				if (lights[id].state.colormode !== "ct") {
					hsl = context.getters.getHSL(lights[id].state);
				} else {
					hsl = context.getters.colorTempToHSL(ct)
				}

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
		},
	},
	modules: {
	}
})
