import {
    defineConfig,
    presetUno,
} from 'unocss'
import presetWebFonts from '@unocss/preset-web-fonts'

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
        presetWebFonts({
            provider: 'google',
            fonts: {
                sans: 'Roboto',
            }
        }),
    ]
})