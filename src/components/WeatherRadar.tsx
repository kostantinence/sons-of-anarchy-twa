import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface IRadarData {
  temperature: number;
  probability: number;
  weatherCode: number;
  statusText: string;
}

// Тип для элементов почасового прогноза (24 часа)
interface IHourlyForecast {
  timeStr: string;
  temp: number;
  prob: number;
  icon: string;
}

interface IOpenMeteoResponse {
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
    weather_code: number[];
  };
}

// 🌐 Функция-парсер WMO кодов в понятный статус и иконку
const getWeatherStatus = (code: number): { text: string; icon: string } => {
  if (code === 0) return { text: "Ясно", icon: "☀️" };
  if (code >= 1 && code <= 3) return { text: "Переменная облачность", icon: "⛅" };
  if (code === 45 || code === 48) return { text: "Туман", icon: "🌫️" };
  if (code === 51 || code === 53 || code === 55) return { text: "Морось", icon: "🌧️" };
  if (code === 61 || code === 63) return { text: "Дождь", icon: "🌧️" };
  if (code === 65) return { text: "Сильный дождь", icon: "🌧️" };
  if (code === 66 || code === 67) return { text: "Ледяной дождь", icon: "🥶" };
  if (code === 71 || code === 73 || code === 75) return { text: "Снегопад", icon: "❄️" };
  if (code === 77) return { text: "Снежные зерна", icon: "❄️" };
  if (code === 80 || code === 81) return { text: "Ливневый дождь", icon: "🌧️" };
  if (code === 82) return { text: "Сильный ливень", icon: "⛈️" };
  if (code >= 95 && code <= 99) return { text: "Гроза", icon: "⛈️" };
  return { text: "Анализ атмосферы", icon: "🛸" };
};

const WeatherRadar: React.FC = () => {
  const [weatherResponse, setWeatherResponse] = useState<IOpenMeteoResponse | null>(null);
  const [radarData, setRadarData] = useState<IRadarData | null>(null);
  const [hourlyList, setHourlyList] = useState<IHourlyForecast[]>([]);
  const [locationInfo, setLocationInfo] = useState<string>(() => {
  return localStorage.getItem('soa_radar_location') || "Синхронизация...";
});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [forecastDays, setForecastDays] = useState<number>(0);

  const fetchWeatherByGPS = async (lat: number, lon: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      // 🚀 ШАГ 1: ОБРАТНОЕ ГЕОКОДИНГ-КОДИРОВАНИЕ (Координаты -> Название города)
      try {
        const geoUrl = `/geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&count=1&language=ru`;
        // const geoUrl = `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&count=1&language=ru`;
        const geoResponse = await axios.get<{ results?: Array<{ name: string; country: string }> }>(geoUrl);

        if (geoResponse.data.results && geoResponse.data.results.length > 0) {
          const { name, country } = geoResponse.data.results[0];
          const fullLocation = `${name} (${country})`;
          setLocationInfo(fullLocation);
          localStorage.setItem('soa_radar_location', fullLocation);
        } else {
          // ИНТЕЛЛЕКТУАЛЬНЫЙ КИБЕР-ПЕРЕХВАТ ПРИ ПУСТОМ ОТВЕТЕ СЕРВЕРА
          let smartName = "";
          if (Math.abs(lat - 47.91) < 0.2 && Math.abs(lon - 33.34) < 0.2) {
            smartName = "Кривой Рог";
          } else if (Math.abs(lat - 50.45) < 0.2 && Math.abs(lon - 30.52) < 0.2) {
            smartName = "Киев (Тест)";
          } else {
            smartName = `Дислокация: ${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;
          }
          setLocationInfo(smartName);
          localStorage.setItem('soa_radar_location', smartName);
        }
      } catch (geoErr) {
        console.warn("🧭 Сбой шлюза геокодинга. Включаем резервное имя.");
        let smartName = (Math.abs(lat - 47.91) < 0.2 && Math.abs(lon - 33.34) < 0.2) ? "Кривой Рог (Штаб)" : `Дислокация: ${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;
        setLocationInfo(smartName);
      }
      // 📡 ШАГ 2: ЗАПРОС МЕТЕОДАННЫХ
      // 🟢 Добавили параметр weather_code в URL запроса
      
      // const finalUrl = "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m" 
      
      // Вставляем ваши рабочие координаты в URL динамически через косые кавычки
      // const finalUrl = `https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=${lon}&hourly=temperature_2m,precipitation_probability`;
      // 🛠️ ИСПРАВЛЕН БАГ: Теперь latitude использует переданный `${lat}`, а не Берлин 52.52
      const finalUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,precipitation_probability,weather_code`;
      console.log("📡 Спутниковый радар SOA подключен к шлюзу:", finalUrl);

      const response = await axios.get<IOpenMeteoResponse>(finalUrl);
      if (!response.data || !response.data.hourly) {
        throw new Error("Неверный ответ метеостанции");
      }

      setWeatherResponse(response.data);
      updateRadarData(response.data, forecastDays);
    } catch (err: any) {
      console.error("Ошибка метео-сервера:", err);
      setError("Ошибка связи с метеостанцией");
    } finally {
      setLoading(false);
    }
  };

  const updateRadarData = (data: IOpenMeteoResponse, daysOffset: number) => {
    try {
      const targetHour = new Date();
      targetHour.setDate(targetHour.getDate() + daysOffset);
      targetHour.setMinutes(0, 0, 0);

      const formatter = new Intl.DateTimeFormat('sv-SE', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', hour12: false
      });
      
      const targetHourStr = formatter.format(targetHour).replace(' ', 'T');
      const hourIndex = data.hourly.time.indexOf(targetHourStr);
      const targetIndex = hourIndex !== -1 ? hourIndex : 0;

      const code = data.hourly.weather_code[targetIndex] ?? 0;
      const status = getWeatherStatus(code);

      // 1. Обновляем главную карточку
      setRadarData({
        temperature: data.hourly.temperature_2m[targetIndex] ?? 20,
        probability: data.hourly.precipitation_probability[targetIndex] ?? 0,
        weatherCode: code,
        statusText: status.text
      });

      // 2. Генерируем массив прогноза на 24 часа вперед от выбранной точки
      const tempHourly: IHourlyForecast[] = [];
      for (let i = 0; i < 24; i++) {
        const idx = targetIndex + i;
        if (idx >= data.hourly.time.length) break;

        const timeRaw = data.hourly.time[idx]; // Строка вида "2026-07-27T15:00"
        const formattedTime = timeRaw.split('T')[1].substring(0, 5); // Вырезаем только "15:00"
        const hCode = data.hourly.weather_code[idx] ?? 0;

        tempHourly.push({
          timeStr: formattedTime,
          temp: Math.round(data.hourly.temperature_2m[idx]),
          prob: data.hourly.precipitation_probability[idx],
          icon: getWeatherStatus(hCode).icon
        });
      }
      setHourlyList(tempHourly);

    } catch (err) {
      console.error("Ошибка фильтрации данных:", err);
      setError("Ошибка обработки метаданных");
    }
  };

  useEffect(() => {
    if (weatherResponse) {
      updateRadarData(weatherResponse, forecastDays);
    }
  }, [forecastDays]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const { latitude, longitude } = position.coords;
          setLocationInfo(`Координаты GPS: ${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
          fetchWeatherByGPS(latitude, longitude);
        },
        () => {
          console.warn("🧭 GPS заблокирован. Запуск резервных систем.");
          setLocationInfo("Кривой Рог (ПоУмолчанию)");
          fetchWeatherByGPS(47.91, 33.34);
        },
        { timeout: 4000 }
      );
    } else {
      setLocationInfo("Кривой Рог");
      fetchWeatherByGPS(47.91, 33.34);
    }
  }, []);

  const getRadarColor = (prob: number): string => {
    if (prob < 30) return 'text-matrix bg-matrix/5 border-matrix/20';
    if (prob >= 30 && prob < 70) return 'text-yellow-400 bg-yellow-950/20 border-yellow-900/40';
    return 'text-red-400 bg-red-950/20 border-red-900/40 animate-pulse';
  };

  return (
    <div className="widget-container w-full max-w-[360px] mx-auto p-5 bg-gradient-to-br from-[#141414e0] to-[#1a1a1a29] border border-slate-800 rounded-3xl text-white font-mono text-xs relative overflow-hidden min-h-[380px] shadow-2xl animate-[fadeIn_0.4s_ease-out]">
      
      {/* СИСТЕМНЫЙ ЛОГ */}
      <div className="text-[10px] text-gold mb-3 tracking-wider flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-matrix animate-pulse">⚡</span> SYSTEM: MULTI-RADAR v4.5
        </div>
        <span className="text-[9px] text-slate-500">
          {forecastDays === 0 ? "[СЕГОДНЯ]" : forecastDays === 1 ? "[ЗАВТРА]" : `[+${forecastDays} ДНЯ]`}
        </span>
      </div>

      {/* КИБЕРПАНК СЕЛЕКТОР */}
      <div className="grid grid-cols-3 gap-1 p-1 bg-black/50 border border-slate-800 rounded-xl mb-4 text-center select-none text-[9px]">
        <button onClick={() => setForecastDays(0)} className={`py-1.5 rounded-lg transition-all ${forecastDays === 0 ? 'bg-soa-gold/10 text-gold border border-soa-gold/20 font-bold shadow-[0_0_10px_rgba(212,175,55,0.1)]' : 'text-slate-500 hover:text-white'}`}>СЕГОДНЯ</button>
        <button onClick={() => setForecastDays(1)} className={`py-1.5 rounded-lg transition-all ${forecastDays === 1 ? 'bg-matrix/10 text-matrix border border-matrix/20 font-bold' : 'text-slate-500 hover:text-white'}`}>ЗАВТРА</button>
        <button onClick={() => setForecastDays(2)} className={`py-1.5 rounded-lg transition-all ${forecastDays === 2 ? 'bg-blue-950/40 text-blue-400 border border-blue-500/20 font-bold' : 'text-slate-500 hover:text-white'}`}>+2 ДНЯ</button>
      </div>

      {loading && (
        <div className="py-16 text-center text-blue-400 flex flex-col items-center gap-3 animate-pulse">
          <span className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></span> Опрос метеорологических станций...
        </div>
      )}

      {error && <div className="p-4 bg-red-950/30 border border-red-900 text-red-400 text-center rounded-xl my-6">⚠️ {error}</div>}

      {!loading && !error && radarData && (
        <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
          
          {/* ГЛАВНОЕ ИНФО-ОКНО */}
          <div className="p-4 bg-black/40 rounded-2xl border border-slate-800/80 text-center relative">
            <span className="text-slate-500 text-[9px] block uppercase tracking-widest">ДИСЛОКАЦИЯ</span>
            <span className="text-sm font-bold text-gold block mt-0.5 truncate">{locationInfo}</span>
            <span className="text-4xl font-black text-white block mt-2 font-sans">{radarData.temperature}°C</span>
            
            {/* Текстовый статус и динамическая иконка */}
            <div className="text-[11px] text-cyan-400 mt-2 font-bold tracking-wide flex items-center justify-center gap-1.5 bg-cyan-950/20 py-1 px-3 rounded-lg border border-cyan-500/10">
              <span>{getWeatherStatus(radarData.weatherCode).icon}</span>
              <span className="uppercase text-[10px]">{radarData.statusText}</span>
            </div>
          </div>

          {/* КАРТОЧКА С ТОЧНЫМИ ПРОЦЕНТАМИ ОСАДКОВ */}
          <div className={`p-3 rounded-xl border text-center font-bold tracking-wide transition-all ${getRadarColor(radarData.probability)}`}>
            ВЕРОЯТНОСТЬ ОСАДКОВ: {radarData.probability}%
            <span className="block text-[8px] font-normal text-slate-500 mt-1 uppercase">
              Сверка вероятности для калибровки точности
            </span>
          </div>

          {/* 🚀 ПОЧАСОВАЯ ЛЕНТА ДАННЫХ (БЕЗ ТАБЛИЦ, С КАРТИНКАМИ) */}
          <div className="space-y-1.5">
            <div className="text-[9px] text-slate-500 uppercase tracking-widest pl-1">
              Почасовая хроника (24 часа)
            </div>
            
            {/* Обертка для эффекта растворения краев */}
            <div className="relative w-full overflow-hidden after:pointer-events-none before:pointer-events-none after:absolute after:right-0 after:top-0 after:h-full after:w-8 after:bg-gradient-to-l after:from-[#141414] before:absolute before:left-0 before:top-0 before:h-full before:w-8 before:bg-gradient-to-r before:from-[#141414] before:z-10">
              
              {/* Сам скролл */}
              <div className="flex gap-2 overflow-x-auto pb-3 pt-0.5 custom-scrollbar snap-x select-none pr-8">
                {hourlyList.map((item, index) => (
                  <div 
                    key={index} 
                    className="flex flex-col items-center justify-between min-w-[55px] p-2 bg-black/30 border border-slate-800/60 rounded-xl snap-center hover:border-soa-gold/20 transition-colors"
                  >
                    <span className="text-[9px] text-slate-500 font-bold">{item.timeStr}</span>
                    <span className="text-base my-1">{item.icon}</span>
                    <span className="text-[11px] font-bold text-white">{item.temp}°C</span>
                    <span className={`text-[8px] mt-1 font-sans ${item.prob > 50 ? 'text-blue-400' : item.prob > 20 ? 'text-yellow-500' : 'text-slate-600'}`}>
                      💧{item.prob}%
                    </span>
                  </div>
                ))}
              </div>

            </div> {/* Конец обертки растворения краев */}
          </div> {/* Конец блока space-y-1.5 */}

        </div>
      )}
    </div>
  );
};

export default WeatherRadar;