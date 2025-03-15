<template>
	<header class="pb-[10rem] bg-neutral-3 lg:overflow-x-clip lg:pb-0">
		<div class="lg:container relative text-center lg:flex lg:px-[3.5rem] xl:px-0">
			<picture>
				<source :srcset="desktopIntro" media="(min-width: 1024px)" />
				<img
					:src="mobileIntro"
					alt=""
					aria-hidden="true"
					class="block w-full lg:absolute lg:left-[50rem] xl:left-[55rem] lg:top-[-20rem] xl:top-[-26rem] lg:z-[0]" />
			</picture>
			<img
				:src="phones"
				alt="4 phones"
				class="block w-[calc(100%-3rem)] absolute top-[-7rem] left-1/2 translate-x-[-50%] md:w-[70%] md:top-[5rem] lg:w-[65rem] xl:w-[70rem] lg:left-[91rem] xl:left-[119.9rem] lg:top-[-10.5rem] lg:z-[20]" />
			<div class="lg:py-[12rem] lg:text-left">
				<h1
					class="text-[4rem] leading-[1.1] mt-[-3rem] mb-[3rem] text-primary-1 md:text-[5rem] md:w-[40rem] md:mx-auto lg:mt-0 lg:mx-0 lg:text-[6.5rem] lg:w-[50rem]">
					Next generation digital banking
				</h1>
				<p
					class="text-[1.5rem] px-[1rem] text-neutral-1 md:text-[1.7rem] md:w-[47rem] md:mx-auto lg:mx-0 lg:px-0 lg:text-[1.82rem]">
					Take your financial life online. Your Easybank account will be a one-stop-shop for spending, saving,
					budgeting, investing, and much more.
				</p>
				<button
					type="button"
					class="capitalize mt-[4rem] bg-gradient-to-r from-primary-2 to-primary-3 text-neutral-4 px-[2.8rem] py-[1.1rem] rounded-full font-w700 text-[1.4rem] md:text-[1.6rem]">
					request invite
				</button>
			</div>
		</div>
	</header>
</template>

<script setup lang="ts">
import mobileIntro from 'assets/images/bg-intro-mobile.svg'
import desktopIntro from 'assets/images/bg-intro-desktop.svg'
import phones from 'assets/images/image-mockups.png'
</script>

<style scoped></style>
