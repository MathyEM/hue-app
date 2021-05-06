<template>
    <div class="group-container">
        <div class="group-header">
            <div>
                <button class="layout-btn btn visible" :class="'btn-group-'+id">
                    <div class="layout-icon"></div>
                </button>
                <h1 class="group-title">{{ group.name }}</h1>
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
                <HueEntity :id="light" />
            </div>
        </div>
    </div>
</template>

<script>
import store from '../store'
import HueEntity from './HueEntity.vue'
import CombinedColorPicker from './CombinedColorPicker.vue'
import ColorTemperature from './ColorTemperature.vue';
import OnOffSwitch from './OnOffSwitch.vue';
import { setContainerHeight } from '../assets/js/functions.js';


export default {
    name: 'GroupEntities',
    components: {
        ColorTemperature,
        CombinedColorPicker,
		HueEntity,
		OnOffSwitch,
	},
    props: {
        id: {
            type: String,
            required: true
        },
    },
    computed: {
        group() {
            return store.state.groups[this.id]
        },
    },
    mounted() {
        this.$nextTick(function () {
            var group = document.querySelector('.group-'+this.id);
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

        .layout-btn {
            $btn-size: 2rem;

            font-weight: bolder;
            font-size: 1rem;
            display: inline-flex;
            justify-content: center;
            align-items: center;
            border-radius: 0;
            border: none;
            background-color: transparent;
            width: $btn-size;
            height: $btn-size;
            margin-right: 1rem;

            &:focus {
                outline: none;
            }

            .layout-icon {
                width: 0;
                height: 0;
                border-top: 10px solid transparent;
                border-bottom: 10px solid transparent;
                border-left: 10px solid $gray;
                transition: transform 450ms ease-in;
            }

            &.visible {
                .layout-icon {
                    transform: rotateZ(90deg);
                }
            }
        }
        & > div {
            margin-bottom: 1rem;
        }
        h1 {
            display: inline-flex;
            flex-wrap: wrap;
            text-align: left;
            margin-right: 2rem;
        }
    }

    .group-controls {
        display: inline-flex;
        align-items: center;
        flex-wrap: wrap;
        margin: 0 1rem;

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
            & > div {
                margin: auto;
            }
            div > * {
                margin: auto;
            }
        }
    }
}
</style>