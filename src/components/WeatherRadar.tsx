import React, { useState, useEffect } from 'react';
import axios from 'axios'; // 🛠️ Подключаем Axios

// Описываем интерфейс состояния (стейта)
interface IRadarData {
  temperature: number;
  probability: number;
}

// Описываем тип для ответа сервера, который мы ждем от Axios
interface IOpenMeteoResponse {
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
  };
}

const WeatherRadar: React.FC = () => {
  // Указываем TypeScript, что в стейте может лежать либо наш объект, либо null
  const [radarData, setRadarData] = useState<IRadarData | null>(null);
  const [locationInfo, setLocationInfo] = useState<string>("Синхронизация...");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeatherByGPS = async (lat: number, lon: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      // const finalUrl = "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m" 
      
      // Вставляем ваши рабочие координаты в URL динамически через косые кавычки
      const finalUrl = `https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=${lon}&hourly=temperature_2m,precipitation_probability`;
      
      console.log("📡 Спутниковый радар SOA подключен через Axios к шлюзу:", finalUrl);

      // 🛠️ Делаем запрос через Axios и жестко говорим ему, какой тип данных прилетит (<IOpenMeteoResponse>)
      const response = await axios.get<IOpenMeteoResponse>(finalUrl);
      const weatherData = response.data; // В Axios все данные лежат строго в поле .data!

      if (!weatherData || !weatherData.hourly) {
        throw new Error("Неверный ответ метеостанции");
      }

      // Синхронизируем текущее время компьютера с массивом сервера
      const currentHour = new Date();
      currentHour.setMinutes(0, 0, 0);
      const year = currentHour.getFullYear();
      const month = String(currentHour.getMonth() + 1).padStart(2, '0');
      const day = String(currentHour.getDate()).padStart(2, '0');
      const hour = String(currentHour.getHours()).padStart(2, '0');
      const currentHourStr = `${year}-${month}-${day}T${hour}:00`;

      // Находим индекс текущего часа
      const hourIndex = weatherData.hourly.time.indexOf(currentHourStr);
      const targetIndex = hourIndex !== -1 ? hourIndex : 0;

      // Вытаскиваем готовые данные
      const currentTemp = weatherData.hourly.temperature_2m[targetIndex] ?? 20;
      const rainProbability = weatherData.hourly.precipitation_probability[targetIndex] ?? 0;

      setRadarData({ 
        temperature: currentTemp, 
        probability: rainProbability 
      });
    } catch (err: any) {
      console.error("Ошибка метео-сервера:", err);
      setError("Ошибка связи с метеостанцией");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const { latitude, longitude } = position.coords;
          setLocationInfo(`Координаты GPS: ${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
          fetchWeatherByGPS(latitude, longitude);
        },
        () => {
          console.warn("🧭 GPS заблокирован системой. Включаем резервный штаб.");
          setLocationInfo("Кривой Рог (Резервный штаб)");
          fetchWeatherByGPS(47.91, 33.34);
        },
        { timeout: 4000 }
      );
    } else {
      setLocationInfo("Кривой Рог (Штаб)");
      fetchWeatherByGPS(47.91, 33.34);
    }
  }, []);

  const getRadarColor = (prob: number): string => {
    if (prob < 30) return 'text-matrix bg-matrix/5 border-matrix/20';
    if (prob >= 30 && prob < 70) return 'text-yellow-400 bg-yellow-950/20 border-yellow-900/40';
    return 'text-red-400 bg-red-950/20 border-red-900/40 animate-pulse';
  };

  return (
    <div className="widget-container w-full max-w-[360px] mx-auto p-6 bg-gradient-to-br from-[#14141452] to-[#1a1a1a5c] border-2 border-soa-gold/5 rounded-3xl text-white font-mono text-xs relative overflow-hidden min-h-[260px] animate-[fadeIn_0.4s_ease-out]">
      <div className="text-[10px] text-gold mb-4 tracking-wider flex items-center gap-2">
        <span className="text-matrix animate-pulse">⚡</span> SYSTEM: SATELLITE ENSEMBLE RADAR v4.0
      </div>
      
      {loading && (
        <div className="py-12 text-center text-blue-400 flex flex-col items-center gap-3 animate-pulse">
          <span className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></span> 
          Расчет ансамбля суперкомпьютеров...
        </div>
      )}
      
      {error && (
        <div className="p-4 bg-red-950/30 border border-red-900 text-red-400 text-center rounded-xl my-6">
          ⚠️ {error}
        </div>
      )}
      
      {!loading && !error && radarData && (
        <div className="space-y-4">
          <div className="p-4 bg-black/40 rounded-xl border border-soa-gold/15 text-center shadow-inner">
            <span className="text-slate-500 text-[10px] block uppercase tracking-widest">Дислокация</span>
            <span className="text-sm font-bold text-gold block mt-0.5">{locationInfo}</span>
            <span className="text-4xl font-black text-matrix block mt-2 font-sans">{radarData.temperature}°C</span>
          </div>
          <div className={`p-3 rounded-xl border text-center font-bold tracking-wide transition-all ${getRadarColor(radarData.probability)}`}>
            ВЕРОЯТНОСТЬ ОСАДКОВ: {radarData.probability}%
            <span className="block text-[9px] font-normal text-slate-500 mt-1 uppercase">
              Интеграция данных: Open-Meteo Ensemble API
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherRadar;