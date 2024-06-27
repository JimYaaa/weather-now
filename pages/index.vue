<script lang="ts" setup>
import SearchInput from '~~/components/SearchInput.vue'
import CurrentWeather from '~~/components/CurrentWeather.vue'

const search = ref<string>('')
const gecoding = reactive<{
    latitude: number | null
    longitude: number | null
}>({
    latitude: 0,
    longitude: 0,
})

const { data: location, } = await useLocation(search)
const currentLocation = computed(() => location.value ? location.value.results[0] : null)

const {
    responses,
    currentWeather,
    currentWeatherUnits,
    isPending
} = await useWeather(gecoding)


watch(currentLocation, async (newLocation) => {
    gecoding.latitude = newLocation?.latitude || null
    gecoding.longitude = newLocation?.longitude || null
    console.log('INDEX Weather', responses)
})
</script>

<template>
    <div class="
            relative
            w-full min-h-100vh
            p-10
            bg-[url('/raining-day.jpg')] bg-cover bg-no-repeat
        "
    >
        <SearchInput class="mx-auto my-0" v-model="search" />

        <div class="
                flex justify-center
                w-80% h-[calc(100vh-35px-80px-64px)]
                mx-auto mt-16 
            "
        >
            <div v-if="currentWeather && currentWeatherUnits" class="flex">
                <div>
                    <CurrentWeather
                        :weather="currentWeather"
                        :weatherUnits="currentWeatherUnits"
                        :location="currentLocation"
                    />
                </div>
            </div>
        </div>
    </div>
</template>