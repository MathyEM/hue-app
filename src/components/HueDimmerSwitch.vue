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

<style lang="scss" scoped>
.hue-switch-container {
    $gray: dimgray;
    $off-white: whitesmoke;
    $border-radius: 2px;
    $switch-size: 6rem;
    position: relative; // This makes the buttons clickable even when the color wheel is overlapping

    display: grid;
    grid-template-rows: 2fr 1fr 1fr 2fr;
    margin: auto;
    margin-bottom: 50px;
    width: $switch-size;
    height: 2.5 * $switch-size;
    border: 1px lightgray solid;
    border-radius: $border-radius;

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

        &:active {
            background-color: darken($off-white, 6%);
            box-shadow: inset -0.5px 0.5px 0.5px 0.2px transparentize(gray, 0.3);
        }

        &:focus {
            outline: none;
        }

        &:last-child {
            border-bottom-left-radius: $border-radius;
            border-bottom-right-radius: $border-radius;
        }
        &:first-child {
            border-top-left-radius: $border-radius;
            border-top-right-radius: $border-radius;
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