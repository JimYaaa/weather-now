<script lang="ts" setup>
import type { Gecoding } from '~~/entities/gecoding'
import type { CurrentWeather } from '~~/entities/weather'

const props = defineProps({
    weather: {
        required: true,
        type: Object as PropType<CurrentWeather>
    },

    location: {
        required: true,
        type: Object as PropType<Gecoding | null> | null
    },

    temperatureUnit: {
        required: true,
        type: String,
    }
})

const temperature = computed(() => {
    if (props.temperatureUnit === 'celsius') {
        return {
            value: props.weather.temperature_celsius,
            unit: props.weather.temperature_celsius_unit,
        }
    }

    return {
        value: props.weather.temperature_fahrenheit,
        unit: props.weather.temperature_fahrenheit_unit,
    }
})

defineExpose({ temperature })
</script>

<template>
    <div class="w-full flex justify-between items-start">
        <div>
            <div class="flex items-end">
                <div :key="props.temperatureUnit" class="flex items-start color-white font-sans mr-10">
                    <span class="text-16 md-text-20">{{ temperature.value }}</span>
                    <span class="text-8 md-text-10">{{ temperature.unit }}</span>
                </div>
            </div>
    
            <div class="my-6">
                <p class="font-sans text-4 md-text-6 color-white">
                    {{ location?.name }} 
                    {{ location?.name !== location?.country ? `/ ${location?.country}` : '' }}
                </p>
            </div>
    
            <div class="flex justify-start items-center color-white">
                <div class="flex flex-col items-center">
                   <Icon class="color-white mb-1 text-4 md-text-6" name="mdi:weather-windy" />
                   <p class="text-4 md-text-6 mt-2">{{ props.weather.wind_speed + props.weather.wind_speed_unit }}</p>
                </div>

                <div class="w-1px h-40px mx-4 bg-white"></div>
    
                <div class="flex flex-col items-center">
                   <Icon class="color-white mb-1 text-4 md-text-6" name="mdi:water" />
                   <p class="text-4 md-text-6 mt-2">{{ props.weather.relative_humidity }}</p>
                </div>
            </div>
        </div>

        <div>
            <Icon class="color-white text-30" :name="props.weather.weather_code" />
        </div>
    </div>
</template>
