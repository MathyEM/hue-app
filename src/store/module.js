import tinycolor from 'tinycolor2'
import Gradient from "javascript-color-gradient";
import axios from 'axios'

const state = {
    hueBridgeIP: '',
    hueUsername: '',
    groups: {},
    lights: {

    },
    localColors: {
        // hue: 0-359,
        // saturation: 0-100,
        // luminosity: 0-100,
    },
    localGroupColors: {

    },
    convertColorRange: function (prop, from, to, name) {
        if (name == undefined) {
            name = "ikke defineret"
        }
        const propRatio = to/from;
        console.log(name, prop);
        return prop*propRatio;
    },
}
const getters = {
    groups: (state) => {
        const groups = state.groups
        var filteredGroups = {}

        for (const key of Object.keys(groups)) {
            if (groups[key].class !== "TV") {
                filteredGroups[key] = groups[key]
            }
        }
        
        return filteredGroups
    },
    lights: (state) => state.lights,
    localGroupColors: (state) => state.localGroupColors,
    localColors: (state) => state.localColors,
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
}
const mutations = {
    SET_LOCAL_GROUPS(state, payload) {
        state.groups = payload
    },
    SET_LOCAL_GROUP_COLORS(state, payload) {
        state.localGroupColors = payload
    },
    SET_LOCAL_LIGHTS(state, payload) {
        state.lights = payload
    },
    SET_LOCAL_COLORS(state, payload) {
        state.localColors = payload
    },
    SET_HUE_BRIDGE_INFO(state, payload) {
        state.hueBridgeIP = payload.ip
        state.hueUsername = payload.username
    },
}
const actions = {
    async updateLocalGroups({ state, commit, dispatch }, payload) {
        try {
            const response = await axios.get(`https://${state.hueBridgeIP}/api/${state.hueUsername}/groups`)
            commit('SET_LOCAL_GROUPS', response.data)
            console.log("updateLocalGroups: ", response.data)
            await dispatch('updateLocalGroupColors', response.data)
            if (!payload?.lightUpdate) {
                await dispatch('updateLocalLights')
            }
        } catch (error) {
            console.log(error)
        }
    },
    async updateLocalGroupColors(context, payload) {
        const groups = payload
        console.log("updateLocalGroupColors:", payload);
        var colors = {}

        var hsl;
        
        Object.keys(groups).forEach(id => {
            const ct = groups[id].action.ct;
            if (groups[id].action.colormode !== "ct") {
                hsl = context.getters.getHSL(groups[id].action)
            } else {
                hsl = context.getters.colorTempToHSL(ct)
                //adjust color to match the brightness of the light
                let color = tinycolor(`hsl(${hsl.hue}, ${hsl.saturation}%, ${hsl.luminosity}%)`);
                const brightness = context.state.convertColorRange(groups[id].action.bri, 254, 50);
                color = color.darken(50-brightness).toHsl();
                hsl = {
                    hue: color.h,
                    saturation: color.s*100,
                    luminosity: color.l*100,
                }
            }

            colors[id] = {
                hue: hsl.hue,
                saturation: hsl.saturation,
                luminosity: hsl.luminosity,
                ct: ct,
            }
        });
        context.commit('SET_LOCAL_GROUP_COLORS', colors)
    },
    async controlGroup(context, payload) {
        const hsb = payload.hsl ? context.getters.getHSB(payload.hsl) : undefined;

        const id = payload.id
        const on = payload.on
        const hue = hsb ? Math.round(hsb.hue) : undefined
        const sat = hsb ? Math.round(hsb.sat) : undefined
        const bri = hsb ? Math.round(hsb.bri) : undefined
        const ct = payload.ct || undefined
        const bri_inc = payload.bri_inc || undefined

        try {
            await axios.put(
                `https://${context.state.hueBridgeIP}/api/${context.state.hueUsername}/groups/${id}/action`,
                {
                    on,
                    ...(hue && { hue }),
                    ...(sat && { sat }),
                    ...(bri && { bri }),
                    ...(ct && { ct }),
                    ...(bri_inc && { bri_inc }),
                }
            ).then(function(response) {
                console.log("controlGroup",response)
            })
            await context.dispatch('updateLocalGroups')
            
        } catch (error) {
            console.log(error)
        }
    },
    async updateLocalLights({ state, commit, dispatch }) {
        try {
            const response = await axios.get(`https://${state.hueBridgeIP}/api/${state.hueUsername}/lights`)
            commit('SET_LOCAL_LIGHTS', response.data)
            console.log("updateLocalLights: ", response.data[5].state)
            await dispatch('updateLocalColors', response.data)
            await dispatch('updateLocalGroups', { lightUpdate: true })
        } catch (error) {
            console.log(error)
        }
    },
    async updateLocalColors(context, payload) {
        const lights = payload
        console.log("updateLocalColors:", payload)
        var colors = {}

        var hsl
        
        Object.keys(lights).forEach(id => {
            const ct = lights[id].state.ct;
            if (lights[id].state.colormode !== "ct") {
                hsl = context.getters.getHSL(lights[id].state)
            } else {
                hsl = context.getters.colorTempToHSL(ct)
                let color = tinycolor(`hsl(${hsl.hue}, ${hsl.saturation}%, ${hsl.luminosity}%)`)
                const brightness = context.state.convertColorRange(lights[id].state.bri, 254, 50)
                color = color.darken(50-brightness).toHsl()
                hsl = {
                    hue: color.h,
                    saturation: color.s*100,
                    luminosity: color.l*100,
                }
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

        const id = payload.id
        const on = payload.on
        const hue = hsb ? Math.round(hsb.hue) : undefined
        const sat = hsb ? Math.round(hsb.sat) : undefined
        const bri = hsb ? Math.round(hsb.bri) : undefined
        const ct = payload.ct || undefined
        const bri_inc = payload.bri_inc || undefined

        try {
            await axios.put(
                `https://${context.state.hueBridgeIP}/api/${context.state.hueUsername}/lights/${id}/state`,
                {
                    on,
                    ...(hue && { hue }),
                    ...(sat && { sat }),
                    ...(bri && { bri }),
                    ...(ct && { ct }),
                    ...(bri_inc && { bri_inc }),
                }
            ).then(function(response) {
                console.log("controlLight",response)
            })
            await context.dispatch('updateLocalLights')
            
        } catch (error) {
            console.log(error)
        }
    },
}

export default {
    state,
    getters,
    mutations,
    actions
}