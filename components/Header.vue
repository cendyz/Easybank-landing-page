<template>
	<header class="relative text-center pb-[10rem] container">
		<img :src="mobileIntro" alt="" aria-hidden="true" class="block w-full" />
		<img
			:src="phones"
			alt="4 phones"
			class="block w-[calc(100%-3rem)] absolute top-[-7rem] left-1/2 translate-x-[-50%]" />
		<h1 class="text-[4rem] leading-[1.1] mt-[-3rem] mb-[3rem] text-primary-1">Next generation digital banking</h1>
		<p class="text-[1.5rem] px-[1rem] text-neutral-1">
			Take your financial life online. Your Easybank account will be a one-stop-shop for spending, saving, budgeting,
			investing, and much more.
		</p>
        <button type="button" class="capitalize mt-[4rem] bg-gradient-to-r from-primary-2 to-primary-3 text-neutral-4 px-[2.8rem] py-[1.1rem] rounded-full font-w700 text-[1.4rem]">request invite</button>
	</header>
</template>

<script setup lang="ts">
import mobileIntro from 'assets/images/bg-intro-mobile.svg'
import phones from 'assets/images/image-mockups.png'
</script>

<style scoped></style>
