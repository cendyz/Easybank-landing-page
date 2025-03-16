// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2024-11-01',
	devtools: { enabled: true },
	modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@nuxt/image', '@vueuse/nuxt'],
	app: {
		head: {
			title: 'Frontend Mentor',
			meta: [
				{
					name: 'description',
					content:
						'Discover Easybank – a simple and secure online banking experience. Manage your finances effortlessly with our user-friendly interface and innovative features. Sign up today!',
				},
			],
			link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.ico?v2' }],
			htmlAttrs: {
				lang: 'en'
			  }
		},
	},
})
