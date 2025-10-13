async function getLocation(location) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`;
  const response = await fetch(url);
  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error("City not found");
  }

  return {
    longitude: data.results[0].longitude,
    latitude: data.results[0].latitude,
    name: data.results[0].name,
    country: data.results[0].country,
  };
}

function getDateData() {
  let options = { weekday: "long", month: "long", day: "numeric", year: "numeric" };
  return new Date().toLocaleDateString("en-US", options);
}

document.querySelector(".dateDisplay").textContent = getDateData();

function calculateFeelsLike(temp, humidity, wind) {
  let feelsLike = temp;

  if (temp >= 27 && humidity >= 40) {
    const T = temp;
    const RH = humidity;
    feelsLike =
      -8.784695 +
      1.61139411 * T +
      2.33854900 * RH -
      0.14611605 * T * RH -
      0.01230809 * T * T -
      0.01642482 * RH * RH +
      0.00221173 * T * T * RH +
      0.00072546 * T * RH * RH -
      0.00000358 * T * T * RH * RH;
  } else if (temp <= 10 && wind >= 4.8) {
    const T = temp;
    const V = wind;
    feelsLike =
      13.12 +
      0.6215 * T -
      11.37 * Math.pow(V, 0.16) +
      0.3965 * T * Math.pow(V, 0.16);
  }

  return feelsLike.toFixed(1);
}

async function fetchWeather(latitude, longitude) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,weathercode,relativehumidity_2m,precipitation&daily=temperature_2m_max,temperature_2m_min,weathercode`;
  const response = await fetch(url);
  const data = await response.json();

  const current = data.current_weather;
  const index = data.hourly.time.findIndex(
    (t) => new Date(t).getHours() === new Date(current.time).getHours()
  );

  const humidity = data.hourly.relativehumidity_2m[index];
  const precipitation = data.hourly.precipitation[index];
  const windSpeed = current.windspeed;
  const feelsLike = calculateFeelsLike(current.temperature, humidity, windSpeed);

  const dailyData = data.daily;
  const hourlyData = data.hourly;
  const weatherCode = current.weathercode;

  return { current, humidity, precipitation, windSpeed, feelsLike, dailyData, hourlyData, weatherCode };
}

function renderWeather(weatherData) {
  const { current, humidity, precipitation, windSpeed, feelsLike } = weatherData;

  document.querySelector(".temperatureDisplay").textContent = `${Math.round(current.temperature)}°C`;
  document.querySelector(".humidityDisplayData").textContent = `${humidity}%`;
  document.querySelector(".precipitationDisplayData").textContent = `${precipitation}mm`;
  document.querySelector(".windDisplayData").textContent = `${Math.round(windSpeed)}km/h`;
  document.querySelector(".apparentTempDisplayData").textContent = `${Math.round(feelsLike)}°`;
}

function renderDailyData(dailyData) {
  let dayCards = document.querySelectorAll(".dayCard");

  dailyData.time.slice(0, 7).forEach((date, index) => {
    const dayCard = dayCards[index];
    if (!dayCard) return;

    const maxTempDiv = dayCard.querySelector(".maxTemp");
    const minTempDiv = dayCard.querySelector(".minTemp");
    const daySpan = dayCard.querySelector(".day");
    const dailyIcon = dayCard.querySelector(".dailyTempIconDisplay");

    const dayName = new Date(date).toLocaleDateString("en-US", { weekday: "short" });
    daySpan.textContent = dayName;

    maxTempDiv.textContent = `${Math.round(dailyData.temperature_2m_max[index])}°`;
    minTempDiv.textContent = `${Math.round(dailyData.temperature_2m_min[index])}°`;

    const code = dailyData.weathercode[index];
    dailyIcon.src = weatherIconMap[code] || "./assets/images/icon-sunny.webp";
  });
}

function renderHourlyData(hourlyData) {
  const { time, temperature_2m, weathercode } = hourlyData;
  const container = document.querySelector(".hourlyForecast");
  container.innerHTML = ""; // clear previous cards

  const now = new Date();
  const cutoff = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  for (let i = 0; i < time.length; i++) {
    const date = new Date(time[i]);
    if (date > cutoff) break;
    if (date >= now && date.getHours() % 3 === 0) {
      const hourCard = document.createElement("div");
      hourCard.className = "hourCard";

      const icon = document.createElement("img");
      icon.className = "hourWeatherIcon";
      icon.src = weatherIconMap[weathercode[i]] || "./assets/images/icon-sunny.webp";
      icon.alt = "weather icon";

      const timeSpan = document.createElement("span");
      timeSpan.className = "hourlyHourSpan";
      timeSpan.textContent = date.toLocaleString("en-US", { hour: "numeric", hour12: true });

      const tempSpan = document.createElement("span");
      tempSpan.className = "hourlyDataSpan";
      tempSpan.textContent = `${Math.round(temperature_2m[i])}°C`;

      hourCard.append(icon, timeSpan, tempSpan);
      container.appendChild(hourCard);
    }
  }
}


async function connectWithSearchBtn() {
  const location = document.querySelector(".searchInput").value.trim();
  if (!location) return;

  try {
    const { name, country, latitude, longitude } = await getLocation(location);
    document.querySelector(".locationDisplay").textContent = `${name}, ${country}`;
    const weather = await fetchWeather(latitude, longitude);
    renderWeather(weather);
    renderDailyData(weather.dailyData);
    renderHourlyData(weather.hourlyData);
    displayWeatherIcon(weather.weatherCode);
  } catch (err) {
    alert(err.message);
  }
}


document.querySelector(".searchButton").addEventListener("click", (e) => {
  e.preventDefault();
  connectWithSearchBtn();
});

function createdayList() {
  const existing = document.querySelector(".dayDiv");
  if (existing) {
    existing.remove();
    return;
  }

  const dayBtn = document.querySelector(".dayDisplay");
  const dayDiv = document.createElement("div");
  dayDiv.className = "dayDiv";

  const days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
  days.forEach((d) => {
    const btn = document.createElement("button");
    btn.textContent = d;
    dayDiv.appendChild(btn);
  });

  dayBtn.appendChild(dayDiv);
}

document.querySelector(".dayDisplay").addEventListener("click", createdayList);

const weatherIconMap = {
  0: "./assets/images/icon-sunny.webp",
  2: "./assets/images/icon-partly-cloudy.webp",
  3: "./assets/images/icon-overcast.webp",
  45: "./assets/images/icon-fog.webp",
  51: "./assets/images/icon-drizzle.webp",
  61: "./assets/images/icon-rain.webp",
  71: "./assets/images/icon-snow.webp",
  95: "./assets/images/icon-storm.webp",
};

function displayWeatherIcon(weatherCode) {
  const iconSrc = weatherIconMap[weatherCode] || "./assets/images/icon-sunny.webp";
  const iconDisplay = document.querySelector(".iconDisplay");
  if (iconDisplay) {
    iconDisplay.src = iconSrc;
    iconDisplay.alt = "weather icon";
  }
}
