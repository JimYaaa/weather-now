<script lang="ts" setup>
const modelValue = defineModel()
</script>

<template>
    <div
        class="
            w-full
            px-1.6
            flex items-center
            bg-white/50
            rounded-1
            overflow-auto
        "
    >
        <Icon class="color-white" name="ic:outline-search" size="30" />

        <input
            class="
                w-full h-35px
                appearance-none
                outline-none
                color-white
                placeholder-#3b72ba caret-#3b72ba
                bg-transparent
            "
            type="text"
            placeholder="Search for location"
            v-model="modelValue"
        >
    </div>
</template>