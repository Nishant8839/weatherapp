/* ============================================================
   ui.js — DOM Rendering Engine
   All DOM manipulation and UI state management lives here
   ============================================================ */

// ─── SVG ICON LIBRARY ───
const ICONS = {
  humidity: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>`,

  wind: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/></svg>`,

  uv: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,

  pressure: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,

  visibility: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,

  sunrise: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 18a5 5 0 0 0-10 0"/><line x1="12" y1="2" x2="12" y2="9"/><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/><line x1="1" y1="18" x2="3" y2="18"/><line x1="21" y1="18" x2="23" y2="18"/><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"/><line x1="23" y1="22" x2="1" y2="22"/><polyline points="8 6 12 2 16 6"/></svg>`,
};

// ─── DOM REFERENCES ───
const $ = (sel) => document.querySelector(sel);
const dom = {
  bgGradient:     $('#bg-gradient'),
  searchForm:     $('#search-form'),
  searchInput:    $('#search-input'),
  searchSpinner:  $('#search-spinner'),
  toastContainer: $('#toast-container'),
  skeleton:       $('#skeleton-loader'),
  content:        $('#weather-content'),
  welcome:        $('#welcome-state'),
  heroCity:       $('#hero-city'),
  heroTime:       $('#hero-time'),
  heroIcon:       $('#hero-icon'),
  heroTemp:       $('#hero-temp'),
  heroDesc:       $('#hero-desc'),
  heroFeels:      $('#hero-feels'),
  hourlyScroll:   $('#hourly-scroll'),
  dailyGrid:      $('#daily-grid'),
  metricsGrid:    $('#metrics-grid'),
};

// ─── STATE MANAGEMENT ───

/**
 * Show the loading skeleton and hide other states.
 */
export function showLoading() {
  dom.welcome.classList.add('hidden');
  dom.content.classList.add('hidden');
  dom.skeleton.classList.remove('hidden');
  dom.searchSpinner.classList.remove('hidden');
}

/**
 * Show the weather content and hide other states.
 */
export function showContent() {
  dom.skeleton.classList.add('hidden');
  dom.welcome.classList.add('hidden');
  dom.content.classList.remove('hidden');
  dom.searchSpinner.classList.add('hidden');
}

/**
 * Show the welcome/empty state.
 */
export function showWelcome() {
  dom.content.classList.add('hidden');
  dom.skeleton.classList.add('hidden');
  dom.welcome.classList.remove('hidden');
  dom.searchSpinner.classList.add('hidden');
}

/**
 * Hide the search spinner independently.
 */
export function hideSpinner() {
  dom.searchSpinner.classList.add('hidden');
}

// ─── TOAST NOTIFICATIONS ───

/**
 * Display a styled toast notification.
 * @param {string} message
 * @param {'error'|'warn'|'info'} type
 * @param {number} duration — ms before auto-dismiss
 */
export function showToast(message, type = 'info', duration = 4500) {
  const iconMap = {
    error: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
    warn: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    info: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
  };

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `
    <span class="toast__icon">${iconMap[type]}</span>
    <span>${message}</span>
  `;

  dom.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast--exiting');
    toast.addEventListener('animationend', () => toast.remove());
  }, duration);
}

// ─── BACKGROUND GRADIENT ───

/**
 * Map weather condition code to a gradient theme class.
 * @param {number} weatherId — OWM condition code
 * @param {string} icon — OWM icon code (contains 'd' or 'n')
 * @returns {string} CSS class suffix
 */
function getGradientTheme(weatherId, icon) {
  const isNight = icon.endsWith('n');

  if (weatherId >= 200 && weatherId < 300) return 'thunderstorm';
  if (weatherId >= 300 && weatherId < 400) return 'rain';
  if (weatherId >= 500 && weatherId < 505) return 'rain';
  if (weatherId >= 505 && weatherId < 600) return 'heavy-rain';
  if (weatherId >= 600 && weatherId < 700) return 'snow';
  if (weatherId >= 700 && weatherId < 800) return 'mist';
  if (weatherId === 800) return isNight ? 'clear-night' : 'clear-day';
  if (weatherId > 800) return 'clouds';
  return 'default';
}

/**
 * Update the animated background gradient based on weather.
 * @param {number} weatherId
 * @param {string} icon
 */
export function updateBackground(weatherId, icon) {
  const theme = getGradientTheme(weatherId, icon);
  // Remove all theme classes
  dom.bgGradient.className = 'bg-gradient';
  // Force reflow for smooth transition
  void dom.bgGradient.offsetWidth;
  dom.bgGradient.classList.add(`bg-gradient--${theme}`);
}

// ─── RENDER: HERO SECTION ───

/**
 * Render the hero/current weather section.
 * @param {Object} current — current weather from One Call API
 * @param {Object} city — geocoded city info
 * @param {number} timezoneOffset — timezone offset in seconds
 */
export function renderHero(current, city, timezoneOffset) {
  const { name, country, state } = city;
  const location = state ? `${name}, ${state}, ${country}` : `${name}, ${country}`;
  dom.heroCity.textContent = location;

  // Local time based on timezone offset
  const now = new Date((current.dt + timezoneOffset) * 1000);
  const timeStr = now.toLocaleString('en-US', {
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC',
  });
  dom.heroTime.textContent = timeStr;

  // Weather icon from OWM
  const iconCode = current.weather[0].icon;
  dom.heroIcon.src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
  dom.heroIcon.alt = current.weather[0].description;

  // Temperature
  dom.heroTemp.textContent = `${Math.round(current.temp)}°C`;

  // Description
  dom.heroDesc.textContent = current.weather[0].description;

  // Feels like
  dom.heroFeels.textContent = `Feels like ${Math.round(current.feels_like)}°C`;
}

// ─── RENDER: HOURLY TIMELINE ───

/**
 * Render horizontally scrolling hourly forecast cards.
 * @param {Array} hourly — hourly array from One Call API (up to 48 hours)
 * @param {number} timezoneOffset
 */
export function renderHourly(hourly, timezoneOffset) {
  // Show next 24 hours
  const items = hourly.slice(0, 24);
  dom.hourlyScroll.innerHTML = '';

  items.forEach((hour, index) => {
    const time = new Date((hour.dt + timezoneOffset) * 1000);
    const timeStr = index === 0
      ? 'Now'
      : time.toLocaleString('en-US', { hour: 'numeric', hour12: true, timeZone: 'UTC' });

    const iconCode = hour.weather[0].icon;
    const temp = Math.round(hour.temp);

    const card = document.createElement('article');
    card.className = 'hourly-card glass-card fade-in';
    card.style.animationDelay = `${Math.min(index * 0.04, 0.8)}s`;
    card.innerHTML = `
      <p class="hourly-card__time">${timeStr}</p>
      <img class="hourly-card__icon" src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${hour.weather[0].description}" width="36" height="36" loading="lazy" />
      <p class="hourly-card__temp">${temp}°</p>
    `;
    dom.hourlyScroll.appendChild(card);
  });
}

// ─── RENDER: DAILY FORECAST ───

/**
 * Render the 7-day daily forecast grid.
 * @param {Array} daily — daily array from One Call API
 * @param {number} timezoneOffset
 */
export function renderDaily(daily, timezoneOffset) {
  const items = daily.slice(0, 7);
  dom.dailyGrid.innerHTML = '';

  items.forEach((day, index) => {
    const date = new Date((day.dt + timezoneOffset) * 1000);
    const dayName = index === 0
      ? 'Today'
      : date.toLocaleString('en-US', { weekday: 'short', timeZone: 'UTC' });
    const dateStr = date.toLocaleString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });

    const iconCode = day.weather[0].icon;
    const desc = day.weather[0].description;
    const high = Math.round(day.temp.max);
    const low = Math.round(day.temp.min);

    const card = document.createElement('article');
    card.className = 'daily-card glass-card fade-in';
    card.style.animationDelay = `${index * 0.06}s`;
    card.innerHTML = `
      <div class="daily-card__day">
        ${dayName}
        <span class="daily-card__date">${dateStr}</span>
      </div>
      <img class="daily-card__icon" src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${desc}" width="40" height="40" loading="lazy" />
      <p class="daily-card__desc">${desc}</p>
      <div class="daily-card__temps">
        <span class="daily-card__high">${high}°</span>
        <span class="daily-card__low">${low}°</span>
      </div>
    `;
    dom.dailyGrid.appendChild(card);
  });
}

// ─── RENDER: ADVANCED METRICS ───

/**
 * Get cardinal wind direction from degrees.
 * @param {number} deg
 * @returns {string}
 */
function windDirection(deg) {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return dirs[Math.round(deg / 22.5) % 16];
}

/**
 * Format unix timestamp to time string.
 * @param {number} unix
 * @param {number} timezoneOffset
 * @returns {string}
 */
function formatTime(unix, timezoneOffset) {
  const date = new Date((unix + timezoneOffset) * 1000);
  return date.toLocaleString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC',
  });
}

/**
 * Get a human-readable UV index level.
 * @param {number} uvi
 * @returns {string}
 */
function uvLevel(uvi) {
  if (uvi <= 2) return 'Low';
  if (uvi <= 5) return 'Moderate';
  if (uvi <= 7) return 'High';
  if (uvi <= 10) return 'Very High';
  return 'Extreme';
}

/**
 * Render the 3x2 advanced metrics grid.
 * @param {Object} current — current weather data
 * @param {number} timezoneOffset
 */
export function renderMetrics(current, timezoneOffset) {
  const metrics = [
    {
      icon: ICONS.humidity,
      label: 'Humidity',
      value: `${current.humidity}%`,
      sub: `Dew point: ${Math.round(current.dew_point)}°C`,
    },
    {
      icon: ICONS.wind,
      label: 'Wind',
      value: `${current.wind_speed.toFixed(1)} m/s`,
      sub: `Direction: ${windDirection(current.wind_deg)} (${current.wind_deg}°)`,
    },
    {
      icon: ICONS.uv,
      label: 'UV Index',
      value: current.uvi.toFixed(1),
      sub: uvLevel(current.uvi),
    },
    {
      icon: ICONS.pressure,
      label: 'Pressure',
      value: `${current.pressure} hPa`,
      sub: current.pressure > 1013 ? 'Above average' : 'Below average',
    },
    {
      icon: ICONS.visibility,
      label: 'Visibility',
      value: `${(current.visibility / 1000).toFixed(1)} km`,
      sub: current.visibility >= 10000 ? 'Clear' : 'Reduced',
    },
    {
      icon: ICONS.sunrise,
      label: 'Sunrise / Sunset',
      value: formatTime(current.sunrise, timezoneOffset),
      sub: `Sunset: ${formatTime(current.sunset, timezoneOffset)}`,
    },
  ];

  dom.metricsGrid.innerHTML = '';

  metrics.forEach((m, index) => {
    const card = document.createElement('article');
    card.className = 'metric-card glass-card fade-in';
    card.style.animationDelay = `${index * 0.07}s`;
    card.innerHTML = `
      <div class="metric-card__header">
        <span class="metric-card__icon">${m.icon}</span>
        <span class="metric-card__label">${m.label}</span>
      </div>
      <p class="metric-card__value">${m.value}</p>
      <p class="metric-card__sub">${m.sub}</p>
    `;
    dom.metricsGrid.appendChild(card);
  });
}

// ─── SEARCH FORM ACCESS ───

/**
 * Get references to search form elements for event binding.
 */
export function getSearchElements() {
  return {
    form: dom.searchForm,
    input: dom.searchInput,
  };
}
