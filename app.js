/* ============================================================
   app.js — Main Application Controller
   Orchestrates the API layer and the UI rendering engine
   ============================================================ */

import { isApiKeyConfigured, getWeatherForCity } from './api.js';
import {
  showLoading,
  showContent,
  showWelcome,
  hideSpinner,
  showToast,
  updateBackground,
  renderHero,
  renderHourly,
  renderDaily,
  renderMetrics,
  getSearchElements,
} from './ui.js';

// ─── INITIALIZATION ───

(function init() {
  // Check API key on load
  if (!isApiKeyConfigured()) {
    showToast(
      'API key not configured. Open api.js and paste your OpenWeather API key.',
      'warn',
      8000
    );
  }

  // Bind search
  const { form, input } = getSearchElements();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = input.value.trim();
    if (!query) {
      showToast('Please enter a city name.', 'warn');
      return;
    }
    await handleSearch(query);
  });

  // Show welcome state
  showWelcome();
})();

// ─── SEARCH HANDLER ───

/**
 * Handle a city search: fetch data, render UI, handle errors.
 * @param {string} cityName
 */
async function handleSearch(cityName) {
  showLoading();

  try {
    const { city, weather } = await getWeatherForCity(cityName);

    const timezoneOffset = weather.timezone_offset;
    const current = weather.current;

    // Update dynamic background
    updateBackground(current.weather[0].id, current.weather[0].icon);

    // Render all sections
    renderHero(current, city, timezoneOffset);
    renderHourly(weather.hourly || [], timezoneOffset);
    renderDaily(weather.daily || [], timezoneOffset);
    renderMetrics(current, timezoneOffset);

    // Switch to content view
    showContent();

  } catch (err) {
    hideSpinner();
    handleError(err);
    // Stay on current view (welcome or previous data)
    const content = document.getElementById('weather-content');
    if (content.classList.contains('hidden')) {
      showWelcome();
    }
  }
}

// ─── ERROR HANDLER ───

/**
 * Map error codes/messages to user-friendly toasts.
 * @param {Error} err
 */
function handleError(err) {
  const msg = err.message;

  switch (msg) {
    case 'API_KEY_MISSING':
      showToast(
        'API key is missing. Open api.js and add your OpenWeather API key.',
        'error',
        6000
      );
      break;

    case 'API_KEY_INVALID':
      showToast(
        'Invalid API key. Please check your OpenWeather API key in api.js.',
        'error',
        6000
      );
      break;

    case 'CITY_NOT_FOUND':
      showToast(
        'City not found. Please check the spelling and try again.',
        'warn'
      );
      break;

    case 'API_RATE_LIMITED':
      showToast(
        'API rate limit reached. Please wait a moment and try again.',
        'warn',
        5000
      );
      break;

    default:
      showToast(
        `Something went wrong: ${msg}`,
        'error'
      );
      console.error('[WeatherDashboard]', err);
  }
}
