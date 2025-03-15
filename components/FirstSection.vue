<template>
	<section
		class="bg-neutral-2 py-[7rem] px-[2.2rem] text-center text-neutral-1 text-[1.5rem] md:text-[1.6rem] lg:text-left lg:z-[9] lg:relative lg:px-0">
		<div class="container lg:px-[3.5rem] xl:px-0">
			<h2 class="text-[3rem] leading-[1.2] mb-[2.2rem] px-[1rem] text-primary-1 md:text-[3.5rem] lg:px-0">
				Why choose Easybank?
			</h2>
			<p class="md:w-[38rem] md:mx-auto lg:w-[57rem] lg:mx-0">
				We leverage Open Banking to turn your bank account into your financial hub. Control your finances like never
				before.
			</p>
			<div
				class="mt-[7rem] grid gap-y-[3rem] lg:grid lg:grid-cols-2 lg:place-items-center lg:gap-y-[6rem] xl:flex xl:justify-around">
				<div v-for="(item, index) in profitsData" :key="index" class="xl:w-[29rem] xl:pl-[2rem] ">
					<img :src="item.img" :alt="item.title" class="block mx-auto w-[7rem] md:w-[8rem] lg:mx-0" />
					<h3 class="text-primary-1 text-[2rem] my-[2rem] md:text-[2.2rem]">{{ item.title }}</h3>
					<p class="md:w-[38rem] md:mx-auto lg:w-[26.5rem] lg:mx-0">
						{{ item.desc }}
					</p>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import img1 from 'assets/images/icon-online.svg'
import img2 from 'assets/images/icon-budgeting.svg'
import img3 from 'assets/images/icon-onboarding.svg'
import img4 from 'assets/images/icon-api.svg'
import { ref } from 'vue'

const profitsData = ref([
	{
		img: img1,
		title: 'Online Banking',
		desc: 'Our modern web and mobile applications allow you to keep track of your finances wherever you are in the world.',
	},
	{
		img: img2,
		title: 'Simple Budgeting',
		desc: 'See exactly where your money goes each month. Receive notifications when you’re close to hitting your limits.',
	},
	{
		img: img3,
		title: 'Fast Onboarding',
		desc: 'We don’t do branches. Open your account in minutes online and start taking control of your finances right away.',
	},
	{
		img: img4,
		title: 'Open API',
		desc: 'Manage your savings, investments, pension, and much more from one account. Tracking your money has never been easier.',
	},
])
</script>

<style scoped></style>
