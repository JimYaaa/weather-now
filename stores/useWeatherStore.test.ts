import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import { useWeatherStore } from './useWeatherStore'

describe('Weather Store', () => {
    const newStoreConfig = {
        gecoding: {
            id: 123,
            name: 'Osaka',
            latitude: 12,
            longitude: 13,
            country: 'Japan'
        },
        current: {
            relative_humidity_2m: 30,
            temperature_2m: 30,
            time: '',
            weather_code: 0,
            wind_speed_10m: 50
        },
        current_units: {
            relative_humidity_2m: '',
            temperature_2m: '',
            wind_speed_10m: ''
        },
        daily: {
            temperature_2m_max: [],
            temperature_2m_min: [],
            time: [],
            weather_code: [],
        },
        daily_units: {
            temperature_2m_max: '',
            temperature_2m_min: '',
        }
    }

  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('store init value', () => {
    const { store } = useWeatherStore()
    expect(store).toEqual(new Map())
  })

  it('set new value to store', () => {
    const { store, setStore } = useWeatherStore()

    newStoreConfig.gecoding.name = 'Tainan'

    setStore(newStoreConfig)

    expect(store.has('tainan')).toBe(true)
  })
})