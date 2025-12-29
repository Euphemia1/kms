import tailwindcss from '@tailwindcss/postcss'
import autoprefixer from 'autoprefixer'

/** @type {import('postcss').PostConfig} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}

export default config
