# what cards to be added

- A search bar to type the location to get information and a search button beside it.
- A temperature display card. Within it location span, date span and temperature span to show location, date and temperature.
- A weather detail card that will contain temperature card, humidity card, wind card and precipitation card.
- a weekDays card that will contain 7 days card to display weather of that week.
- A hourly display weather card.
- A units dropdown to display weather details in different unit.

# Execution

- Make API call to open meteo API
- obtain longitude and latitude of that place to show the temperature.
- request hourly variables explicitly to get feels like, precipitaion and humidity
- get hourly temperature with time by modifying the API call.
- get min and max temperature of everyday by adding daily variables in API call.