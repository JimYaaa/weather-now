<script lang="ts" setup>
import type { DailyWeather } from '~~/composables/useWeather'

const props = defineProps({
    weathers: {
        required: true,
        type: Array<DailyWeather>
    },
})
</script>

<template>
    <div class="p-6 color-white backdrop-blur rounded-5">
        <p class="text-3">5-Day Forecast</p>

        <div class="w-full h-1px my-4 bg-white"></div>

        <ul class="min-w-400px flex flex-col justify-between items-center">
            <li 
                v-for="weather, index in props.weathers"
                :key="weather.time"
                class="w-full flex justify-between items-center my-2 last:mb-0 first:mt-0"
            >
                <p class="w-50px">{{ index === 0 ? 'Today' : weather.time }}</p>

                <Icon class="color-white mx-4" :name="weather.weather" size="35" />

                <div class="flex items-center justify-between flex-1">
                    <p class="font-sans font-bold">{{ weather.temperature_min }}</p>
                    <div class="flex-1 h-2px mx-4 bg-white rounded"></div>
                    <p class="font-sans font-bold">{{ weather.temperature_max }}</p>
                </div>
            </li>
        </ul>
    </div>
</template>