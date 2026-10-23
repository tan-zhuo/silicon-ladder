/** @type {import('tailwindcss').Config} */
// 颜色 / 圆角 / 阴影全部来自 design/tokens.json → src/tokens.css 的 CSS 变量
const v = (name) => `rgb(var(--${name}) / <alpha-value>)`
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,ts}'],
  safelist: ['rank-no-1', 'rank-no-2', 'rank-no-3'],
  theme: {
    extend: {
      screens: { xs: '420px' },
      colors: {
        bg: v('c-bg'),
        card: v('c-surface'),
        card2: v('c-surface-2'),
        card3: v('c-surface-3'),
        line: v('c-line'),
        line2: v('c-line-2'),
        line3: v('c-line-3'),
        fg: v('c-fg'),
        muted: v('c-muted'),
        faint: v('c-faint'),
        accent: v('c-accent'),
        accent2: v('c-accent-2'),
        accentFg: v('c-accent-fg'),
        inverse: v('c-inverse'),
        inverseFg: v('c-inverse-fg'),
        success: v('c-success'),
        warn: v('c-warn'),
        danger: v('c-danger'),
        amd: '#ED1C24',
        nvidia: '#76B900',
        intel: '#0068B5',
      },
      borderRadius: { xs: 'var(--r-xs)', sm: 'var(--r-sm)', md: 'var(--r-md)', lg: 'var(--r-lg)', xl: 'var(--r-xl)', xl2: 'var(--r-md)' },
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        card: 'var(--shadow-sm), var(--shadow-ring-hi)',
        cardDark: 'var(--shadow-sm), var(--shadow-ring-hi)',
      },
      transitionTimingFunction: { out: 'cubic-bezier(.2,.7,.2,1)' },
    },
  },
  plugins: [],
}
