<script lang="ts" setup>
const modelValue = defineModel()
</script>

<template>
    <div
        class="
            w-full
            px-1.6
            flex items-center justify-between
            bg-white/50
            rounded-1
            overflow-auto
        "
    >
        <input
            class="
                w-full h-35px
                appearance-none
                outline-none
                color-white
                placeholder-white caret-white
                bg-transparent
            "
            type="text"
            placeholder="Search for location"
            v-model="modelValue"
        >

        <Icon class="color-white" name="ic:outline-search" size="30" />
    </div>
</template>