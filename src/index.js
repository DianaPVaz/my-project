let now = new Date();
let today = document.querySelector("#date");
let time = document.querySelector("#time");

let date = now.getDate();

let minutes = now.getMinutes();
if (minutes < 10) {
  minutes = `0${minutes}`;
}
let hour = now.getHours();
if (hour < 10) {
  hour = `0${hour}`;
}

let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
let day = days[now.getDay()];

let months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
let month = months[now.getMonth()];
today.innerHTML = `${day}, ${month} ${date}`;
time.innerHTML = `${hour}:${minutes}`;

function formatDay(timeStamp) {
  let date = new Date(timeStamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function displayForecast(response) {
  console.log(response.data.daily);
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if ((index > 0) & (index < 6)) {
      forecastHTML =
        forecastHTML +
        `
        <div class="col following-days"> ${formatDay(
          forecastDay.dt
        )} <div> <img src="http://openweathermap.org/img/wn/${
          forecastDay.weather[0].icon
        }.png"></div>
          <div> ${Math.round(forecastDay.temp.max)}° | ${Math.round(
          forecastDay.temp.min
        )}°</div>
        </div>       `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "05d4c4d3a2e5e07dfee4452fa88bf546";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function searchCity(city) {
  let apiKey = "05d4c4d3a2e5e07dfee4452fa88bf546";

  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeatherCondition);
}

function displayWeatherCondition(response) {
  celsiusTemperature = response.data.main.temp;
  document.querySelector("#city").innerHTML = response.data.name;
  document.querySelector("#temperature").innerHTML =
    Math.round(celsiusTemperature);

  document.querySelector("#max").innerHTML = Math.round(
    response.data.main.temp_max
  );
  document.querySelector("#min").innerHTML = Math.round(
    response.data.main.temp_min
  );

  console.log(response.data);
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#description").innerHTML =
    response.data.weather[0].description;
  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  searchCity(city);
}

function searchLocation(position) {
  let apiKey = "05d4c4d3a2e5e07dfee4452fa88bf546";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeatherCondition);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", getCurrentLocation);

///function displayToFahrenheitTemperature(event) {
//event.preventDefault();
//let temperatureElement = document.querySelector("#temperature");
//celsiusLink.classList.remove("active");
//fahrenheitLink.classList.add("active");
//let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
//temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
//}
//function displayCelsiusTemperature(event) {
//event.preventDefault();
//celsiusLink.classList.add("active");
//fahrenheitLink.classList.remove("active");
//let temperatureElement = document.querySelector("#temperature");
//temperatureElement.innerHTML = Math.round(celsiusTemperature);
//}
//let celsiusTemperature = null;

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

//let fahrenheitLink = document.querySelector("#fahrenheit-link");
//fahrenheitLink.addEventListener("click", displayToFahrenheitTemperature);

//let celsiusLink = document.querySelector("#celsius-link");
//celsiusLink.addEventListener("click", displayCelsiusTemperature);
searchCity("New York");
