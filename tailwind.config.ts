import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#FFFBEE',
        butter: { DEFAULT: '#FCF0C8', dk: '#F0DC90' },
        honey: { DEFAULT: '#FAE0B8', dk: '#ECC888' },
        rose: { DEFAULT: '#C4837A', dk: '#A86860', lt: '#F9E8E4', xl: '#FDF5F3' },
        brown: { DEFAULT: '#B8866A', dk: '#8A5A40' },
        text: '#3A2010',
        muted: '#8A6840',
        muted2: '#C4A070',
        border: '#E8D098',
        border2: '#ECC888',
        mint: { DEFAULT: '#6BA888', lt: '#E4F4EC', dk: '#3D7A58' },
        stone: '#FFF6DC',
        card: '#FFFEF8',
        blush: '#FFB3CF',
      },
      fontFamily: {
        display: ['Fredoka One', 'sans-serif'],
        body: ['Nunito', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
