<script lang="ts" setup>
import SearchInput from '~~/components/SearchInput.vue'

const search = ref<string>('')
const { data: location, } = await useLocation(search)


watch(location, (newData) => {
    console.log('INDEX', newData)
})
</script>

<template>
    <div class="
        relative
        w-full min-h-100vh
        p-10
        bg-gradient-to-r from-sky-500 to-indigo-500
    ">
        <SearchInput class="mx-auto my-0" v-model="search" />

        <div>
            {{ location }}
        </div>
    </div>
</template>