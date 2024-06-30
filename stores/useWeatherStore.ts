import type { WeatherAPIRes } from '~~/entities/weather'
import type { Gecoding } from '~~/entities/gecoding'

interface weatherParams extends WeatherAPIRes {
    gecoding: Gecoding
}

export const useWeatherStore = defineStore('weatherStore', () => {
    const store = ref(new Map())

    function setStore(weather: weatherParams) {
        const { gecoding } = weather

        if (store.value.has(gecoding.name.toLowerCase())) return 
        
        store.value.set(gecoding.name.toLowerCase(), weather)
    }
  
    return {
        store,
        setStore
    }
  })