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
    ],

    shortcuts: [
        {
            'radio-input': 'appearance-none w-4 h-4 mr-2 flex justify-center items-center border-solid border-white border-2px rounded-50%  before:content-[""] before:block before:w-2 before:h-2 before:rounded-50% before:transform before:scale-1 before:bg-white checked:before:scale-100 transition-all transition-500'
        }
    ]
})