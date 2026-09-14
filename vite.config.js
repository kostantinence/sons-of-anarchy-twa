import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import tailwindcss from '@tailwindcss/vite'
import path from 'path' // Модуль для работы с путями
import { VitePWA } from 'vite-plugin-pwa' // 1. Импортируем плагин PWA

export default defineConfig({
  plugins: [
    react(), 
    svgr(),
    tailwindcss(), // Все плагины аккуратно объединены в одном месте
    VitePWA({
      // registerType: 'prompt', // Показывает уведомление пользователю, когда есть обновление
      registerType: 'autoUpdate', // Автоматическое обновление pwa приложения
      manifest: false,        // ХВАТИТ ПЛАГИНУ ГЕНЕРИРОВАТЬ СВОЙ, берем ваш из папки public!
      includeAssets: ['favicon.svg', 'app-icon.jpg', 'robots.txt'], 
      workbox: {
        // Кэшируем абсолютно все файлы сборки
        globPatterns: ['**/*.{js,css,html,ico,png,jpg,svg,webp}'],
      }
    })
  ],
  resolve: {
    alias: {
      // Настраиваем алиас @ для обращения к src напрямую
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    open: 'chrome', // Автоматически открывать в Chrome
    proxy: {
      // 1. Основной бэкенд шлюз
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
      // 2. Новый независимый погодный шлюз
      '/weather-api': {
        target: 'https://geocoding-api.open-meteo.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/weather-api/, '')
      }
    }
  }
})