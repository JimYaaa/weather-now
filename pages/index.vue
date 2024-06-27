<script lang="ts" setup>
import SearchInput from '~~/components/SearchInput.vue'
import CurrentWeather from '~~/components/CurrentWeather.vue'
import WeatherForecast from '~~/components/WeatherForecast.vue'

const search = ref<string>('')
const gecoding = reactive<{
    latitude: number | null
    longitude: number | null
}>({
    latitude: 0,
    longitude: 0,
})

const { data: location, isPending: isLocationPending } = await useLocation(search)
const currentLocation = computed(() => location.value ? location.value?.results?.[0] : null)

const {
    weather,
    currentWeather,
    currentWeatherUnits,
    weatherForeast,
    isPending: isWeatherPending
} = await useWeather(gecoding)


watch(currentLocation, async (newLocation) => {
    gecoding.latitude = newLocation?.latitude || null
    gecoding.longitude = newLocation?.longitude || null

    console.log('weather', weather)
    console.log('daily', weatherForeast)
})
</script>

<template>
    <div class="
            relative
            w-full min-h-100vh
            flex justify-center items-center
            p-10
            bg-[url('/raining-day.jpg')] bg-cover bg-no-repeat
        "
    >
        <div class="
                w-full max-w-600px h-[calc(100vh-80px)]
                flex flex-col justify-between items-center
            "
        >
            <SearchInput v-model="search" />

            <Transition mode="out-in">
                <div v-if="isLocationPending || isWeatherPending" class="flex justify-center items-center h-full color-white text-20">
                    <Icon class="color-white" name="svg-spinners:eclipse-half" size="100" />
                </div>

                <div v-else-if="currentWeather && currentWeatherUnits && !isLocationPending && !isWeatherPending" class="w-full h-full flex flex-col justify-around">
                    <div class="w-full">
                        <CurrentWeather
                            :weather="currentWeather"
                            :weatherUnits="currentWeatherUnits"
                            :location="currentLocation"
                        />
                    </div>
    
                    <div class="w-full">
                        <WeatherForecast :weathers="weatherForeast" />
                    </div>
                </div>
            </Transition>
        </div>
    </div>
</template>

<style lang="scss" scope>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>