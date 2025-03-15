<template>
	<nav class="px-[3rem] py-[2.2rem] bg-white flex justify-between relative z-[100] container" ref="navMenu">
		<img :src="logo" class="w-[15rem]" alt="logo easybank" />
		<button type="button" @click="store.isOpenMenu = !store.isOpenMenu" aria-label="open close nav menu">
			<img
				:src="store.isOpenMenu ? closeMenu : hamburger"
				:alt="store.isOpenMenu ? 'close menu' : 'open menu'"
				class="h-[1.8rem] w-[2rem]"
				:class="store.isOpenMenu ? 'w-[2rem]' : 'w-[2.8rem]'" />
		</button>
		<Transition>
			<div
				v-if="store.isOpenMenu"
				class="absolute top-[9.5rem] w-[calc(100%-4.4rem)] justify-items-center bg-neutral-4 grid gap-y-[1.5rem] py-[3rem] rounded-md">
				<NuxtLink
					to="/"
					v-for="(item, index) in linksData"
					:key="index"
					class="first-letter:uppercase text-[1.8rem] w-fit"
					>{{ item }}</NuxtLink
				>
			</div>
		</Transition>
	</nav>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useBankStore } from '~/store/bank'
import logo from '~/assets/images/logo.svg'
import hamburger from '~/assets/images/icon-hamburger.svg'
import closeMenu from '~/assets/images/icon-close.svg'

const store = useBankStore()
const navMenu = ref()

const linksData = ref<string[]>(['home', 'about', 'contact', 'blog', 'careers'])

const handleCloseOutside = (e: Event): void => {
	if (navMenu.value && !navMenu.value.contains(e.target)) {
		store.isOpenMenu = false
	}
}

watch(
	() => store.isOpenMenu,
	newValue => {
		if (newValue) {
			document.addEventListener('click', handleCloseOutside)
		} else {
			document.removeEventListener('click', handleCloseOutside)
		}
	}
)
</script>

<style scoped lang="scss">
.v-enter-active,
.v-leave-active {
	transition: opacity 0.1s ease;
}

.v-enter-from,
.v-leave-to {
	opacity: 0;
}
</style>
