/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Calm, clinical palette — never alarming (see PRD §6).
        ink: '#1a2230',
        slatey: '#5b6776',
        // Status colors, deliberately muted.
        ok: '#3f9d6b',
        okbg: '#e8f4ec',
        warn: '#c98a2b',
        warnbg: '#fbf2e2',
        alert: '#c25450',
        alertbg: '#f8e9e8',
        info: '#4a7fb5',
        infobg: '#eaf1f8',
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
