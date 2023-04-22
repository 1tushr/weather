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

      // use OpenWeatherMap API to get weather data
      fetch(`https://api.openweathermap.org/data/3.0/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=711c4d78eb670d25b9ea7c1e2244d9bb`)
        .then(response => response.json())
        .then(data => {
          const weatherDiv = document.getElementById("weather");

          
          const temperature = data.current.temp;
          const weatherDescription = data.current.weather[0].description;
          const humidity = data.current.humidity;
          const windSpeed = data.current.wind_speed;
          const weatherHTML = `
            <h2>Weather Information:</h2>
            <ul>
              <li>Temperature: ${temperature} &deg;C</li>
              <li>Weather Description: ${weatherDescription}</li>
              <li>Humidity: ${humidity}%</li>
              <li>Wind Speed: ${windSpeed} km/h</li>
            </ul>
          `;

          
          weatherDiv.innerHTML = weatherHTML;
        })
        .catch(error => console.error(error));
    },
    () => {
      alert("Unable to retrieve your location");
    }
  );
});