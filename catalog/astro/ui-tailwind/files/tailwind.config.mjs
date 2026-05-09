import daisyui from 'daisyui'
import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [daisyui, typography],
  daisyui: {
    themes: ['light', 'dark', 'cupcake'],
    defaultTheme: 'light',
    darkTheme: 'dark',
  },
}

export default config
