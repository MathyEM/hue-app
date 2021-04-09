<template>
    <div class="hue-switch-container">
        <button class="switch btn btn-on" @click="toggle(id, true)">
            <div class="icon-wrap">I</div>
        </button>
        <button class="switch btn btn-brighten">
            <div class="icon"></div>
        </button>
        <button class="switch btn btn-dim">
            <div class="icon"></div>
        </button>
        <button class="switch btn btn-off" @click="toggle(id, false)">
            <div class="icon-wrap">O</div>
        </button>
    </div>
</template>

<script>
// import store from '../store'
// import axios from 'axios'

export default {
    name: 'HueDimmerSwitch',
    props: {
        id: {
            type: String,
            required: true
        },
        state: {
            type: Object,
            required: true
        },
        toggle: {
            type: Function,
            required: true
        },
        brighten: {
            type: Function,
            required: true
        },
        dim: {
            type: Function,
            required: true
        },
    },
    data() {
        return {
        }
    },
    methods: {

    }
}
</script>

<style lang="scss" scoped>
.hue-switch-container {
    $gray: dimgray;
    $off-white: whitesmoke;

    display: grid;
    grid-template-rows: 2fr 1fr 1fr 2fr;
    margin: auto;
    margin-bottom: 50px;
    width: 4rem;
    height: 10rem;
    border: 0.05rem lightgray solid;
    border-radius: 2px;

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
            background-color: darken($off-white, 5%);
            box-shadow: inset 0px 0px 0.1px 0.5px gray;
        }

        &:focus {
            outline: none;
        }

        &:last-child {
            border-bottom-left-radius: 2%;
            border-bottom-right-radius: 2%;
        }
        &:first-child {
            border-top-left-radius: 2%;
            border-top-right-radius: 2%;
        }

        &:not(:last-child) {
            border-bottom: 0.05rem lightgray solid;
        }

        &.btn-brighten div, &.btn-dim div {
            background-color: $gray;
            -webkit-mask: url("../assets/icons/sun.svg") no-repeat center;
            mask: url("../assets/icons/sun.svg") no-repeat center;
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