import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Tatami Labs 设计系统色彩
        'dark-gray': '#1a1a1a',
        'pure-black': '#000000',
        'dark-blue': '#1e3a8a',
        'pure-red': '#dc2626',
        'surface': '#fafafa',
        
        // 语义化颜色
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: '#dc2626', // Pure Red
        secondary: '#1a1a1a', // Dark Gray
        accent: '#1e3a8a', // Dark Blue
        muted: '#fafafa',
      },
      fontFamily: {
        // 设计系统字体
        sans: ['Inter', 'system-ui', 'sans-serif'], // 标题/按钮
        serif: ['Playfair Display', 'Georgia', 'serif'], // 正文
      },
      fontSize: {
        xs: '0.75rem',     // 12px
        sm: '0.875rem',    // 14px
        base: '1rem',      // 16px
        lg: '1.125rem',    // 18px
        xl: '1.25rem',     // 20px
        '2xl': '1.5rem',   // 24px
        '3xl': '1.875rem', // 30px
        '4xl': '2.25rem',  // 36px
        '5xl': '3rem',     // 48px
        '6xl': '3.75rem',  // 60px
      },
      spacing: {
        // 8px 基准间距系统
        '0.5': '0.125rem',  // 2px
        '1.5': '0.375rem',  // 6px
        '2.5': '0.625rem',  // 10px
        '3.5': '0.875rem',  // 14px
        '18': '4.5rem',     // 72px
        '22': '5.5rem',     // 88px
        '26': '6.5rem',     // 104px
        '30': '7.5rem',     // 120px
      },
      animation: {
        // Tatami Labs 动画系统
        'fade-in': 'fadeIn var(--duration-normal, 300ms) var(--ease-out, ease-out)',
        'fade-out': 'fadeOut var(--duration-normal, 300ms) var(--ease-out, ease-out)',
        'slide-up': 'slideUp var(--duration-normal, 300ms) var(--ease-out, ease-out)',
        'slide-down': 'slideDown var(--duration-normal, 300ms) var(--ease-out, ease-out)',
        'cinematic': 'fadeIn var(--duration-cinematic, 1500ms) var(--ease-out, ease-out)',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      transitionDuration: {
        // 动画持续时间
        '150': '150ms',
        '300': '300ms',
        '500': '500ms',
        '1500': '1500ms', // 电影感过渡
      },
      transitionTimingFunction: {
        // 缓动函数
        'out-cubic': 'cubic-bezier(0.0, 0.0, 0.2, 1)',
        'in-out-cubic': 'cubic-bezier(0.4, 0.0, 0.2, 1)',
        'elastic': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        // Editorial 风格阴影
        'editorial': '0 4px 20px rgba(0, 0, 0, 0.1)',
        'editorial-lg': '0 8px 40px rgba(0, 0, 0, 0.12)',
        'red': '0 4px 20px rgba(220, 38, 38, 0.3)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}

export default config