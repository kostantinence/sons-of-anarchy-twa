import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(), 
    tailwindcss()
  ],
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
        target: 'https://geocoding-api.open-meteo.com', // Замените на ваш погодный сервис
        changeOrigin: true,
        secure: true,
        // Полностью удаляет '/weather-api' из итогового запроса к серверу погоды
        rewrite: (path) => path.replace(/^\/weather-api/, '')
      }
    }
  }
})