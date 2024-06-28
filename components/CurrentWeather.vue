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
    <div>
        <div class="flex items-end">
            <div class="flex items-start color-white font-sans mr-10">
                <span class="text-20">{{ props.weather.temperature_celsius }}</span>
                <span class="text-10">{{ props.weather.temperature_celsius_unit }}</span>
            </div>

            <Icon class="color-white" :name="props.weather.weather_code" size="50" />
        </div>

        <div class="my-4">
            <p class="font-sans text-10 color-white">
                {{ location?.name }} 
                {{ location?.name !== location?.country ? `/ ${location?.country}` : '' }}
            </p>
        </div>

        <div class="flex justify-start items-center color-white">
            <div class="flex flex-col items-center mr-4">
               <Icon class="color-white mb-1" name="mdi:weather-windy" size="20" />
               <p>{{ props.weather.wind_speed + props.weather.wind_speed_unit }}</p>
            </div>

            <div class="flex flex-col items-center">
               <Icon class="color-white mb-1" name="mdi:water" size="20" />
               <p>{{ props.weather.relative_humidity }}</p>
            </div>
        </div>
    </div>
</template>