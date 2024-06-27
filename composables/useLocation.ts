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

    watch(name, useDebounceFn(async (newName) => {
        if (!newName) {
            data.value = null
            return
        }

        const response = await $fetch<{ generationtime_ms: Number, results: Gecoding[]}>('https://geocoding-api.open-meteo.com/v1/search', {
            method: 'GET',
            params: {
                name: name.value,
                count: 1,
            }
        })

        data.value = response
    }, 300))

    return {
        data,
    }
}