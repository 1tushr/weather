let mapCreated = false;
const fetchDataButton = document.getElementById("fetch-data");

fetchDataButton.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      console.log(latitude, longitude);

      if (!mapCreated) {
        // create map
        const map = L.map("map").setView([latitude, longitude], 13);
        L.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            attribution:
              'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
            maxZoom: 18,
          }
        ).addTo(map);

        
        const marker = L.marker([latitude, longitude]).addTo(map);

        
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
          .then(response => response.json())
          .then(data => {
            const locationName = data.display_name;
            marker.bindPopup(locationName).openPopup();
          })
          .catch(error => console.error(error));

        mapCreated = true;
      } else {
        // show alert message
        alert("Map already created!");
      }

      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=711c4d78eb670d25b9ea7c1e2244d9bb`
      )
        .then((response) => response.json())
        .then((data) => {
          const weatherDiv = document.getElementById("weather");

          // extract weather data
          const locationName = data.name;
          const TimeZone=data.timezone;
          const temperature = data.main.temp;
          const weatherDescription = data.weather[0].description;
          const humidity = data.main.humidity;
          const windSpeed = data.wind.speed;
          const pressure = data.main.pressure;
          const windDirection = data.wind.deg;
            const uvi = data.visibility;
            const feels = data.main.feels_like;


          // update HTML with weather data
          const weatherHTML = `
          <div id="info">
            <h2 id="details">Weather Data</h2>
            <div id="list">
            <ul>
              <li>Location: ${locationName}</li>
              <li>Lat: ${latitude}&nbsp;&nbsp;<span>Long: ${longitude}</span></li>

              <li>TimeZone: ${TimeZone}</li>
              <li>Wind Speed: ${windSpeed} m/s</li>
              <li>Pressure: ${pressure} hPa</li>
              <li>Humidity: ${humidity}%</li>
              <li>Wind Direction: ${windDirection}&deg</li>
              <li>UV Index: ${uvi} </li>
              <li> Feels Like: ${feels} </li>
              <li>Temperature: ${temperature} &deg;C</li>
              <li>Weather Description: ${weatherDescription}</li>
             
             
             
            </ul>
            </div>
            <div></div>
            </div>
          `;

          weatherDiv.innerHTML = weatherHTML;
        })
        .catch((error) => console.error(error));
    },
    () => {
      alert("Unable to retrieve your location");
    }
  );
});