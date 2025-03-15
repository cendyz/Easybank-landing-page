<template>
	<footer class="py-[4rem] bg-primary-1 text-center">
		<img :src="logo" alt="easybank logo" class="block mx-auto" />
		<div class="flex justify-center gap-x-[1.5rem] my-[3.5rem]">
			<a href="#" v-for="(item, index) in socialsData" :key="index">
				<img :src="item.img" :alt="`${item.alt} icon`" class="w-[2.3rem]" />
			</a>
		</div>
		<div class="grid gap-y-[1rem] capitalize text-neutral-3">
			<a href="#" v-for="(item, index) in linksData" :key="index">{{ item }}</a>
		</div>
		<button
			type="button"
			class="capitalize mt-[4rem] bg-gradient-to-r from-primary-2 to-primary-3 text-neutral-4 px-[2.8rem] py-[1.1rem] rounded-full font-w700 text-[1.4rem]">
			request invite
		</button>
		<p class="text-neutral-1 text-[1.4rem] mt-[3rem]">© Easybank. All Rights Reserved {{ new Date().getFullYear() }}</p>
	</footer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import logo from 'assets/images/logoFot.png'
import fb from 'assets/images/icon-facebook.svg'
import yt from 'assets/images/icon-youtube.svg'
import x from 'assets/images/icon-twitter.svg'
import pt from 'assets/images/icon-pinterest.svg'
import insta from 'assets/images/icon-instagram.svg'

const linksData = ref(['about us', 'contact', 'blog', 'careers', 'support', 'privacy policy'])

const socialsData = ref([
	{
		img: fb,
		alt: 'facebook',
	},
	{
		img: yt,
		alt: 'youtube',
	},
	{
		img: x,
		alt: 'twitter',
	},
	{
		img: pt,
		alt: 'pinterest',
	},
	{
		img: insta,
		alt: 'instagram',
	},
])
</script>

<style scoped></style>
