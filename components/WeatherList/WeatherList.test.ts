import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, it, expect, afterEach, beforeEach } from 'vitest'
import WeatherList from './Index.vue'

describe('WeatherList', () => {
    const weatherInfo = {
        location: {
            id: 123,
            name: 'Tainan',
            latitude: 12,
            longitude: 45,
            country: 'Taiwan'
        },
        currentWeather: null,
        weatherForecast: [
            {
                temperature_celsius_max: 30,
                temperature_celsius_min: 28,
                temperature_celsius_unit: '°C',
                temperature_fahrenheit_max: 89,
                temperature_fahrenheit_min: 60,
                temperature_fahrenheit_unit: '°F',
                time: 'Thu',
                weather: 'Sunny'                
            }
        ]
    }

    let component: any

    beforeEach(async () => {
        component = await mountSuspended(WeatherList, {
            weatherInfo,
            weatherStorage: []
        })
    })

    afterEach(async () => {
        if (component) {
            await component.unmount()
        }
    })

    it('when location name equal location country only show one of them', async () => {
        await component.setProps({
            weatherInfo,
            weatherStorage: [
                {
                    "id": 1668285,
                    "name": "Taiwan",
                    "country": "Taiwan",             
                }
            ]
        })

        const listItem = await component.find('[data-test-id="weather-list-title"]')
        expect(listItem.text()).toBe('Taiwan')
        expect(component.html()).toMatchSnapshot()
    })

    it('when location name and country is different show both of them', async () => {
        await component.setProps({
            weatherInfo,
            weatherStorage: [
                {
                    "id": 1668284,
                    "name": "Osaka",
                    "country": "Japan",             
                }
            ]
        })

        const listItem = await component.find('[data-test-id="weather-list-title"]')
        expect(listItem.text()).toBe('Osaka / Japan')
        expect(component.html()).toMatchSnapshot()
    })
})