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
    location: data.results[0].name
}

}

async function fetchWeather(latitude, longitude){
    const url =  `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
    const response = await fetch(url);
    const data = await response.json();
    return data.current_weather;
}

function renderWeather(weatherData) {
  const tempDiv = document.querySelector(".temperatureDisplay");
  tempDiv.textContent = `Temperature: ${weatherData.temperature}°C`;
}

async function connectWithSearchBtn(){
    const city = document.querySelector(".searchInput").value.trim();
    if(!city) return;

    try{
        const location = await getLocation(city);
        const weather = await fetchWeather(location.latitude, location.longitude);
        renderWeather(weather); 
    } catch(err){
       alert(err.message);
    }
}


document.querySelector(".searchButton").addEventListener("click", (e)=>{
    e.preventDefault();
    connectWithSearchBtn();
});