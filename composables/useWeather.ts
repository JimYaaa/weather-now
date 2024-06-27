export type WeatherParams = {
    latitude: number | null
    longitude: number | null
}

export interface CurrentWeatherAPIRes {
    relative_humidity_2m: number
    temperature_2m: number
    time: string
    weather_code: number
    wind_speed_10m: number
}

export interface CurrentWeatherUnitAPIRes {
    relative_humidity_2m: string
    temperature_2m: string
    wind_speed_10m: string
}

export interface DailyWeatherAPIRes {
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    time: string[];
    weather_code: number[];
}

export interface DailyUnitsAPIRes {
    temperature_2m_max: number
    temperature_2m_min: number
}
export interface WeatherAPIRes {
    current: CurrentWeatherAPIRes,
    current_units: CurrentWeatherUnitAPIRes,
    daily: DailyWeatherAPIRes,
    daily_units: DailyUnitsAPIRes,
}

export interface DailyWeather {
    temperature_max: number;
    temperature_min: number;
    time: string;
    weather: string;
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
    let weather = ref<WeatherAPIRes | null>(null)
    let isPending = ref<boolean>(false)

    watch(gecoding, async () => {
        if (!gecoding.latitude || !gecoding.longitude) {
            weather.value = null
            return
        }

        const params = {
            "latitude": gecoding.latitude,
            "longitude": gecoding.longitude,
            "current": ["temperature_2m", "relative_humidity_2m", "weather_code", "wind_speed_10m"],
            "daily": ["weather_code", "temperature_2m_max", "temperature_2m_min"],
        }
        const url = "https://api.open-meteo.com/v1/forecast"

        isPending.value = true

        const res = await $fetch<WeatherAPIRes>(url, { method: 'GET', params })

        weather.value = res
        isPending.value = false
    }, {
        deep: true
    })

    const currentWeather = computed(() => {
      if (!weather.value) return null

      return weather.value.current
    })

    const currentWeatherUnits = computed(() => {
      if (!weather.value) return null

      return weather.value.current_units
    })

    const weatherForeast = computed<DailyWeather[]>(() => {
        if (!weather.value) return []

        const daily = weather.value.daily
        const dailyUnits = weather.value.daily_units

        return daily.time
            .slice(0, 5)
            .map((time: string, index: number) => ({
                temperature_max: Math.floor(daily.temperature_2m_max[index]) + dailyUnits.temperature_2m_max,
                temperature_min: Math.floor(daily.temperature_2m_min[index]) + dailyUnits.temperature_2m_min,
                time: useDateFormat(time, 'ddd', { locales: 'en-US' }).value,
                weather: weatherCodes.get(daily.weather_code[index]) || ''
            }))
    })

    return {
        weather,
        currentWeather,
        currentWeatherUnits,
        weatherForeast,
        isPending,
    }
}