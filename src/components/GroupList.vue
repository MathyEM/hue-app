<template>
    <div class="group-container">
        <div class="group-header">
			<div>
				<button class="layout-btn btn btn-group">
					<div class="layout-icon"></div>
				</button>
				<h1>Alle Rum/Grupper</h1>
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
		this.$nextTick(() => {
			group = document.querySelector('.group-wrapper');
			let btn = document.querySelector('.btn-group');
			btn.addEventListener('click', function () {
				setContainerHeight(group);
			})
		})
        const unsubscribe = store.subscribe((mutation) => {
			console.log(mutation.type);
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