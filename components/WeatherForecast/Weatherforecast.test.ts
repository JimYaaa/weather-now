import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, it, expect } from 'vitest'
import WeatherForecast from './Index.vue'

describe('WeatherForecast', () => {
    const propsConfig = {
        weathers: [
            {
                temperature_celsius_max: 30,
                temperature_celsius_min: 25,
                temperature_celsius_unit: '°C',
                temperature_fahrenheit_max: 89,
                temperature_fahrenheit_min: 60,
                temperature_fahrenheit_unit: '°F',
                time: 'Sat',
                weather: 'Sunny'
            }
        ],
    }

    it('when temperature unit is celsius', async () => {
        const component = await mountSuspended(WeatherForecast, {
            props: {
                weathers: propsConfig.weathers,
                temperatureUnit: 'celsius'
            },
        })

        const { weathers } = propsConfig
        const temperature = component.vm.getTemperatureByUnit(weathers[0])
        const weather = weathers[0]

        expect(component.html()).toContain('°C')
        expect(temperature).toMatchObject({
            max: weather.temperature_celsius_max,
            min: weather.temperature_celsius_min,
            unit: weather.temperature_celsius_unit
        })
        expect(component.html()).toMatchSnapshot()
    })

    it('when temperature unit is fahrenheit', async () => {
        const component = await mountSuspended(WeatherForecast, {
            props: {
                weathers: propsConfig.weathers,
                temperatureUnit: 'fahrenheit'
            }
        })

        const { weathers } = propsConfig
        const temperature = component.vm.getTemperatureByUnit(weathers[0])
        const weather = weathers[0]

        expect(component.html()).toContain('°F')
        expect(temperature).toMatchObject({
            max: weather.temperature_fahrenheit_max,
            min: weather.temperature_fahrenheit_min,
            unit: weather.temperature_fahrenheit_unit
        })
        expect(component.html()).toMatchSnapshot()
    })
})