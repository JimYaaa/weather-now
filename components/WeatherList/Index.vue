<script lang="ts" setup>
import type { WeatherInfo, WeatherStore } from '~~/entities/weather.ts'
import type { Gecoding } from '~~/entities/gecoding'
import { useStorage } from '@vueuse/core'


const gecoding = defineModel('gecoding', {
    type: Object as PropType<Gecoding>,
})

const weatherStorage = defineModel('weatherStorage', {
    type: Array<WeatherStore>,
    default: []
})

useStorage('weatherStorage', weatherStorage)

const isWidgetOpen = defineModel('isWidgetOpen', {
    type: Boolean,
    default: false
})

const props = defineProps({
    weatherInfo: {
        required: true,
        type: Object as PropType<WeatherInfo>
    }
})

const selectedWeatherIndex = defineModel('selectedWeatherIndex', {
    type: Number || null,
    default: null
})

function selectWeather(weatherInfo: WeatherInfo, index: number) {
    gecoding.value = weatherInfo.location
    selectedWeatherIndex.value = index
}

function addWeather(weatherInfo: WeatherInfo) {
    const { location, currentWeather, weatherForecast } = weatherInfo

    if (!currentWeather) return

   const isExited = weatherStorage.value.find((weather: WeatherStore) => (weather.id === location.id) && location.id)

   if (isExited) return

    weatherStorage.value.push({
        id: location.id,
        name: location.name,
        country: location.country,
        currentWeather,
        weatherForecast,
        location,
    })

    selectedWeatherIndex.value = weatherStorage.value.length - 1
}
</script>

<template>
    <div class="flex items-center flex-col flex-1 mt-8">
        <div class="w-full flex justify-between items-center">
            <p class="test text-5 font-bold font-sans">Weather</p>

            <button class="text-5" @click="addWeather(props.weatherInfo)">+</button>
        </div>

        <div class="w-full h-1px my-4 bg-white"></div>

        <div class="relative w-full flex-1">
            <ul class="absolute top-0 left-0 md-relative w-full h-full flex-1 md-max-h-400px overflow-auto">
                <li
                    v-for="weather, index in weatherStorage"
                    :key="weather.id"
                    :class="{ 'border-yellow': weather.id === weatherStorage[selectedWeatherIndex]?.id }"
                    class="
                        flex justify-between items-stretch
                        p-4 mb-4 last:mb-0
                        border-solid border-1px border-white rounded-15px
                        cursor-pointer
                        hover:border-yellow
                        transition-all transition-500
                    "
                    @click="selectWeather(weather, index)"
                >
                    <div class="flex flex-col items-stretch justify-between">
                        <div>
                            <p
                                data-test-id='weather-list-title'
                                class="sm-text-3 font-bold"
                            >
                                {{ weather.name }} {{ weather.name !== weather.country ? `/ ${weather.country}` : '' }}
                            </p>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        
        <div 
            class="
                flex justify-center items-center
                p-2 mt-4
                border-1px border-white border-solid rounded-50%
                md-hidden cursor-pointer
            "
            @click="() => isWidgetOpen = false"
        >
            <Icon
                class="color-white"
                name="ic:baseline-clear"
                size="35"
            />
        </div>
    </div>
</template>