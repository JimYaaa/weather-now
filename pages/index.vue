<script lang="ts" setup>
import SearchInput from '~~/components/SearchInput.vue'
import CurrentWeather from '~~/components/CurrentWeather.vue'
import WeatherForecast from '~~/components/WeatherForecast.vue'

const search = ref<string>('')
const temperatureUnit = ref<string>('celsius')

const { 
    data: location,
    isPending: isLocationPending,
    isError: isLocationError,
    gecodingNotFoundMessage,
} = await useLocation(search)
const currentLocation = computed(() => location.value ? location.value?.results?.[0] : null)
watch(currentLocation, async (newLocation) => {
    gecoding.latitude = newLocation?.latitude || null
    gecoding.longitude = newLocation?.longitude || null

    console.log('weather', weather.value)
    console.log('daily', weatherForeast.value)
})

const gecoding = reactive<{
    latitude: number | null
    longitude: number | null
}>({
    latitude: 0,
    longitude: 0,
})
const {
    weather,
    currentWeather,
    weatherForeast,
    isPending: isWeatherPending,
    isError: isWeatherError,
} = await useWeather(gecoding)


const isPending = computed(() => isWeatherPending.value || isLocationPending.value)
const isError = computed(() => isWeatherError.value || isLocationError.value)

</script>

<template>
    <div class="
            relative
            w-full min-h-100vh
            flex justify-center items-start
            p-10
            bg-[url('/weather-now-bg.jpg')] bg-cover bg-no-repeat
        "
    >
        <div class="
            flex-1 backdrop-blur-lg rounded-5 color-white
            p-4
        ">
            <div>
                <p class="text-5 font-bold font-sans">Temperature Unit</p>

                <div class="w-full h-1px my-4 bg-white"></div>
            </div>

            <div class="flex justify-start items-center">
                <label class="flex-1 flex items-center cursor-pointer" for="celsius">
                    <input
                        type="radio"
                        id="celsius"
                        value="celsius"
                        class="radio-input cursor-pointer" 
                        :checked="temperatureUnit === 'celsius'"
                        v-model="temperatureUnit"
                    />
                    Celsius
                </label>

                <label class="flex-1 flex items-center cursor-pointer" for="fahrenheit">
                    <input
                        type="radio"
                        id="fahrenheit"
                        value="fahrenheit"
                        class="radio-input cursor-pointer" 
                        :checked="temperatureUnit === 'fahrenheit'"
                        v-model="temperatureUnit"
                    />
                    Fahrenheit
                </label>
            </div>
        </div>   

        <div
            class="
                w-full max-w-600px h-[calc(100vh-80px)]
                flex flex-col justify-between items-center
                mx-8
            "
        >
            <SearchInput v-model="search" />

            <Transition mode="out-in">
                <div
                    v-if="isPending"
                    class="flex justify-center items-center h-full color-white text-20"
                >
                    <Icon class="color-white" name="svg-spinners:eclipse-half" size="100" />
                </div>

                
                <div
                    v-else-if="gecodingNotFoundMessage"
                    class="
                        h-full 
                        flex justify-center items-center
                        text-8 text-center font-sans
                        color-white leading-8
                    "
                >
                    {{  gecodingNotFoundMessage }}
                </div>

                <div
                    v-else-if="isError"
                    class="
                        h-full 
                        flex flex-col justify-center items-start
                        text-6 text-left font-sans
                        color-white leading-6
                    "
                >
                    <p>Oop! Seem like have network error, make sure you have network connect and try again.</p>
                    <p class="mt-2 text-4">If still can't resolve please concat us, jimyeh.12@gmail.com</p>
                </div>

                <div
                    v-else-if="currentWeather && !isPending"
                    class="w-full h-full flex flex-col justify-around"
                >
                    <CurrentWeather
                        :temperatureUnit="temperatureUnit"
                        :weather="currentWeather"
                        :location="currentLocation"
                    />

                    <WeatherForecast
                        :temperatureUnit="temperatureUnit"
                        :weathers="weatherForeast"
                    />
                </div>
            </Transition>
        </div>

        <div class="flex-1"></div>   
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