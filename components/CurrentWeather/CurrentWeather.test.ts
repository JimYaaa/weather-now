import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, it, expect } from 'vitest'
import CurrentWeather from './Index.vue'

describe('CurrentWeather', () => {
    const propsConfig = {
        weather: {
            weather_code: 'wi:day-sunny',
            temperature_celsius: 20,
            temperature_celsius_unit: '°C',
            temperature_fahrenheit: 50,
            temperature_fahrenheit_unit: '°F',
            relative_humidity: '100%',
            wind_speed: 100,
            wind_speed_unit: 'km/h',
        },
        location: {
            id: 123,
            name: 'Taiwan',
            latitude: 12,
            longitude: 34,
            country: 'Taiwan',
        },
    }

    it('when temperature unit is celsius', async () => {
        const component = await mountSuspended(CurrentWeather, {
            props: {
                weather: propsConfig.weather,
                location: propsConfig.location,
                temperatureUnit: 'celsius'
            },
        })

        const { weather } = propsConfig

        expect(component.html()).toContain('°C')
        expect(component.vm.temperature).toMatchObject({
            value: weather.temperature_celsius,
            unit: weather.temperature_celsius_unit
        })
        expect(component.html()).toMatchSnapshot()
    })

    it('when temperature unit is fahrenheit', async () => {
        const component = await mountSuspended(CurrentWeather, {
            props: {
                weather: propsConfig.weather,
                location: propsConfig.location,
                temperatureUnit: 'fahrenheit'
            }
        })

        const { weather } = propsConfig

        expect(component.html()).toContain('°F')
        expect(component.vm.temperature).toMatchObject({
            value: weather.temperature_fahrenheit,
            unit: weather.temperature_fahrenheit_unit
        })
        expect(component.html()).toMatchSnapshot()
    })
})