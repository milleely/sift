/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/sidepanel/**/*.{html,jsx}', './src/settings/**/*.{html,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2E6BE6',
          light: '#EBF1FD',
          hover: '#1D5BD6',
        },
        accent: {
          amber: '#E8A23E',
          'amber-light': '#FEF5E7',
        },
        surface: {
          bg: '#FAFAFA',
          card: '#FFFFFF',
        },
        border: {
          DEFAULT: '#E8E8E6',
          light: '#F0F0EE',
        },
        text: {
          primary: '#1A1A1A',
          secondary: '#6B6B6B',
          muted: '#9B9B9B',
        },
        status: {
          success: '#2E9E6B',
          'success-light': '#E8F5EF',
          warning: '#D4850A',
        },
        badge: {
          purple: '#7C5CBF',
          'purple-light': '#F3EEFB',
          teal: '#2E8E8E',
          'teal-light': '#E8F5F5',
        },
      },
      fontFamily: {
        sans: ['DM Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      borderRadius: {
        card: '10px',
        btn: '8px',
        badge: '5px',
        sidebar: '12px',
      },
      boxShadow: {
        card: '0 4px 24px rgba(0,0,0,0.06)',
      },
      spacing: {
        'card-pad': '12px',
        'header-pad': '16px',
        'card-gap': '6px',
        'section-gap': '30px',
      },
      letterSpacing: {
        heading: '-0.3px',
      },
      transitionDuration: {
        default: '150ms',
      },
    },
  },
  plugins: [],
};
