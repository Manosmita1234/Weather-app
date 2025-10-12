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
    const url =  `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,,weather_code,relativehumidity_2m,precipitation&daily=temperature_2m_max,temperature_2m_min&current=weather_code`;
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
    const hourlyData = data.hourly;
    console.log(data.hourly.weather_code);
    console.log(data.current.weather_code);

    return {current, humidity, precipitation, windSpeed, feelsLike, dailyData, hourlyData};
}


function renderWeather(weatherData) {
  let {current, humidity, precipitation, windSpeed, feelsLike} = weatherData;
  const tempDiv = document.querySelector(".temperatureDisplay");
  tempDiv.textContent = `${Math.round(current.temperature)}°C`;

  const humidityDiv = document.querySelector(".humidityDisplayData");
  humidityDiv.textContent = `${humidity}%`;

  const precipitationDiv = document.querySelector(".precipitationDisplayData");
  precipitationDiv.textContent = `${precipitation}mm`;

  const windSpeedDiv = document.querySelector('.windDisplayData');
  windSpeedDiv.textContent = `${Math.round(windSpeed)}km/h`;

  const feelsLikeDiv = document.querySelector(".apparentTempDisplayData");
  feelsLikeDiv.textContent = `${Math.round(feelsLike)}°`;
}


function renderDailyData(dailyData) {
  let dayCards = document.querySelectorAll(".dayCard");
  
  dailyData.time.slice(0,7).forEach((date, index) => {
    const dayCard = dayCards[index];
    if (!dayCard) return;
  
    let maxTempDiv = dayCard.querySelector(".maxTemp");
    let minTempDiv = dayCard.querySelector(".minTemp");
    let daySpan = dayCard.querySelector(".day");

    const dayName = new Date(date).toLocaleDateString("en-US", { weekday: "short" });
    if (daySpan) daySpan.textContent = dayName;

    let maxTemperature = Math.round(dailyData.temperature_2m_max[index]);
    let minTemperature = Math.round(dailyData.temperature_2m_min[index]); 

    if (maxTempDiv) maxTempDiv.textContent = `${maxTemperature}°`;
    if (minTempDiv) minTempDiv.textContent = `${minTemperature}°`;
  });
}


function renderHourlyData(hourlyData){
    const timeArray = hourlyData.time;
    const tempArray = hourlyData.temperature_2m;

    const container = document.querySelector(".hourlyForecast");

    const now = new Date();
    const cutoff = new Date(now.getTime() + 24 * 60 * 60 * 1000); 

    for(let i=0; i<timeArray.length; i++){
        const date = new Date(timeArray[i]);
        const hour = date.getHours();

        if(date > cutoff) break;
 

        if(hour % 3 ==0 && date>=now){
            const hourCard = document.createElement("div");
            hourCard.className = "hourCard";

            const hourlyHourSpan = document.createElement("span");
            hourlyHourSpan.className = "hourlyHourSpan";

            const hourlyDataSpan = document.createElement("span");
            hourlyDataSpan.className = "hourlyDataSpan";

            let hourLabel = date.toLocaleString('en-US', { hour: 'numeric', hour12: true });
            let temp = Math.round(tempArray[i]);

            hourlyHourSpan.innerHTML = `${hourLabel}`;
            hourlyDataSpan.innerHTML = `${temp}°C`;
            container.appendChild(hourCard);
            hourCard.append(hourlyHourSpan, hourlyDataSpan);
            
        }

    }

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
        renderHourlyData(weather.hourlyData);
    } catch(err){
       alert(err.message);
    }
}


document.querySelector(".searchButton").addEventListener("click", (e)=>{
    e.preventDefault();
    connectWithSearchBtn();
});


function createdayList(){
    let existing = document.querySelector(".dayDiv");
    if(existing){
        existing.remove();
        return;
    }

    let dayBtn = document.querySelector(".dayDisplay");
    let dayDiv = document.createElement("div");
    dayDiv.className = "dayDiv";

    function createDayBtn(thatDay){
    let day = document.createElement("button");
    day.textContent = thatDay;
    return day;
 
    }

    let sun = createDayBtn("Sun");
    let mon = createDayBtn("Mon");
    let tues = createDayBtn("Tues");
    let wed = createDayBtn("Wed");
    let thurs = createDayBtn("Thurs");
    let fri = createDayBtn("Fri");
    let sat = createDayBtn("Sat");
    

    dayBtn.appendChild(dayDiv);
    dayDiv.append(sun, mon, tues, wed, thurs, fri, sat);
    
}

 dayBtn = document.querySelector(".dayDisplay").addEventListener("click", ()=>{
    createdayList();
 });

