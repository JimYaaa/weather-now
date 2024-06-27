export type WeatherParams = {
    latitude: number | null
    longitude: number | null
}

export interface CurrentWeather {
    relative_humidity_2m: number
    temperature_2m: number
    time: string
    weather_code: number
    wind_speed_10m: number
}

export interface CurrentWeatherUnit {
    relative_humidity_2m: string
    temperature_2m: string
    wind_speed_10m: string
}

export const useWeather = async (gecoding: WeatherParams) => {
    const weatherCodes = new Map([
        [0, 'clearSky'],
        [1, 'mainlyClear'],
        [2, 'partylyCloudy'],
        [3, 'overcast'],
        [45, 'fog'],
        [48, 'depositingRimFog'],
        [51, 'drizzl'],
        [53, 'drizzlModerate'],
        [55, 'drizzlDenseIntensity'],
        [56, 'freezingDrizzleLight'],
        [57, 'freezingDrizzleDense'],
        [61, 'rainSlight'],
        [63, 'rainModerate'],
        [65, 'rainDenseIntensity'],
        [66, 'freezingRainLight'],
        [67, 'freezingRainHeavy'],
        [71, 'snowFallSlight'],
        [73, 'snowFallModerate'],
        [75, 'snowFallHeavy'],
        [77, 'snowGrains'],
        [80, 'rainShowersSlight'],
        [81, 'rainShowersModerate'],
        [82, 'rainShowersViolent'],
        [85, 'snowShowersSlight'],
        [86, 'snowShowersViolent'],
        [95, 'thunderstormSlight'],
        [96, 'thunderstormSlightHail'],
        [99, 'thunderstormHeavyHail'],
    ])
    let responses = ref<any>(null)
    let isPending = ref<boolean>(false)

    watch(gecoding, async () => {
        if (!gecoding.latitude || !gecoding.longitude) {
            responses.value = null
            return
        }

        const params = {
            "latitude": gecoding.latitude,
            "longitude": gecoding.longitude,
            "current": ["temperature_2m", "relative_humidity_2m", "weather_code", "wind_speed_10m"],
            "hourly": "temperature_2m",
            "daily": "weather_code"
        }
        const url = "https://api.open-meteo.com/v1/forecast"

        isPending.value = true

        const res = await $fetch(url, { method: 'GET', params })

        responses.value = res
        isPending.value = false
    }, {
        deep: true
    })

    const currentWeather = computed(() => {
      if (!responses.value) return null

      return responses.value.current
    })

    const currentWeatherUnits = computed(() => {
      if (!responses.value) return null

      return responses.value.current_units
    })

    return {
        responses,
        currentWeather,
        currentWeatherUnits,
        isPending,
    }
}