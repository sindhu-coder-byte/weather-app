import React, { useState } from "react";
import "./App.css";
import { FaSearch } from "react-icons/fa";
import {
  WiDaySunny,
  WiCloud,
  WiRain,
  WiSnow,
  WiThunderstorm,
  WiFog,
  WiStrongWind,
  WiHumidity,
  WiThermometer,
} from "react-icons/wi";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  const fetchWeather = async () => {
    if (!city.trim()) {
      setError("Please enter a valid city name.");
      return;
    }

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );

      if (!res.ok) throw new Error("City not found!");

      const data = await res.json();
      setWeather(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") fetchWeather();
  };

  const getWeatherIcon = (condition) => {
    const cond = condition.toLowerCase();
    if (cond.includes("cloud")) return <WiCloud size={90} color="#555" />;
    if (cond.includes("rain")) return <WiRain size={90} color="#0077ff" />;
    if (cond.includes("clear")) return <WiDaySunny size={90} color="#ffcc00" />;
    if (cond.includes("snow")) return <WiSnow size={90} color="#00bfff" />;
    if (cond.includes("thunder")) return <WiThunderstorm size={90} color="#673ab7" />;
    if (cond.includes("mist") || cond.includes("fog")) return <WiFog size={90} color="#607d8b" />;
    return <WiStrongWind size={90} color="#444" />;
  };

  const getWeatherBackground = () => {
    if (!weather) return "default-bg";
    const condition = weather.weather[0].main.toLowerCase();
    if (condition.includes("cloud")) return "cloudy-bg";
    if (condition.includes("rain")) return "rainy-bg";
    if (condition.includes("clear")) return "sunny-bg";
    if (condition.includes("snow")) return "snowy-bg";
    return "default-bg";
  };

  return (
    <div className={`app ${getWeatherBackground()}`}>
      <div className="container">
        <h1 className="title">🌤️ Weather Forecast</h1>

        {/* Search Box */}
        <div className="search-box">
          <div className="input-wrapper">
            <FaSearch className="search-icon" onClick={fetchWeather} />
            <input
              type="text"
              placeholder="Enter city name"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
        </div>

        {/* Loading & Error */}
        {loading && <div className="loader"></div>}
        {error && <p className="error">{error}</p>}

        {/* Weather Data */}
        {weather && (
          <div className="weather-card fade-in">
            <h2 className="city-name">{weather.name}</h2>

            <div className="weather-main">
              {getWeatherIcon(weather.weather[0].main)}
              <h3>{weather.weather[0].main}</h3>
              <p className="desc">"{weather.weather[0].description}"</p>
            </div>

            {/* Weather Info Grid */}
            <div className="weather-grid">
              <div className="weather-info">
                <WiThermometer className="icon" color="#ff5722" />
                <p>{weather.main.temp}°C</p>
                <span>Temperature</span>
              </div>

              <div className="weather-info">
                <WiHumidity className="icon" color="#2196f3" />
                <p>{weather.main.humidity}%</p>
                <span>Humidity</span>
              </div>

              <div className="weather-info">
                <WiStrongWind className="icon" color="#607d8b" />
                <p>{weather.wind.speed} m/s</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
