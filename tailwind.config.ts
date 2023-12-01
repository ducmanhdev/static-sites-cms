import type { Config } from 'tailwindcss';

export default <Partial<Config>>{
  darkMode: 'class',
  content: [],
  theme: {
    extend: {
      container: {
        center: true,
        padding: '1rem',
        screens: {
          sm: '1536px',
          md: '1536px',
          lg: '1536px',
          xl: '1536px',
          '2xl': '1536px',
        },
      },
      fontSize: {
        sm: '16px',
      },
      colors: {
        error: 'rgb(var(--color-error) / <alpha-value>)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/aspect-ratio')],
};
