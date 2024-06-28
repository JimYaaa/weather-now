import celsiusToFahrenheit from '~~/utils/celsiusToFahrenheit'
import type { Gecoding } from '~~/entities/gecoding'
import type { WeatherAPIRes, DailyWeather, WeatherInfo } from '~~/entities/weather'
import { weatherCodes } from '~~/entities/weather'

export const useWeather = async (gecoding: Ref<Gecoding>) => {
    const weather = ref<WeatherAPIRes | null>(null)
    const isPending = ref<boolean>(false)
    const isError = ref(false)


    watch(gecoding, async () => {
        if (!gecoding.value.latitude || !gecoding.value.longitude) {
            weather.value = null
            return
        }

        const params = {
            "latitude": gecoding.value.latitude,
            "longitude": gecoding.value.longitude,
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

        const { current, current_units } = weather.value

        return {
            weather_code: weatherCodes.get(weather.value.current.weather_code)?.get('weatherIcon') || '',
            temperature_celsius: Math.floor(current.temperature_2m),
            temperature_celsius_unit: current_units.temperature_2m,
            temperature_fahrenheit: celsiusToFahrenheit(current.temperature_2m),
            temperature_fahrenheit_unit: '°F',
            relative_humidity: current.relative_humidity_2m + current_units.relative_humidity_2m,
            wind_speed: current.wind_speed_10m,
            wind_speed_unit: current_units.wind_speed_10m,
        }
    }) 

    const weatherForecast = computed<DailyWeather[]>(() => {
        if (!weather.value) return []

        const daily = weather.value.daily
        const dailyUnits = weather.value.daily_units

        return daily.time
            .slice(0, 5)
            .map((time: string, index: number) => ({
                temperature_celsius_max: daily.temperature_2m_max[index],
                temperature_celsius_min: daily.temperature_2m_min[index],
                temperature_celsius_unit: dailyUnits.temperature_2m_max,
                temperature_fahrenheit_max: celsiusToFahrenheit(daily.temperature_2m_max[index]),
                temperature_fahrenheit_min: celsiusToFahrenheit(daily.temperature_2m_min[index]),
                temperature_fahrenheit_unit: '°F',
                time: useDateFormat(time, 'ddd', { locales: 'en-US' }).value,
                weather: weatherCodes.get(daily.weather_code[index])?.get('weatherIcon') || ''
            }))
    })

    const data = computed<WeatherInfo>(() => {
        return {
            location: gecoding.value,
            currentWeather: currentWeather.value,
            weatherForecast: weatherForecast.value,
        }
    })

    return {
        data,
        isPending,
        isError,
    }
}