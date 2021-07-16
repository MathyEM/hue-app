<template>
    <div class="group-container" :id="'group-' + id">
        <div class="group-header">
            <div class="title-btn">
                <button :id="'hide-group-' + id" class="layout-btn btn visible" :class="'btn-group-'+id">
                    <div class="layout-icon"></div>
                </button>
                <label :for="'hide-group-' + id">
                    <h2 class="group-title">{{ group.name }}</h2>
                </label>
            </div>
            <div class="group-controls">
                <OnOffSwitch :id="id" />
                <div v-if="group.action.hue" class="color-picker-container">
                    <div class="color-picker-wrapper">
                        <CombinedColorPicker :isGroup="true" :id="id" :onClass="{ 'off': !group.state.any_on }" />
                    </div>
                    <ColorTemperature :isGroup="true" :id="id" />
                </div>
            </div>
        </div>
        <div class="group-wrapper" :class="'group-'+id">
            <div class="entity-container" v-for="light, l_index in group.lights" :key="l_index">
                <HueEntity :group="group" :id="light" />
            </div>
        </div>
    </div>
</template>

<script>
// import store from '../store'
import HueEntity from './HueEntity.vue'
import CombinedColorPicker from './CombinedColorPicker.vue'
import ColorTemperature from './ColorTemperature.vue'
import OnOffSwitch from './OnOffSwitch.vue'
import { setContainerHeight } from '../assets/js/functions.js'


export default {
    name: 'GroupEntities',
    components: {
        ColorTemperature,
        CombinedColorPicker,
		HueEntity,
		OnOffSwitch,
	},
    props: {
        group: {
            type: Object,
            required: true
        },
        id: {
            type: String,
            required: true
        }
    },
    computed: {
    },
    mounted() {
        this.$nextTick(function () {
            let group = document.querySelector('.group-'+this.id);
            group.style.height = group.scrollHeight + "px";

            let btn = document.querySelector('.btn-group-'+this.id);
            btn.addEventListener('click', function () {
                btn.classList.toggle("visible")
                setContainerHeight(group);
            })

            group.addEventListener('transitionend', () => {
				if (group.style.height !== "0px") {
					group.style.height = "auto";
				}
			})
        })
    }
}
</script>

<style lang="scss">
@import '../assets/scss/_colors.scss';
@import '../assets/scss/_btn-vars.scss';

$margin: 1.5rem;
$wrapper-transition-speed: 500ms;

.group-container {
    align-self: flex-start;
    margin-bottom: 3rem;
    width: 100%;

    .group-header {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        margin-bottom: 1rem;
        row-gap: 1rem;

        .layout-btn {
            $btn-size: 1.5rem;

            font-weight: bolder;
            font-size: 1rem;
            display: inline;
            justify-content: center;
            align-items: center;
            border-radius: 0;
            border: none;
            background-color: transparent;
            width: $btn-size;
            height: $btn-size;
            cursor: pointer;

            &:focus {
                outline: none;
            }

            .layout-icon {
                width: 0;
                height: 0;
                border-top: $btn-size / 3 solid transparent;
                border-bottom: $btn-size / 3 solid transparent;
                border-left: $btn-size / 3 solid $gray;
                transition: transform 450ms ease-in;
            }

            &.visible {
                .layout-icon {
                    transform: rotateZ(90deg);
                }
            }
        }
        & > .title-btn {
            display: flex;
            align-items: center;
        }
        h2 {
            display: inline;
            flex-wrap: wrap;
            text-align: left;
            margin-right: 2rem;
            cursor: pointer;
        }
    }

    .group-controls {
        display: inline-flex;
        align-items: center;
        flex-wrap: wrap;

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
        height: auto;
        overflow: hidden;
        transition: height $wrapper-transition-speed ease-in-out;
    }
    @media screen and (max-width: 649px) {
        .group-wrapper {
            justify-content: center;
            margin: initial;
        }
        .group-controls {
            margin: auto;
        }
        .group-header {
            & > .title-btn {
                margin-left: auto;
                margin-right: auto;
            }
            div > * {
                margin-left: auto;
                margin-right: auto;
            }
        }
    }
}
</style>