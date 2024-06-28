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

export const weatherCodes = new Map([
    [
        0,
        new Map([
            ['weatherCondition', 'Clear Sky'],
            ['weatherIcon', 'wi:day-sunny']
        ])
    ],
    [
        1,
        new Map([
            ['weatherCondition', 'Mainly Clear'],
            ['weatherIcon', 'wi:day-cloudy']
        ])
    ],
    [
        2,
        new Map([
            ['weatherCondition', 'Partyly Cloudy'],
            ['weatherIcon', 'wi:day-cloudy-high']
        ])
    ],
    [
        3,
        new Map([
            ['weatherCondition', 'Overcast'],
            ['weatherIcon', 'wi:day-sunny-overcast']
        ])
    ],
    [
        45,
        new Map([
            ['weatherCondition', 'Fog'],
            ['weatherIcon', 'wi:day-fog']
        ])
    ],
    [
        48,
        new Map([
            ['weatherCondition', 'Depositing Rim Fog'],
            ['weatherIcon', 'wi:fog']
        ])
    ],
    [
        51,
        new Map([
            ['weatherCondition', 'Drizzl'],
            ['weatherIcon', 'wi:day-rain-mix']
        ])
    ],
    [
        53,
        new Map([
            ['weatherCondition', 'Drizzl Moderate'],
            ['weatherIcon', 'wi:day-rain']
        ])
    ],
    [
        55,
        new Map([
            ['weatherCondition', 'Drizzl Dense Inetensity'],
            ['weatherIcon', 'wi:day-rain-wind']
        ])
    ],
    [
        56,
        new Map([
            ['weatherCondition', 'Freezing Drizzle Light'],
            ['weatherIcon', 'wi:day-rain-wind']
        ])
    ],
    [
        57,
        new Map([
            ['weatherCondition', 'Freezing Drizzle Dense'],
            ['weatherIcon', 'wi:day-rain-wind']
        ])
    ],
    [
        61,
        new Map([
            ['weatherCondition', 'Rain Slight'],
            ['weatherIcon', 'wi:day-rain-wind']
        ])
    ],
    [
        63,
        new Map([
            ['weatherCondition', 'Rain Moderate'],
            ['weatherIcon', 'wi:day-rain-wind']
        ])
    ],
    [
        65,
        new Map([
            ['weatherCondition', 'Rain Dense Intensity'],
            ['weatherIcon', 'wi:day-rain-wind']
        ])
    ],
    [
        66,
        new Map([
            ['weatherCondition', 'Freezing Rain Light'],
            ['weatherIcon', 'wi:day-rain-wind']
        ])
    ],
    [
        67,
        new Map([
            ['weatherCondition', 'Freezing Rain Heavy'],
            ['weatherIcon', 'wi:day-rain-wind']
        ])
    ],
    [
        71,
        new Map([
            ['weatherCondition', 'Snow Fall Slight'],
            ['weatherIcon', 'wi:day-snow']
        ])
    ],
    [
        73,
        new Map([
            ['weatherCondition', 'Snow Fall Moderate'],
            ['weatherIcon', 'wi:day-snow']
        ])
    ],
    [
        75,
        new Map([
            ['weatherCondition', 'Snow Fall Heavy'],
            ['weatherIcon', 'wi:day-snow-thunderstorm']
        ])
    ],
    [
        77,
        new Map([
            ['weatherCondition', 'Snow Grains'],
            ['weatherIcon', 'wi:day-snow-wind']
        ])
    ],
    [
        80,
        new Map([
            ['weatherCondition', 'Rain Showers Slight'],
            ['weatherIcon', 'wi:day-showers']
        ])
    ],
    [
        81,
        new Map([
            ['weatherCondition', 'Rain Showers Moderate'],
            ['weatherIcon', 'wi:day-showers']
        ])
    ],
    [
        82,
        new Map([
            ['weatherCondition', 'Rain Showers Violent'],
            ['weatherIcon', 'wi:day-showers']
        ])
    ],
    [
        85,
        new Map([
            ['weatherCondition', 'Snow Showers Slight'],
            ['weatherIcon', 'wi:day-snow-wind']
        ])
    ],
    [
        86,
        new Map([
            ['weatherCondition', 'Snow Showers Violent'],
            ['weatherIcon', 'wi:day-snow-wind']
        ])
    ],
    [
        95,
        new Map([
            ['weatherCondition', 'Thunder Storm Slight'],
            ['weatherIcon', 'wi:day-sleet-storm']
        ])
    ],
    [
        96,
        new Map([
            ['weatherCondition', 'Thunder Storm Hail'],
            ['weatherIcon', 'wi:day-storm-showers']
        ])
    ],
    [
        99,
        new Map([
            ['weatherCondition', 'Thunder Storm Heavy Hail'],
            ['weatherIcon', 'wi:day-storm-showers']
        ])
    ],
])

export const useWeather = async (gecoding: WeatherParams) => {
    const weather = ref<WeatherAPIRes | null>(null)
    const isPending = ref<boolean>(false)
    const isError = ref(false)


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

        const res = await $fetch<WeatherAPIRes>(url, {
            method: 'GET', 
            
            params,

            onRequestError({ error }) {
                if (error) {
                    isError.value = true
                    isPending.value = false
                }
            },

            onResponseError({ error, response }) {
                if (response._data.error || error) {
                    isError.value = true
                    isPending.value = false
                }
            }
        })

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
                weather: weatherCodes.get(daily.weather_code[index])?.get('weatherIcon') || ''
            }))
    })

    return {
        weather,
        currentWeather,
        currentWeatherUnits,
        weatherForeast,
        isPending,
        isError,
    }
}