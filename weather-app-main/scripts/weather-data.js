async function getLocation(location){
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`;
    const response = await fetch(url);
    const data = await response.json();

    if(!data.results || data.results.length === 0){
        throw new Error("city not found");
    }

    return {
    longitude:data.results[0].longitude,
    latitude: data.results[0].latitude,
    name: data.results[0].name,
    country: data.results[0].country
}

}

function getDateData(){
    let options = {weekday:"long", month: "long", day:"numeric",year:"numeric"}
    let date = new Date().toLocaleDateString("en-US", options);
    return date;
}

let dateSpan = document.querySelector(".dateDisplay");
let today = getDateData();
dateSpan.textContent = today;


function calculateFeelsLike(temp, humidity, wind) {
  let feelsLike = temp;

  if (temp >= 27 && humidity >= 40) {
    const T = temp;
    const RH = humidity;

    feelsLike =
      -8.784695 + 1.61139411*T + 2.33854900*RH
      - 0.14611605*T*RH - 0.01230809*T*T
      - 0.01642482*RH*RH + 0.00221173*T*T*RH
      + 0.00072546*T*RH*RH - 0.00000358*T*T*RH*RH;
  }


  else if (temp <= 10 && windKmh >= 4.8) {
    const T = temp;
    const V = wind;

    feelsLike =
      13.12 + 0.6215*T - 11.37*Math.pow(V, 0.16) +
      0.3965*T*Math.pow(V, 0.16);
  }

  return feelsLike.toFixed(1);
}


async function fetchWeather(latitude, longitude){
    const url =  `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relativehumidity_2m,precipitation&daily=temperature_2m_max,temperature_2m_min`;
    const response = await fetch(url);
    const data = await response.json();

    const current = data.current_weather;

   const index = data.hourly.time.findIndex(
  t => new Date(t).getHours() === new Date(current.time).getHours()
  );

    const humidity = data.hourly.relativehumidity_2m[index];
    const precipitation = data.hourly.precipitation[index];
    const windSpeed = current.windspeed;
    const feelsLike = calculateFeelsLike(current.temperature, humidity, windSpeed);

    const dailyData = data.daily;

    return {current, humidity, precipitation, windSpeed, feelsLike, dailyData};
}


function renderWeather(weatherData) {
  let {current, humidity, precipitation, windSpeed, feelsLike} = weatherData;
  const tempDiv = document.querySelector(".temperatureDisplay");
  tempDiv.textContent = `${current.temperature}°C`;

  const humidityDiv = document.querySelector(".humidityDisplayData");
  humidityDiv.textContent = `${humidity}%`;

  const precipitationDiv = document.querySelector(".precipitationDisplayData");
  precipitationDiv.textContent = `${precipitation}mm`;

  const windSpeedDiv = document.querySelector('.windDisplayData');
  windSpeedDiv.textContent = `${windSpeed}km/h`;

  const feelsLikeDiv = document.querySelector(".apparentTempDisplayData");
  feelsLikeDiv.textContent = `${feelsLike}°`;
}

function renderDailyData(dailyData){
    const dailyForecastCard = document.querySelector(".daycard");
    dailyData.time.forEach((index)=>{
      dailyForecastCard.innerHTML = ` <p>Max: ${dailyData.temperature_2m_max[index]}°C</p>
      <p>Min: ${dailyData.temperature_2m_min[index]}°C</p>`
    })

}


async function connectWithSearchBtn(){
    const location = document.querySelector(".searchInput").value.trim();
    if(!location) return;

    try{
        let {name, country, latitude, longitude} = await getLocation(location);
        const locationSpan = document.querySelector(".locationDisplay");
        locationSpan.textContent = name + ", " + country;
        const weather = await fetchWeather(latitude, longitude);
        renderWeather(weather); 
        renderDailyData(weather.dailyData);
    } catch(err){
       alert(err.message);
    }
}


document.querySelector(".searchButton").addEventListener("click", (e)=>{
    e.preventDefault();
    connectWithSearchBtn();
});