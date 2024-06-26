<script lang="ts" setup>
import type { DailyWeather } from '~~/entities/weather.ts'

const props = defineProps({
    weathers: {
        required: true,
        type: Array<DailyWeather>
    },
    
    temperatureUnit: {
        required: true,
        type: String,
    }
})

function getTemperatureByUnit(weather: DailyWeather) {
    if (props.temperatureUnit === 'celsius') {
        return {
            max: weather.temperature_celsius_max,
            min: weather.temperature_celsius_min,
            unit: weather.temperature_celsius_unit,
        }
    }

    return {
        max: weather.temperature_fahrenheit_max,
        min: weather.temperature_fahrenheit_min,
        unit: weather.temperature_fahrenheit_unit,
    }
}

defineExpose({ getTemperatureByUnit })
</script>

<template>
    <div class="p-6 color-white backdrop-blur-lg rounded-5">
        <p class="text-3">5-Day Forecast</p>

        <div class="w-full h-1px my-4 bg-white"></div>

        <ul class="lg-min-w-400px flex flex-col justify-between items-center">
            <li 
                v-for="weather, index in props.weathers"
                :key="weather.time"
                class="w-full flex justify-between items-center my-2 last:mb-0 first:mt-0"
            >
                <p class="w-50px">{{ index === 0 ? 'Today' : weather.time }}</p>

                <Icon class="color-white mx-4" :name="weather.weather" size="35" />

                <div class="flex items-center justify-between flex-1">
                    <div class="flex items-start min-w-45px color-white font-sans">
                        <p class="text-4 font-sans font-bold">{{ getTemperatureByUnit(weather).min }}</p>
                        <p class="text-3 font-sans font-bold">{{ getTemperatureByUnit(weather).unit }}</p>
                    </div>
                    
                    <div class="flex-1 h-2px mx-4 bg-white rounded"></div>

                    <div class="flex items-start min-w-45px color-white font-sans">
                        <p class="text-4 font-sans font-bold">{{ getTemperatureByUnit(weather).max }}</p>
                        <p class="text-3 font-sans font-bold">{{ getTemperatureByUnit(weather).unit }}</p>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>
