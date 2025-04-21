# 🌦️ SkyWhisper

https://skywhisper.onrender.com

A dynamic weather application built with Node.js, Express, and EJS that provides weather information based on the user's current location or a searched city. Uses the OpenWeatherMap API to fetch real-time weather data and a 5-day forecast.

## 🔧 Features

- Get current weather using your location (via Geolocation API)
- Search weather by city name
- Shows temperature, humidity, and weather condition
- Forecast for the next day with rain prediction
- Responsive and Clean UI using EJS, Bootstrap and Swiper integration

## 🛠️ Tech Stack

- Node.js
- Express.js
- EJS Templating
- Axios for HTTP requests
- Bootstrap for UI styling
- Swiper.js for responsive sliders
- Dotenv for managing environment variables
- Nodemon for development

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/its-mehtab/SkyWhisper.git
cd SkyWhisper
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create a .env file in the root directory

```bash
PORT=3000
WEATHER_API_KEY=your_openweathermap_api_key
```

### 4. Start the application

```bash
node index.js or nodemon index.js
```

### 5. Open in your browser

http://localhost:3000

📁 Project Structure

```bash
weather-app/
├── public/ # Static files (CSS, JS)
├── views/ # EJS templates
├── .env # Environment variables
├── index.js # Main server file
└── README.md
```

#### 🌐 API Used

OpenWeatherMap API
