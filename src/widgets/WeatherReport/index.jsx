import { useState } from "react";
import "./index.css"

export default function WeatherWidget() {
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [unit, setUnit] = useState("C");
  const [state, setState] = useState({ status: "idle" });

  const submit = async (e) => {
    e.preventDefault();
    const la = parseFloat(lat);
    const lo = parseFloat(lon);
    if (Number.isNaN(la) || la < -90 || la > 90) {
      return setState({ status: "error", message: "Latitude must be a number between -90 and 90." });
    }
    if (Number.isNaN(lo) || lo < -180 || lo > 180) {
      return setState({ status: "error", message: "Longitude must be a number between -180 and 180." });
    }

    setState({ status: "loading" });
    try {
      const res = await fetch(`${WEATHER_URL}?lat=${la}&lon=${lo}`);
      if (!res.ok) throw new Error(`Server responded with ${res.status}.`);
      const data = await res.json();
      const cur = data.current ?? {};
      setState({
        status: "done",
        temp: cur.temperature_2m ?? cur.temperature,
        wind: cur.wind_speed_10m ?? cur.windSpeed,
        code: cur.weather_code ?? cur.weatherCode,
      });
    } catch (err) {
      setState({ status: "error", message: `Could not load weather. ${err.message}` });
    }
  };

  const shown = state.status === "done" ? (unit === "C" ? state.temp : toF(state.temp)) : null;

  return (
    <section className="wx-panel" aria-labelledby="wx-title">
      <h2 id="wx-title">Current weather</h2>
      <form onSubmit={submit}>
        <div className="wx-row">
          <label>
            Latitude
            <input type="number" step="any" value={lat} onChange={(e) => setLat(e.target.value)} placeholder="13.08" required />
          </label>
          <label>
            Longitude
            <input type="number" step="any" value={lon} onChange={(e) => setLon(e.target.value)} placeholder="80.27" required />
          </label>
        </div>
        <button type="submit" disabled={state.status === "loading"}>
          {state.status === "loading" ? "Loading…" : "Get weather"}
        </button>
      </form>

      <div aria-live="polite" className="wx-result">
        {state.status === "idle" && <p className="wx-hint">Enter coordinates to see the current conditions.</p>}
        {state.status === "error" && <p className="wx-error">{state.message}</p>}
        {state.status === "done" && (
          <>
            <p className="wx-temp">
              {round(shown)}°{unit}
            </p>
            <p className="wx-cond">{describe(state.code)}</p>
            <p className="wx-hint">Wind {state.wind} km/h</p>
            <div className="wx-toggle" role="group" aria-label="Temperature unit">
              {["C", "F"].map((u) => (
                <button key={u} type="button" aria-pressed={unit === u} onClick={() => setUnit(u)}>
                  °{u}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}