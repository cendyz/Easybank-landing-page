import { defineStore } from 'pinia'

export const useBankStore = defineStore('bank', {
	state: () => ({
		isOpenMenu: false
	}),
	actions: {
		func() {
			console.log('console log eheheh')
		},
	},
})
