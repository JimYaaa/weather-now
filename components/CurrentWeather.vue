<script lang="ts" setup>
import type { CurrentWeather } from '~~/composables/useWeather'
import type { Gecoding } from '~~/composables/useLocation'

const props = defineProps({
    weather: {
        required: true,
        type: Object as PropType<CurrentWeather>
    },
    location: {
        required: true,
        type: Object as PropType<Gecoding | null> | null
    }
})
</script>

<template>
    <div class="w-full flex justify-between items-start">
        <div>
            <div class="flex items-end">
                <div class="flex items-start color-white font-sans mr-10">
                    <span class="text-20">{{ props.weather.temperature_celsius }}</span>
                    <span class="text-10">{{ props.weather.temperature_celsius_unit }}</span>
                </div>
            </div>
    
            <div class="my-4">
                <p class="font-sans text-6 color-white">
                    {{ location?.name }} 
                    {{ location?.name !== location?.country ? `/ ${location?.country}` : '' }}
                </p>
            </div>
    
            <div class="flex justify-start items-center color-white">
                <div class="flex flex-col items-center">
                   <Icon class="color-white mb-1 text-6" name="mdi:weather-windy" />
                   <p>{{ props.weather.wind_speed + props.weather.wind_speed_unit }}</p>
                </div>

                <div class="w-1px h-40px mx-4 bg-white"></div>
    
                <div class="flex flex-col items-center">
                   <Icon class="color-white mb-1 text-6" name="mdi:water" />
                   <p>{{ props.weather.relative_humidity }}</p>
                </div>
            </div>
        </div>

        <div>
            <Icon class="color-white text-30" :name="props.weather.weather_code" />
        </div>
    </div>
</template>