<script lang="ts" setup>
import type { WeatherInfo } from '~~/composables/useWeather'
import type { Gecoding } from '~~/composables/useLocation'
import { useStorage } from '@vueuse/core'


const gecoding = defineModel('gecoding', {
    type: Object as PropType<Gecoding>,
})
const weatherStore = defineModel('weatherStore', {
    type: Array<any>,
    default: []
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


useStorage('weatherStore', weatherStore)

function selectWeather(weatherInfo: WeatherInfo, index: number) {
    gecoding.value = weatherInfo.location
    selectedWeatherIndex.value = index
}

function addWeather(weatherInfo: WeatherInfo) {
    const { location, currentWeather, weatherForecast } = weatherInfo

    if (!currentWeather) return

    const isExited = weatherStore.value.find((weather: any) => (weather.id === location.id) && location.id)

    if (isExited) return

    weatherStore.value.push({
        id: location.id,
        name: location.name,
        country: location.country,
        currentWeather,
        weatherForecast,
        location,
    })

    selectedWeatherIndex.value = weatherStore.value.length - 1
    useLocalStorage('weatherStore', weatherStore.value)
}
</script>

<template>
    <div class="mt-8">
        <div class="flex justify-between items-center">
            <p class="text-5 font-bold font-sans">Weather</p>

            <button class="text-5" @click="addWeather(props.weatherInfo)">+</button>
        </div>

        <div class="w-full h-1px my-4 bg-white"></div>

        <ClientOnly fallback-tag="ul">
            <ul>
                <li
                    v-for="weather, index in weatherStore"
                    :key="weather.id"
                    :class="{ 'border-yellow': weather.id === weatherStore[selectedWeatherIndex]?.id }"
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
                            <p class="font-bold">{{ weather.name }} {{ weather.name !== weather.country ? `/ ${weather.country}` : '' }}</p>
                        </div>
                    </div>
                </li>
            </ul>

            <template #fallback>
                <Icon class="color-white" name="svg-spinners:eclipse-half" size="50" />
            </template>
        </ClientOnly>
    </div>
</template>