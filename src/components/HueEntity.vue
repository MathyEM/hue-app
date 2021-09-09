<template>
    <div v-if="isGroup" class="entity-wrapper">
        <a :href="'#group-' + id">
            <h3 class="lamp-title">{{ group.name }}</h3>
        </a>
        <div v-if="group.action.hue" class="color-picker-wrapper">
            <CombinedColorPicker :id="id" :onClass="{ 'off': !group.state.any_on }" :isGroup="isGroup" />
            <ColorTemperature :id="id" :isGroup="isGroup" />
        </div>
        <div v-else class="color-picker-wrapper">
            <ColorPicker
                v-bind="whiteColor"
                class="color-picker white-disabled"
                :class="{ 'white-on': group.state.any_on, 'off': !group.state.any_on }"
                :initially-collapsed="true"
            />
        </div>
        <HueDimmerSwitch :id="id" :isGroup="isGroup" />
    </div>
    
    <div v-else class="entity-wrapper">
        <h3 class="lamp-title">{{ light.name }}</h3>
        <div v-if="state.hue" class="color-picker-wrapper">
            <CombinedColorPicker :id="id" :onClass="{ 'off': !state.on }" />
            <ColorTemperature :id="id" />
        </div>
        <div v-else class="color-picker-wrapper">
            <ColorPicker
                v-bind="whiteColor"
                class="color-picker white-disabled"
                :class="{ 'white-on': state.on, 'off': !state.on }"
                :initially-collapsed="true"
            />
        </div>
        <HueDimmerSwitch :id="id" />
    </div>
</template>

<script>
import ColorPicker from '@radial-color-picker/vue-color-picker'
import CombinedColorPicker from './CombinedColorPicker.vue'
import ColorTemperature from './ColorTemperature.vue'
import HueDimmerSwitch from './HueDimmerSwitch'
import tinycolor from 'tinycolor2'
import store from '@/store'
import { mapGetters } from 'vuex';

export default {
    name: 'HueEntity',
    components: {
        ColorPicker,
        ColorTemperature,
        CombinedColorPicker,
        HueDimmerSwitch,
    },
    props: {
        group: {
            type: Object,
            required: true
        },
        id: {
            type: String,
            required: true
        },
        isGroup: Boolean,
    },
    data() {
        return {
            
        }
    },
    computed: {
		...mapGetters(['lights']),
		light() {
            if (!this.isGroup) {
                return this.lights[this.id];
            }
            return this.group
		},
        state() {
            if (!this.isGroup) {
                return this.light.state;
            }
            return this.group.action;
		},
        whiteColor() {
            let color = tinycolor('rgb(255, 223, 116)');
            let bri = this.state.bri;
            let brightness = store.state.module.convertColorRange(bri, 254, 50, "this.light.name");  //the tinycolor darken() method goes from 0-100
            color = color.darken(50-brightness);                                     //but at 73, the color goes black.
            const hsl = color.toHsl();
            return {
                hue: hsl.h,
                saturation: hsl.s*100,
                luminosity: hsl.l*100,
            }
        },
    },
    methods: {
        
    },
    created() {

    },
    mounted() {
    },
}
</script>

<style lang="scss">
@import '~@radial-color-picker/vue-color-picker/dist/vue-color-picker.min.css';

$border-radius: 4px;
$padding: 1rem;
$plane-depth: 4px;

.entity-wrapper {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    width: 16.5rem;
    padding: $padding;
    margin-bottom: 2rem;

    padding-left: calc(#{$padding} + #{$plane-depth});
    padding-bottom: calc(#{$padding} + #{$plane-depth});

    border-radius: $border-radius;
    background-color: lighten(lightgrey, 15%);
    
    box-shadow: inset 0 0 0 1px hsla(0,0%,0%,.2), /* allround shadow/border */
                // inset 0 4px 1px hsla(0,0%,100%,.5), /* highlight at the top */
                inset -4px 4px 1px hsla(0,0%,100%,.5), /* highlight on the right and at the top */
                inset #{$plane-depth} -#{$plane-depth} 0 hsla(0,0%,0%,.25), /* inner shadow that adds thickness */
                -1px 2px 3px hsla(0,0%,0%,.25);

    .color-temperature {
        padding-top: 1rem;
        padding-bottom: 1.2rem;
    }

    a {
        color: inherit;
        z-index: 1;
    }

}

.color-picker-wrapper {
    position: relative;
    width: fit-content;
    margin: auto;

    .color-picker.white-disabled {
        pointer-events: none;
    }
}
</style>