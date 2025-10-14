

/*function createUnitButtonContent(){
    const existing = document.querySelector(".unitsContent");
    if(existing){
        existing.remove();
        return;
    }

    const dropDownWraper = document.querySelector(".unitsDropdown");
    
    
    const unitsContent =  document.createElement("div");
    unitsContent.className = "unitsContent";
   

    function createUnitDiv(textDivName , className , button1Text, button1Class,button2Text, button2Class){
        const div = document.createElement("div");
        const textDiv = document.createElement("div");
        textDiv.textContent = textDivName;
        textDiv.className = className;

        const button1 = document.createElement("button");
        button1.textContent = button1Text;
        button1.className = button1Class ;

        const button2 = document.createElement("button");
        button2.textContent= button2Text;
        button2.className = button2Class;

        div.appendChild(textDiv);
        textDiv.append(button1, button2);
        return div;
    }

    const temperatureUnit = createUnitDiv("TEMPERATURE", "temperatureUnit", "Celcius (°C)", "celciusSpan active", "Fahrenheit(°F)", "fahrenheitSpan ");
    const windSpeedUnit = createUnitDiv("WIND SPEED", "windSpeedUnit", "km/h", "kmhSpan active", "mph", "mphSpan");
    const precipitationUnit = createUnitDiv("PRECIPITATION", "precipitationUnit", "Milimeters(mm)", "mmSpan active", "Inches(in)", "inSpan");


    dropDownWraper.appendChild(unitsContent);
    unitsContent.append(temperatureUnit,windSpeedUnit,precipitationUnit);
    
}

let currentunit = "Celcius";

window.lastWeatherData = null;


function cToF(c) {
  return (c * 9/5) + 32;
}

function fToC(f) {
  return (f - 32) * 5/9;
}

function handleUnitButton(){
    const unitButton = document.querySelector(".unitsDropdown");
    unitButton.addEventListener("click", createUnitButtonContent);
}

handleUnitButton();*/