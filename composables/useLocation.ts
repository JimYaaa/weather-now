import type { Gecoding } from '~~/entities/gecoding'

export const useLocation = async (name: Ref<string>) => {
    const data = ref<{ generationtime_ms: Number, results: Gecoding }>({
        generationtime_ms: 0,
        results: {
            id: 0,
            name: '',
            latitude: null,
            longitude: null,
            country: '',
        }
    })
    const isError = ref(false)
    const isPending = ref(false)
    const gecodingNotFoundMessage = ref('')
    const { store: weatherStore } = useWeatherStore()

    watch(name, useDebounceFn(async (newName) => {
        gecodingNotFoundMessage.value = ''
        isError.value = false

        const isLocationExit = weatherStore.has(newName.toLowerCase())

        if (isLocationExit) {
            const weather = weatherStore.get(newName.toLowerCase())

            data.value = {
                generationtime_ms: 0,
                results: weather.gecoding,
            }

            return
        }

        if (!newName) {
            data.value = {
                generationtime_ms: 0,
                results: {
                    id: 0,
                    name: '',
                    latitude: null,
                    longitude: null,
                    country: '',
                },
            }
            return
        }

        const url = 'https://geocoding-api.open-meteo.com/v1/search'
        const params = {
            name: name.value,
            count: 1,
        }

        isPending.value = true

        const response = await $fetch<{ generationtime_ms: Number, results: Gecoding[]}>(url, {
            method: 'GET',

            params,

            onRequestError({ error }) {
                if (error) {
                    isError.value = true
                    isPending.value = false
                }
            },

            onResponseError({ response, error }) {
                if (response._data.error || error) {
                    isError.value = true
                    isPending.value = false
                }
            }
        })

        data.value = {
            generationtime_ms: response.generationtime_ms,
            results: response.results ? response.results[0] : {
                id: 0,
                name: '',
                latitude: null,
                longitude: null,
                country: '',
            },
        }
        isPending.value = false

        if (!response.results) gecodingNotFoundMessage.value = `Sorry we can't find the city "${newName}", please try again.`
    }, 500))

    return {
        data,
        isPending,
        isError,
        gecodingNotFoundMessage,
    }
}