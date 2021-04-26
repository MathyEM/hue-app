<template>
    <div class="hue-switch-container">
        <button class="switch btn btn-on" @click="controlLight(true)">
            <div class="icon-wrap">I</div>
        </button>
        <button class="switch btn btn-brighten" @mousedown="startBrightenInterval()" @touchstart="startBrightenInterval()" @mouseup="stopBrightenInterval()" @mouseleave="stopBrightenInterval()" @touchend="stopBrightenInterval()">
            <div class="icon"></div>
        </button>
        <button class="switch btn btn-dim" @mousedown="startDimmingInterval()" @touchstart="startDimmingInterval()" @mouseup="stopDimmingInterval()" @mouseleave="stopDimmingInterval()" @touchend="stopDimmingInterval()">
            <div class="icon"></div>
        </button>
        <button class="switch btn btn-off" @click="controlLight(false)">
            <div class="icon-wrap">O</div>
        </button>
    </div>
</template>

<script>
import store from '../store'
// import axios from 'axios'

export default {
    name: 'HueDimmerSwitch',
    props: {
        id: {
            type: String,
            required: true
        },
    },
    computed: {
		light() {
			return store.state.lights[this.id];
		},
        state() {
			return store.state.lights[this.id].state;
		},
    },
    data() {
        return {
            dimmingStep: 20,
            dimmingSpeed: 200,
            minBri: 1,
            maxBri: 254,
            startDimming: Function,
            startBrighten: Function,
        }
    },
    methods: {
        controlLight: function(on, bri_inc) {
            const payload = {
                id: this.id,
                on: on,
                bri_inc: bri_inc,
            }
            return store.dispatch('controlLight', payload)
        },
        startDimmingInterval: function() {
            this.controlLight(true, this.dimmingStep*-1);
            var self = this;
            
            this.startDimming = setInterval(function() {
                self.controlLight(true, self.dimmingStep*-1);
            }, this.dimmingSpeed)
        },
        stopDimmingInterval: function() {
            clearInterval(this.startDimming);
        },

        startBrightenInterval: function () {
            this.controlLight(true, this.dimmingStep);
             var self = this;

            this.startBrighten = setInterval(function() {
               self.controlLight(true, self.dimmingStep);
            }, this.dimmingSpeed)
        },
        stopBrightenInterval: function() {
            clearInterval(this.startBrighten);
        },
    }
}
</script>

<style lang="scss">
.hue-switch-container {
    $gray: dimgray;
    $off-white: whitesmoke;
    $plane-depth: 3px;
    $plane-highlight: 1px;
    $border-radius: 2px;
    $switch-size: 6rem;

    position: relative; // This makes the buttons clickable even when the color wheel is overlapping
    display: grid;
    grid-template-rows: 2fr 1fr 1fr 2fr;
    margin: auto;
    width: $switch-size;
    height: 2.5 * $switch-size;
    border-radius: $border-radius;
    border-top: 1px lightgray solid;
    border-right: 1px lightgray solid;

    box-shadow: -1px 0px 4px -1px hsla(0,0%,0%,.25);

    .switch.btn {
        font-weight: bolder;
        font-size: 1rem;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 0;
        border: none;
        color: $gray;
        background-color: $off-white;
        border-bottom: 1px lightgray solid;

        box-shadow: inset -#{$plane-highlight} 0 1px hsla(0,0%,100%,.5), /* highlight on the right and at the top */
            inset #{$plane-depth} 0 0 hsla(0,0%,0%,0.25); /* inner shadow that adds thickness */

        &:active {
            background-color: darken($off-white, 6%);
            box-shadow: inset #{$plane-depth/2} 0 0 hsla(0,0%,0%,0.25), /* inner shadow that adds thickness */
            inset -#{$plane-depth/3} #{$plane-depth/2} 0.5px 0 hsla(0,0%,0%,0.25); /* inner shadow that adds depth */
        }

        &:focus {
            outline: none;
        }

        &:first-child {
            border-top-left-radius: $border-radius;
            border-top-right-radius: $border-radius;

            box-shadow: inset -#{$plane-highlight} #{$plane-highlight} 1px hsla(0,0%,100%,.5), /* highlight on the right and at the top */
            inset #{$plane-depth} 0 0 hsla(0,0%,0%,0.25); /* inner shadow that adds thickness */

            &:active {
                background-color: darken($off-white, 6%);
                box-shadow: inset #{$plane-depth/2} 0 0 hsla(0,0%,0%,0.25),
                inset -#{$plane-depth/3} #{$plane-depth/2} 0.5px 0 hsla(0,0%,0%,0.25); /* inner shadow that adds depth */; /* inner shadow that adds thickness */
            }
        }
        &:last-child {
            border-bottom-left-radius: $border-radius;
            border-bottom-right-radius: $border-radius;

            box-shadow: inset -#{$plane-highlight} 0 1px hsla(0,0%,100%,.5), /* highlight on the right and at the top */
            inset #{$plane-depth} -#{$plane-depth} 0 hsla(0,0%,0%,0.25); /* inner shadow that adds thickness */

            &:active {
                background-color: darken($off-white, 6%);
                box-shadow: inset #{$plane-depth/2} -#{$plane-depth/2} 0 hsla(0,0%,0%,0.25),
                inset -#{$plane-depth/3} #{$plane-depth/2} 0.5px 0 hsla(0,0%,0%,0.25); /* inner shadow that adds depth */; /* inner shadow that adds thickness */
            }
        }

        &:not(:last-child) {
            border-bottom: 1px lightgray solid;
        }

        &.btn-brighten div, &.btn-dim div {
            $sun: "../../public/img/icons/sun.svg";
            background-color: $gray;
            -webkit-mask: url($sun) no-repeat center;
            mask: url($sun) no-repeat center;
            width: 100%;
        }

        &.btn-brighten div {
            height: 60%;
        }
        &.btn-dim div {
            height: 35%;
        }
    }
}
</style>