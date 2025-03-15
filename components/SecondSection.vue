<template>
	<section class="bg-neutral-3 py-[7rem] px-[2.2rem]">
		<div class="text-center container xl:px-[3.5rem]">
			<h2 class="capitalize text-[3rem] md:text-[3.5rem]">latest articles</h2>
			<div class="mt-[3rem] grid gap-y-[3rem] md:grid-cols-2 md:gap-[2rem] xl:grid-cols-4">
				<div class="rounded-lg overflow-hidden" v-for="(item, index) in articlesData" :key="index">
					<img :src="item.img" :alt="item.alt" class="block h-[27rem] w-full z-[10]" />
					<div
						class="p-[3rem] pb-[3.9rem mt-[-2.5rem] bg-neutral-4 z-[20] relative text-neutral-1 text-left grid gap-y-[1rem]">
						<p class="text-[1.1rem] xl:text-[1.2rem]">{{ item.quote }}</p>
						<h3 class="text-primary-1 xl:text-[1.8rem]">{{ item.title }}</h3>
						<p class="text-[1.3rem] xl:text-[1.35rem]">{{ item.desc }}</p>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import img1 from 'assets/images/image-currency.jpg'
import img2 from 'assets/images/image-restaurant.jpg'
import img3 from 'assets/images/image-plane.jpg'
import img4 from 'assets/images/image-confetti.jpg'

const articlesData = ref([
	{
		img: img1,
		quote: 'By Claire Robinson',
		title: 'Receive money in any currency with no fees',
		desc: 'The world is getting smaller and we’re becoming more mobile. So why should you be forced to only receive	money in a single …',
		alt: 'Money',
	},
	{
		img: img2,
		quote: 'By Wilson Hutton',
		title: 'Treat yourself without worrying about money',
		desc: 'Our simple budgeting feature allows you to separate out your spending and set realistic limits each month. That means you …',
		alt: 'Restaurant',
	},
	{
		img: img3,
		quote: 'By Wilson Hutton',
		title: 'Take your Easybank card wherever you go',
		desc: 'We want you to enjoy your travels. This is why we don’t charge any fees on purchases while you’re abroad. We’ll even show you …',
		alt: 'Plane',
	},
	{
		img: img4,
		quote: 'By Claire Robinson',
		title: 'Our invite-only Beta accounts are now live!',
		desc: 'After a lot of hard work by the whole team, we’re excited to launch our closed beta.  It’s easy to request an invite through the site ...',
		alt: 'Confetti',
	},
])
</script>

<style scoped></style>
