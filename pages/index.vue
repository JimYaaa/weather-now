<script lang="ts" setup>
import SearchInput from '~~/components/SearchInput.vue'
import CurrentWeather from '~~/components/CurrentWeather/Index.vue'
import WeatherForecast from '~~/components/WeatherForecast/Index.vue'
import WeatherList from '~~/components/WeatherList.vue'
import type { Gecoding } from '~~/entities/gecoding'
import type { WeatherStore } from '~~/entities/weather'
import { Transition } from 'vue'

const search = ref<string>('')
const temperatureUnit = ref<string>('celsius')
const weatherStore = ref<WeatherStore[]>([])
const selectedWeatherIndex = ref<number | null>(null)

const { 
    data: location,
    isPending: isLocationPending,
    isError: isLocationError,
    gecodingNotFoundMessage,
} = await useLocation(search)

const isWeatherEmpty = computed(() => !search.value && !weatherStore.value.length)

watch(weatherStore, (weatherStore) => {
    // when user first loaded page get first weather in weatherStore if weatherStore is not empty
    if (!search.value && weatherStore.length) {
        gecoding.value = weatherStore[0].location
        selectedWeatherIndex.value = 0
    }
})

watch(location, (newLocation) => {
    // when user clean input value get first weather in weatherStore if weatherStore is not empty
    if (!newLocation.results.id && weatherStore.value.length) {
        gecoding.value = weatherStore.value[0].location
        selectedWeatherIndex.value = 0
        return
    }

    // when user search the location is already in weatherStore change selectedWeatherIndex to highlight list item.
    const weatherStoreIndex = weatherStore.value.findIndex((weather: WeatherStore) => weather.id === newLocation.results.id)
    if (weatherStoreIndex !== -1) selectedWeatherIndex.value = weatherStoreIndex

    gecoding.value = newLocation.results
})

watch(gecodingNotFoundMessage, (notFound) => {
    if (!notFound) return

    selectedWeatherIndex.value = null
})

const gecoding = ref<Gecoding>({
    id: 0,
    name: '',
    latitude: null,
    longitude: null,
    country: '',
})
const {
    data: weather,
    isPending: isWeatherPending,
    isError: isWeatherError,
} = await useWeather(gecoding)

const isPending = computed(() => isWeatherPending.value || isLocationPending.value)
const isError = computed(() => isWeatherError.value || isLocationError.value)

const isWidgetOpen = ref(false)
const isLargeScreen = useMediaQuery('(min-width: 768px)')

await nextTick()
watch(isLargeScreen, async (newIsLargeScreen) => {
    if (newIsLargeScreen && isWidgetOpen) isWidgetOpen.value = false
})
computed
</script>

<template>
    <div class="
            relative
            w-full min-h-100dvh
            flex justify-center items-start
            py-10 px-5 md-p-10
            bg-[url('/weather-now-bg.jpg')] bg-cover bg-no-repeat
        "
    >
        <!-- Widget Part -->
         <ClientOnly>
             <Transition name="fade" mode="out-in">
                 <div
                     v-show="isLargeScreen || isWidgetOpen"
                     class="
                         absolute top-0 left-0
                         w-full h-100dvh
                         z-10
                         md-block md-relative md-w-auto md-h-auto
                         flex-1 lg-min-w-400px md-min-w-300px backdrop-blur-lg rounded-5 color-white
                         py-10 px-4 md-p-4
                     "
                 >
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
     
                     <WeatherList
                         v-model:gecoding="gecoding"
                         v-model:weatherStore="weatherStore"
                         v-model:selectedWeatherIndex="selectedWeatherIndex"
                         :weatherInfo="weather"
                     />
     
                     <div 
                         class="
                             absolute bottom-10 left-50% translate-x-[-50%]
                             flex justify-center items-center
                             p-2
                             border-1px border-white border-solid rounded-50%
                             md-hidden cursor-pointer
                         "
                     >
                         <Icon
                             class="color-white"
                             name="ic:baseline-clear"
                             size="35"
                             @click="() => isWidgetOpen = false"
                         />
                     </div>
                 </div>
             </Transition>
             <template #fallback>
                <div
                     class="
                        hidden md-flex
                         flex-1 justify-center items-center
                     "
                >
                    <Icon class="color-white" name="svg-spinners:eclipse-half" size="50" />
                </div>
            </template>
         </ClientOnly>

        <!-- Main Weather Part -->
        <div
            class="
                w-full sm-max-w-100% lg-max-w-600px h-[calc(100dvh-80px)]
                flex flex-col justify-between items-center
                sm-mx-0 md-mx-8
            "
        >
            <!-- Search Component -->
            <div class="w-full flex items-center">
                <Icon
                    class="md-hidden color-white mr-2 cursor-pointer"
                    name="ic:sharp-density-medium"
                    size="35"
                    @click="() => isWidgetOpen = true"
                />

                <SearchInput v-model="search" />
            </div>

            <Transition name="fade-blur" mode="out-in">
                <div
                    v-if="isPending"
                    class="flex justify-center items-center h-full color-white text-20"
                >
                    <Icon class="color-white" name="svg-spinners:eclipse-half" size="100" />    
                </div>

                <div
                    v-else-if="isWeatherEmpty"
                    class="notification-block"
                >
                    Please enter city or country name to search weather.
                </div>
                
                <div
                    v-else-if="gecodingNotFoundMessage"
                    class="notification-block"
                >
                    {{  gecodingNotFoundMessage }}
                </div>

                <div
                    v-else-if="isError"
                    class="notification-block"
                >
                    <p>Oop! Seem like have network error, make sure you have network connect and try again.</p>
                    <p class="mt-2 text-4">If still can't resolve please concat us, jimyeh.12@gmail.com</p>
                </div>

                <div
                    v-else-if="weather.currentWeather && !isPending"
                    class="w-full h-full flex flex-col justify-around md-justify-start"
                >
                    <!-- Current Weather -->
                    <CurrentWeather
                        class="md-my-10"
                        :temperatureUnit="temperatureUnit"
                        :weather="weather.currentWeather"
                        :location="weather.location"
                    />
                    
                    <!-- Weather Forecast -->
                    <WeatherForecast
                        class="weather-forecast"
                        :key="weather.currentWeather ? '1' : '0'"
                        :temperatureUnit="temperatureUnit"
                        :weathers="weather.weatherForecast"
                    />
                </div>
            </Transition>
        </div>

        <div class="md-hidden lg-block flex-1"></div>   
    </div>
</template>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-blur-enter {
  opacity: 0;
}

.fade-blur-enter-active {
  transition: 0.3s;
}

.fade-blur-leave {
  opacity: 1;
}

.fade-blur-leave-active {
  transition: 0.3s;
  opacity: 0;
}

.fade-blur-enter .weather-forecast {
  opacity: 0;
}

.fade-blur-enter-active .weather-forecast {
  transition: 0.3s;
  animation: blur-in 0.3s ease-in-out forwards;
}

.fade-blur-leave .weather-forecast {
  opacity: 1;
}

.fade-blur-leave-active .weather-forecast {
  transition: 0.3s;
  animation: blur-out 0.3s ease-in-out forwards;
  opacity: 0;
}

@keyframes blur-in {
  from {
    backdrop-filter: blur(0px);
  }
  to {
    backdrop-filter: blur(16px);
  }
}

@keyframes blur-out {
  from {
    backdrop-filter: blur(16px);
  }
  to {
    backdrop-filter: blur(0px);
  }
}
</style>