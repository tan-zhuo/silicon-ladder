/** @type {import('tailwindcss').Config} */
const v = (name) => `rgb(var(--${name}) / <alpha-value>)`
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,ts}'],
  theme: {
    extend: {
      colors: {
        bg: v('c-bg'),
        card: v('c-card'),
        card2: v('c-card2'),
        line: v('c-line'),
        fg: v('c-fg'),
        muted: v('c-muted'),
        accent: v('c-accent'),
        amd: '#E65C00',
        nvidia: '#76B900',
        intel: '#0071C5',
      },
      borderRadius: { xl2: '12px' },
      fontFamily: {
        sans: ['Inter', '"Noto Sans SC"', '"Noto Sans JP"', '"PingFang SC"', '"Hiragino Sans"', '"Microsoft YaHei"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgb(15 23 42 / .04), 0 4px 16px -8px rgb(15 23 42 / .10)',
        cardDark: '0 1px 2px rgb(0 0 0 / .4), 0 8px 30px -12px rgb(0 0 0 / .6)',
      },
    },
  },
  plugins: [],
}
