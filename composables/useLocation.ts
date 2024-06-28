export interface Gecoding {
    id: number
    name: string
    latitude: number
    longitude: number
    elevation: number
    timezone: string
    feature_code: string
    country_code: string
    country: string
    country_id: number
    population: number
    postcodes: string[]
    admin1: string
    admin2: string
    admin3: string
    admin4: string
    admin1_id: number
    admin2_id: number
    admin3_id: number
    admin4_id: number
}

export const useLocation = async (name: Ref<string>) => {
    const data = ref<{ generationtime_ms: Number, results: Gecoding[] } | null>(null)
    const isError = ref(false)
    const isPending = ref(false)
    const gecodingNotFoundMessage = ref('')

    watch(name, useDebounceFn(async (newName) => {
        if (!newName) {
            data.value = null
            return
        }

        const url = 'https://geocoding-api.open-meteo.com/v1/search'
        const params = {
            name: name.value,
            count: 1,
        }

        isError.value = false
        gecodingNotFoundMessage.value = ''
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

        data.value = response
        isPending.value = false

        if (!response.results) gecodingNotFoundMessage.value = `Sorry We Can't Find The City "${newName}", Please Try Again.`
    }, 500))

    return {
        data,
        isPending,
        isError,
        gecodingNotFoundMessage,
    }
}