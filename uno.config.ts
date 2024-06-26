import {
    defineConfig,
    presetUno,
} from 'unocss'

export default defineConfig({
    theme: {
        breakpoints: {
            sm: '375px',
            md: '768px',
            lg: '1080px',
            xl: '1440px',
        }
    },

    presets: [
        presetUno(),
    ]
})