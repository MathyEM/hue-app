<template>
    <div class="small-entity-wrapper">
        <template v-if="light || group">
            <h3 class="lamp-title">{{ lightName }}</h3>
            <div class="control-wrapper">
                <OnOffSwitch class="on-off-switch" :big="true" :isGroup="isGroup" :id="id" />
                <div v-if="hueState" class="color-picker-wrapper">
                    <CombinedColorPicker :isGroup="isGroup" :id="id" :onClass="{ 'off': !onState }" />
                    <ColorTemperature :isGroup="isGroup" :id="id" />
                </div>
                <div v-else class="color-picker-wrapper">
                    <ColorPicker
                        v-bind="whiteColor"
                        class="color-picker white-disabled"
                        :class="{ 'white-on': onState, 'off': !onState }"
                        :initially-collapsed="true"
                    />
                </div>
            </div>
        </template>
    </div>
</template>

<script>
import ColorPicker from '@radial-color-picker/vue-color-picker'
import CombinedColorPicker from './CombinedColorPicker.vue'
import ColorTemperature from './ColorTemperature.vue'
import OnOffSwitch from './OnOffSwitch.vue'
import tinycolor from 'tinycolor2'
import { mapGetters, mapState } from 'vuex'

export default {
    name: 'HueEntitySmall',
    components: {
        ColorPicker,
        ColorTemperature,
        CombinedColorPicker,
        OnOffSwitch,
    },
    props: {
        id: {
            type: String,
            required: true
        },
        isGroup: {
            Boolean,
        }
    },
    data() {
        return {
            
        }
    },
    computed: {
		...mapGetters(['lights', 'groups']),
		light() {
            if (!this.isGroup) {
                return this.lights[this.id];
            }
            return null
		},
        group() {
            if (this.isGroup) {
                return this.groups[this.id];
            }
            return null
        },
        state() {
            if (!this.isGroup) {
                return this.light.state;
            }
            return this.group.action;
		},
        whiteColor() {
            let color = tinycolor('rgb(255, 223, 116)');
            const brightness = this.convertColorRange(this.state.bri, 254, 50);  //the tinycolor darken() method goes from 0-100
            color = color.darken(50-brightness);                                     //but at 73, the color goes black.
            const hsl = color.toHsl();
            return {
                hue: hsl.h,
                saturation: hsl.s*100,
                luminosity: hsl.l*100,
            }
        },
        lightName() {
            if (this.isGroup) {
                return this.group.name
            }
            return this.light.name
        },
        onState() {
            if (this.isGroup) {
                return this.group.state.any_on
            }
            return this.state.on
        },
        hueState() {
            if (this.isGroup) {
                return this.group.action.hue
            }
            return this.state.hue
        }
    },
    methods: {
        ...mapState(['convertColorRange']),
    },
    created() {

    },
    mounted() {
    },
}
</script>

<style lang="scss">
@import '~@radial-color-picker/vue-color-picker/dist/vue-color-picker.min.css';
@import '../assets/scss/_colors.scss';
@import '../assets/scss/_btn-vars.scss';

$border-radius: 4px;
$padding: 1rem;
$plane-depth: 4px;

.small-entity-wrapper {
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

    .control-wrapper {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;

        .on-off-switch {
            // transform: rotateZ(-90deg);
            width: 50%;
            display: flex;
            flex-direction: column;
            aspect-ratio: 0.599;

            button {
                height: 50%;
                width: unset;
                color: $gray;
            }
        }
    }

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