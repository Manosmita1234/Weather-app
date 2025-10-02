

function createUnitButtonContent(){
    const existing = document.querySelector(".unitsContent");
    if(existing){
        existing.remove();
        return;
    }

    const dropDownWraper = document.querySelector(".unitsDropdown");
    
    
    const unitsContent =  document.createElement("div");
    unitsContent.className = "unitsContent";
   

    function createUnitDiv(textDivName , className , button1Text, button2Text){
        const div = document.createElement("div");
        const textDiv = document.createElement("div");
        textDiv.className = className;
        textDiv.textContent = textDivName;

        const button1 = document.createElement("button");
        button1.textContent = button1Text;
        button1.className = "unitButton"
        const button2 = document.createElement("button");
        button2.textContent = button2Text;
        button2.className = "unitButton";

        div.appendChild(textDiv);
        textDiv.append(button1, button2);
        return div;
    }

    const temperatureUnit = createUnitDiv("TEMPERATURE", "temperatureUnit", "Celcius (°C)", "Fahrenheit(°F)");
    const windSpeedUnit = createUnitDiv("WIND SPEED", "windSpeedUnit", "km/h", "mph");
    const precipitationUnit = createUnitDiv("PRECIPITATION", "precipitationUnit", "Milimeters(mm)", "Inches(in)");


    dropDownWraper.appendChild(unitsContent);
    unitsContent.append(temperatureUnit,windSpeedUnit,precipitationUnit);
    
}

function handleUnitButton(){
    const unitButton = document.querySelector(".unitsDropdown");
    unitButton.addEventListener("click", createUnitButtonContent);
}

handleUnitButton();