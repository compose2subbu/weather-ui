import { useState } from "react";
import TemperatureConverter from './widgets/TemperatureConverter/index.jsx'
import WeatherWidget from './widgets/WeatherReport/index.jsx'
import './App.css'


export default function WidgetsPage() {
  

 return (
    <main className="wx-app">
      <TemperatureConverter />
      <WeatherWidget />
    </main>
  );
}
