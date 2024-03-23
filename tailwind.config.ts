import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './1-schema/**/*.{js,ts,jsx,tsx,mdx}',
    './2-db/**/*.{js,ts,jsx,tsx,mdx}',
    './3-state/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      screens: {
        landscape: { raw: '(orientation: landscape)' },
        xs: '30em',
        sm: '48em',
        md: '64em',
        lg: '74em',
        xl: '90em',
      },
    },
  },
  plugins: [],

  darkMode: 'class',

  autoprefixer: {},
};
export default config;
