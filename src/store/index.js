import tinycolor from 'tinycolor2';
import Vue from 'vue'
import Vuex from 'vuex'
const converter = require('@q42philips/hue-color-converter')

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    lights: {},
    localColor: [],
    convertColorRange: (prop, from, to) => {
      const propRatio = to/from;

      return prop*propRatio;
    }
  },
  getters: {
    getLocalColorXY: (state) => (id) => {
      const hue = state.convertColorRange(state.localColor[id].hue, 359, 360);
      const sat = state.localColor[id].saturation;
      const lum = state.localColor[id].luminosity;
      // Control the lights
      const color = tinycolor("hsl("+hue+", "+sat+"%, "+lum+"%)");
      const rgbColor = color.toRgb();
      const xyColor = converter.calculateXY(rgbColor.r, rgbColor.g, rgbColor.b);
      console.log("rgb:", rgbColor);

      return xyColor;
    },
  },
  mutations: {
    updateLights(state, payload) {
      state.lights = payload
    },
    updateLocalColor(state, payload) {
      state.localColor = payload
    },
    setHSL(state) {
      const lights = state.lights;
      let radialHslArr = [];
      class radialHsl {
        constructor(hue, sat, lum, alpha) {
          this.hue = hue;
          this.saturation = sat;
          this.luminosity = lum;
          this.alpha = alpha;
        }
      }

      Object.keys(lights).forEach(id => {
        const hue = state.convertColorRange(lights[id].state.hue, 65535, 359);
        const sat = state.convertColorRange(lights[id].state.sat, 254, 100);
        const bri = state.convertColorRange(lights[id].state.bri, 254, 100);

        
        const color = tinycolor(`hsv(${hue},${sat}%,${bri}%)`);
        const hsl = color.toHsl();

        radialHslArr[id] = new radialHsl(Math.round(hsl.h), Math.round(hsl.s)*100, Math.round(hsl.l*100), hsl.a)
      });

      state.localColor = [...radialHslArr];
    },
  },
  actions: {

  },
  modules: {
  }
})
