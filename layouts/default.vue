<template>
	<nav class="px-[3rem] py-[2.2rem] bg-white w-full relative z-[100] lg:px-[3.5rem]" ref="navMenu">
		<div class="flex justify-between relative container lg:items-center lg:justify-between lg:px-0 xl:px-0">
			<img :src="logo" class="w-[15rem]" alt="logo easybank" />
			<button
				type="button"
				@click="store.isOpenMenu = !store.isOpenMenu"
				aria-label="open close nav menu"
				class="lg:hidden">
				<img
					:src="store.isOpenMenu ? closeMenu : hamburger"
					:alt="store.isOpenMenu ? 'close menu' : 'open menu'"
					class="h-[1.8rem] w-[2rem]"
					:class="store.isOpenMenu ? 'w-[2rem]' : 'w-[2.8rem]'" />
			</button>
			<Transition>
				<div
					v-if="store.isOpenMenu"
					class="absolute top-[9.5rem] w-[calc(100%-4.4rem)] justify-items-center bg-neutral-4 grid gap-y-[1.5rem] py-[3rem] rounded-md lg:none">
					<NuxtLink
						to="/"
						v-for="(item, index) in linksData"
						:key="index"
						class="first-letter:uppercase text-[1.8rem] w-fit"
						>{{ item }}</NuxtLink
					>
				</div>
			</Transition>
			<div class="hidden lg:flex gap-x-[3.5rem]">
				<NuxtLink
					to="/"
					v-for="(item, index) in linksData"
					:key="index"
					class="first-letter:uppercase text-[1.5rem] text-neutral-1"
					>{{ item }}</NuxtLink
				>
			</div>
			<button
				type="button"
				class="hidden lg:block capitalize bg-gradient-to-r from-primary-2 to-primary-3 text-neutral-4 px-[2.8rem] py-[1.1rem] rounded-full font-w700 text-[1.4rem]">
				request invite
			</button>
		</div>
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
