# 🌤️ Weather Dashboard

A premium, real-time weather dashboard built with vanilla HTML, CSS, and JavaScript. Search any city to get current conditions, hourly forecasts, multi-day outlooks, and detailed meteorological metrics — all in a beautifully designed, responsive interface.

![Weather Dashboard Preview](https://img.shields.io/badge/Status-Live-brightgreen) ![License](https://img.shields.io/badge/License-MIT-blue)

---

## ✨ Features

- **🔍 City Search** — Instant geocoding-powered search for any city worldwide
- **🌡️ Current Conditions** — Real-time temperature, feels-like, and weather description
- **⏱️ Hourly Forecast** — Scrollable hourly timeline with temperature and icons
- **📅 Multi-Day Forecast** — Up to 7-day forecast with high/low temperatures
- **📊 Advanced Metrics** — Humidity, wind speed, pressure, visibility, sunrise/sunset, and more
- **🎨 Dynamic Backgrounds** — Animated gradient backgrounds that change based on weather conditions
- **⚡ Skeleton Loading** — Smooth loading states with skeleton placeholders
- **🔔 Toast Notifications** — User-friendly error and warning messages
- **📱 Fully Responsive** — Works beautifully on desktop, tablet, and mobile

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **HTML5** | Semantic structure |
| **CSS3** | Styling, animations, glassmorphism effects |
| **JavaScript (ES Modules)** | Application logic, API integration |
| **OpenWeather API** | Weather data (free tier) |
| **Google Fonts (Inter)** | Modern typography |

---

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Edge, Safari)
- An [OpenWeather API key](https://openweathermap.org/api) (free tier works)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Nishant8839/weatherapp.git
   cd weatherapp
   ```

2. **Add your API key**
   
   Open `api.js` and replace the API key with your own:
   ```js
   const API_KEY = 'YOUR_API_KEY_HERE';
   ```

3. **Run the app**
   
   Open `index.html` directly in your browser, or serve it locally:
   ```bash
   npx http-server . -p 8080
   ```

4. **Search for a city** and enjoy the weather dashboard! 🌍

---

## 📁 Project Structure

```
weatherapp/
├── index.html      # Main HTML — layout, skeleton loaders, semantic structure
├── styles.css      # All styling — animations, glassmorphism, responsive design
├── app.js          # Application controller — orchestrates API and UI
├── api.js          # Data layer — geocoding, weather fetching, normalization
├── ui.js           # UI rendering engine — DOM updates, toasts, backgrounds
└── README.md       # This file
```

---

## 🏗️ Architecture

The app follows a clean **3-layer architecture**:

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   app.js    │────▶│   api.js    │────▶│ OpenWeather  │
│ Controller  │     │ Data Layer  │     │     API      │
└──────┬──────┘     └─────────────┘     └─────────────┘
       │
       ▼
┌─────────────┐
│   ui.js     │
│  Rendering  │
└─────────────┘
```

- **`app.js`** — Handles user interactions, coordinates data fetching and rendering
- **`api.js`** — Manages geocoding, weather API calls, and data normalization
- **`ui.js`** — Pure DOM rendering, background effects, and UI state management

---

## 🎨 Design Highlights

- **Glassmorphism** cards with backdrop blur and subtle borders
- **Animated gradient** backgrounds that adapt to weather conditions (clear, cloudy, rain, snow, thunderstorm)
- **Micro-animations** on hover, load, and transitions
- **Skeleton loading** screens for seamless UX
- **Inter font family** for clean, modern typography

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- [OpenWeather](https://openweathermap.org/) for the free weather API
- [Google Fonts](https://fonts.google.com/specimen/Inter) for the Inter typeface

---

<p align="center">Made with ❤️ by <a href="https://github.com/Nishant8839">Nishant8839</a></p>
