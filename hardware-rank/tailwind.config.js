/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,ts}'],
  theme: {
    extend: {
      colors: {
        bg: '#0B0F14',
        card: '#121821',
        line: '#1E2630',
        fg: '#E7EEF6',
        muted: '#8B9BB0',
        accent: '#5B8CFF',
        amd: '#E65C00',
        nvidia: '#76B900',
        intel: '#0071C5',
      },
      borderRadius: { xl2: '12px' },
      fontFamily: {
        sans: ['"Noto Sans SC"', '"PingFang SC"', '"Microsoft YaHei"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
