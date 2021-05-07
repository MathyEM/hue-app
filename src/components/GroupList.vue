<template>
    <div class="group-container">
        <div class="group-header">
			<div class="title-btn">
				<button id="hide-groups" class="layout-btn btn btn-group visible">
					<div class="layout-icon"></div>
				</button>
				<label for="hide-groups">
					<h2>Alle Rum/Grupper</h2>
				</label>
			</div>
        </div>
        <div class="group-wrapper">
            <div v-for="group, g_index in groups" :key="g_index" class="entity-container">
                <HueEntity :id="g_index" :isGroup="true" />
            </div>
        </div>
    </div>
</template>

<script>
import store from '../store'
import HueEntity from './HueEntity.vue'
import { setContainerHeight } from '../assets/js/functions.js';

export default {
	name: 'GroupList',
	components: {
		HueEntity,
	},
	data() {
		return {

        };
	},
	computed: {
		groups() {
			const groups = store.state.groups;
			var filteredGroups = {};

			for (const key of Object.keys(groups)) {
				if (groups[key].class !== "TV") {
					filteredGroups[key] = groups[key];
				}
			}
			
			return filteredGroups;
		},
	},
	mounted() {
		var group;
		this.$nextTick().then(() => {
			group = document.querySelector('.group-wrapper');
			var btn = document.querySelector('.btn-group');

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
        const unsubscribe = store.subscribe((mutation) => {
			if (mutation.type == "SET_LOCAL_GROUPS") {
				this.$nextTick().then(() => {
					group.style.height = group.scrollHeight + "px";					
				})
				unsubscribe();
			}
		})
		
	},
}
</script>

<style lang="scss">

</style>