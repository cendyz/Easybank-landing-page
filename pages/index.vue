<template>
	<main>
		<p>test</p>
		<Transition>
			<div
				v-if="store.isOpenMenu"
				class="absolute top-0 left-0 w-full h-full opacity-80 bg-gradient-to-t from-slate-50 to-slate-900 transition-opacity"></div>
		</Transition>
	</main>
</template>

<script setup lang="ts">
import { useBankStore } from '~/store/bank'

const store = useBankStore()
</script>

<style scoped lang="scss">

.v-enter-active,
.v-leave-active {
  transition: opacity 0.4s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

</style>
