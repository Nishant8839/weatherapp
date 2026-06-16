/* ============================================================
   api.js — Geocoding & Weather Data Fetching Layer
   Separated from DOM rendering for clean architecture
   ============================================================ */

// ┌────────────────────────────────────────────────────────────┐
// │  PASTE YOUR OPENWEATHER API KEY BELOW                     │
// │  Get one free at: https://openweathermap.org/api           │
// │  Works with the free tier — no paid plan required          │
// └────────────────────────────────────────────────────────────┘
const API_KEY = 'c467b9c6624f3af96827130c66a1f20e';

const BASE_URL = 'https://api.openweathermap.org';

/**
 * Check if the API key has been configured.
 * @returns {boolean}
 */
export function isApiKeyConfigured() {
  return API_KEY && API_KEY !== 'YOUR_API_KEY_HERE' && API_KEY.length > 10;
}

/**
 * Geocode a city name to coordinates.
 * Uses OpenWeather Geocoding API.
 * @param {string} cityName
 * @returns {Promise<{name: string, lat: number, lon: number, country: string, state?: string}>}
 */
export async function geocodeCity(cityName) {
  if (!isApiKeyConfigured()) {
    throw new Error('API_KEY_MISSING');
  }

  const url = `${BASE_URL}/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=${API_KEY}`;

  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 401) throw new Error('API_KEY_INVALID');
    throw new Error(`Geocoding failed (HTTP ${response.status})`);
  }

  const data = await response.json();

  if (!data || data.length === 0) {
    throw new Error('CITY_NOT_FOUND');
  }

  const { name, lat, lon, country, state } = data[0];
  return { name, lat, lon, country, state };
}

/**
 * Fetch current weather using the free 2.5 API.
 * @param {number} lat
 * @param {number} lon
 * @returns {Promise<Object>}
 */
async function fetchCurrentWeather(lat, lon) {
  const url = `${BASE_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 401) throw new Error('API_KEY_INVALID');
    if (response.status === 429) throw new Error('API_RATE_LIMITED');
    throw new Error(`Current weather fetch failed (HTTP ${response.status})`);
  }

  return response.json();
}

/**
 * Fetch 5-day / 3-hour forecast using the free 2.5 API.
 * @param {number} lat
 * @param {number} lon
 * @returns {Promise<Object>}
 */
async function fetchForecast(lat, lon) {
  const url = `${BASE_URL}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 401) throw new Error('API_KEY_INVALID');
    if (response.status === 429) throw new Error('API_RATE_LIMITED');
    throw new Error(`Forecast fetch failed (HTTP ${response.status})`);
  }

  return response.json();
}

/**
 * Aggregate 3-hour forecast entries into daily summaries.
 * Groups by date and picks high/low temps, most common icon, etc.
 * @param {Array} list — forecast list from 2.5 API
 * @param {number} timezoneOffset — seconds
 * @returns {Array} daily summaries (up to 5-6 days)
 */
function aggregateDaily(list, timezoneOffset) {
  const dayMap = {};

  list.forEach((entry) => {
    const date = new Date((entry.dt + timezoneOffset) * 1000);
    const key = date.toISOString().slice(0, 10); // YYYY-MM-DD

    if (!dayMap[key]) {
      dayMap[key] = {
        dt: entry.dt,
        temps: [],
        weather: [],
        entries: [],
      };
    }

    dayMap[key].temps.push(entry.main.temp_min, entry.main.temp_max);
    dayMap[key].weather.push(entry.weather[0]);
    dayMap[key].entries.push(entry);
  });

  return Object.values(dayMap).map((day) => {
    // Pick the most frequent weather condition
    const iconCount = {};
    day.weather.forEach((w) => {
      iconCount[w.icon] = (iconCount[w.icon] || 0) + 1;
    });
    const bestIcon = Object.entries(iconCount).sort((a, b) => b[1] - a[1])[0][0];
    const bestWeather = day.weather.find((w) => w.icon === bestIcon) || day.weather[0];

    return {
      dt: day.dt,
      temp: {
        max: Math.max(...day.temps),
        min: Math.min(...day.temps),
      },
      weather: [bestWeather],
    };
  });
}

/**
 * Normalize the 2.5 API responses into a unified shape
 * that mimics the One Call structure the UI expects:
 *   { current, hourly, daily, timezone_offset }
 *
 * @param {Object} currentData — /data/2.5/weather response
 * @param {Object} forecastData — /data/2.5/forecast response
 * @returns {Object} normalized weather object
 */
function normalizeToOneCallShape(currentData, forecastData) {
  const timezoneOffset = currentData.timezone; // seconds offset from UTC

  // Build "current" object in One Call shape
  const current = {
    dt: currentData.dt,
    temp: currentData.main.temp,
    feels_like: currentData.main.feels_like,
    humidity: currentData.main.humidity,
    pressure: currentData.main.pressure,
    dew_point: currentData.main.temp - ((100 - currentData.main.humidity) / 5), // approximate
    uvi: 0, // not available in 2.5 free API
    wind_speed: currentData.wind.speed,
    wind_deg: currentData.wind.deg || 0,
    visibility: currentData.visibility || 10000,
    sunrise: currentData.sys.sunrise,
    sunset: currentData.sys.sunset,
    weather: currentData.weather,
  };

  // Hourly: use the 3-hour forecast entries (up to 24 entries ≈ 3 days)
  const hourly = forecastData.list.slice(0, 24).map((entry) => ({
    dt: entry.dt,
    temp: entry.main.temp,
    weather: entry.weather,
  }));

  // Daily: aggregate the 3-hour entries into per-day summaries
  const daily = aggregateDaily(forecastData.list, timezoneOffset);

  return {
    current,
    hourly,
    daily,
    timezone_offset: timezoneOffset,
  };
}

/**
 * High-level helper: geocode → fetch current + forecast → normalize.
 * @param {string} cityName
 * @returns {Promise<{city: Object, weather: Object}>}
 */
export async function getWeatherForCity(cityName) {
  const city = await geocodeCity(cityName);

  // Fetch both endpoints in parallel for speed
  const [currentData, forecastData] = await Promise.all([
    fetchCurrentWeather(city.lat, city.lon),
    fetchForecast(city.lat, city.lon),
  ]);

  const weather = normalizeToOneCallShape(currentData, forecastData);
  return { city, weather };
}
