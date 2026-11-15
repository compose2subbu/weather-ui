import { useState } from "react";
import "./index.css"

// Points at the Spring Boot endpoint (GET /api/weather?lat=..&lon=..).
// In production, set this to your Oracle VM address or use a relative path behind a proxy.
const WEATHER_URL = "http://localhost:8080/api/weather";

const toF = (c) => (c * 9) / 5 + 32;
const toC = (f) => ((f - 32) * 5) / 9;
const round = (n) => String(Math.round(n * 100) / 100);

// WMO weather codes returned by Open-Meteo
function describe(code) {
  if (code === 0) return "Clear sky";
  if (code <= 3) return ["Mainly clear", "Partly cloudy", "Overcast"][code - 1];
  if (code === 45 || code === 48) return "Fog";
  if (code >= 51 && code <= 57) return "Drizzle";
  if (code >= 61 && code <= 67) return "Rain";
  if (code >= 71 && code <= 77) return "Snow";
  if (code >= 80 && code <= 82) return "Rain showers";
  if (code === 85 || code === 86) return "Snow showers";
  if (code >= 95) return "Thunderstorm";
  return "Unknown";
}

export default function TemperatureConverter() {
  const [c, setC] = useState("");
  const [f, setF] = useState("");

  const fromCelsius = (v) => {
    setC(v);
    const n = parseFloat(v);
    setF(Number.isNaN(n) ? "" : round(toF(n)));
  };
  const fromFahrenheit = (v) => {
    setF(v);
    const n = parseFloat(v);
    setC(Number.isNaN(n) ? "" : round(toC(n)));
  };

  return (
    <section className="wx-panel" aria-labelledby="conv-title">
      <h2 id="conv-title">Temperature converter</h2>
      <p className="wx-hint">Type in either box and the other updates.</p>
      <label>
        Celsius (°C)
        <input
          type="number"
          inputMode="decimal"
          value={c}
          onChange={(e) => fromCelsius(e.target.value)}
          placeholder="25"
        />
      </label>
      <label>
        Fahrenheit (°F)
        <input
          type="number"
          inputMode="decimal"
          value={f}
          onChange={(e) => fromFahrenheit(e.target.value)}
          placeholder="77"
        />
      </label>
    </section>
  );
}