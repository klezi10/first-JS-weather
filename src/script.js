let currentTime = new Date();

let day = currentTime.getDay();

function formatDate(date) {
  let hour = currentTime.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }

  let minutes = currentTime.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  day = days[day];

  let formattedDate = `${day} ${hour}:${minutes}`;
  return formattedDate;
}

// ------------> different way to show the date
let currentDayTime = document.querySelector('#current-date-time');
currentDayTime.innerHTML = formatDate(currentTime);

// -----------------------weather code

function getForecast(coordinates) {
  console.log(coordinates);

  let apiKey = `575c34ae9e568091893014cdffd7e002`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayForecast);
}

function displayWeather(response) {
  console.log(response);
  celsiusTemperature = response.data.main.temp;

  document.querySelector('#city').innerHTML = response.data.name;
  document.querySelector('#temperature').innerHTML =
    Math.round(celsiusTemperature);
  document.querySelector('#humidity').innerHTML = response.data.main.humidity;
  document.querySelector('#wind').innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector('#description').innerHTML =
    response.data.weather[0].description;
  iconElement = document.querySelector('#icon');
  iconElement.setAttribute(
    'src',
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute('alt', response.data.weather[0].description);

  getForecast(response.data.coord);

  // document.querySelector('#current-date-time').innerHTML = formatDate(
  //   response.data.dt * 1000
  // );
}

function searchCity(city) {
  let apiKey = `575c34ae9e568091893014cdffd7e002`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayWeather);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector('#city-input').value;
  searchCity(city);
}

let searchForm = document.querySelector('#search-form');
searchForm.addEventListener('submit', handleSubmit);

// -------------------> geolocation code

function searchPosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;

  let apiKey = `575c34ae9e568091893014cdffd7e002`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayWeather);
}

function handleGeolocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchPosition);
}

let geolocationButton = document.querySelector('#geolocation-button');
geolocationButton.addEventListener('click', handleGeolocation);

//--------------->temperature conversions

function displayCelsiusTemp(event) {
  event.preventDefault();
  let currentTemperature = document.querySelector('#temperature');
  celsiusLink.classList.add('active');
  fahrenheitLink.classList.remove('active');
  currentTemperature.innerHTML = Math.round(celsiusTemperature);
}

function displayFahrenheitTemp(event) {
  event.preventDefault();
  let currentTemperature = document.querySelector('#temperature');
  celsiusLink.classList.remove('active');
  fahrenheitLink.classList.add('active');
  let fahrenheitTemperature = Math.round((celsiusTemperature * 9) / 5 + 32);
  currentTemperature.innerHTML = fahrenheitTemperature;
}

let fahrenheitLink = document.querySelector('#fahrenheit-link');
fahrenheitLink.addEventListener('click', displayFahrenheitTemp);

let celsiusLink = document.querySelector('#celsius-link');
celsiusLink.addEventListener('click', displayCelsiusTemp);

let celsiusTemperature = null;

searchCity('Bangkok'); //default city

//--------------------adding forecast JS

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();

  let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector('#weather-forecast');

  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `<div class="col-2">
                    <div class="weather-forecast-date">${formatDay(
                      forecastDay.dt
                    )}</div>
                    <img
                      src="https://openweathermap.org/img/wn/${
                        forecastDay.weather[0].icon
                      }@2x.png"
                      alt=""
                    />
                    <div class="weather-forecast-temp">
                      <span class="max-temp">${Math.round(
                        forecastDay.temp.max
                      )}° </span
                      ><span class="min-temp">${Math.round(
                        forecastDay.temp.min
                      )}°</span>
                    </div>
                    </div>
                    `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}
