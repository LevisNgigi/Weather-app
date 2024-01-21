let weather = {
  apiKey: "336c5ed6d35751cd689cfebce6702ccd",
  isMetric: true,

  fetchWeather: function (city) {
    const units = this.isMetric ? "metric" : "imperial";
    fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=" +
        city +
        "&units=" +
        units +
        "&appid=" +
        this.apiKey
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("City not found");
        }
        return response.json();
      })
      .then((data) => this.displayWeather(data))
      .catch((error) => {
        console.error(error);
        alert("City not found. Please try again.");
      });
  },

  fetchWeatherByCoordinates: function (latitude, longitude) {
    const units = this.isMetric ? "metric" : "imperial";
    fetch(
      "https://api.openweathermap.org/data/2.5/weather?lat=" +
        latitude +
        "&lon=" +
        longitude +
        "&units=" +
        units +
        "&appid=" +
        this.apiKey
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch weather data.");
        }
        return response.json();
      })
      .then((data) => this.displayWeather(data))
      .catch((error) => {
        console.error(error);
        alert("Failed to fetch weather data.");
      });
  },

  displayWeather: function (data) {
    const { name } = data;
    const { icon, description } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;
    document.querySelector(".city").innerText = "Weather in " + name;
    document.querySelector(".icon").src =
      "https://openweathermap.org/img/wn/" + icon + ".png";
    document.querySelector(".description").innerText = description;
    document.querySelector(".temp").innerText = temp + (this.isMetric ? "°C" : "°F");
    document.querySelector(".humidity").innerText =
      "Humidity: " + humidity + "%";
    document.querySelector(".wind").innerText =
      "Wind speed: " + speed + (this.isMetric ? " km/h" : " mph");
    document.querySelector(".weather").classList.remove("loading");
    document.body.style.backgroundImage =
      "url('https://source.unsplash.com/1600x900/?" + name + "')";
  },

  search: function () {
    this.fetchWeather(document.querySelector(".search-bar").value);
  },
};

document.querySelector(".search button").addEventListener("click", function () {
  weather.search();
});

document
  .querySelector(".search-bar")
  .addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
      weather.search();
    }
  });

function toggleUnits() {
  weather.isMetric = !weather.isMetric;
  weather.fetchWeather(document.querySelector(".search-bar").value);
}

function fetchWeatherByLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      weather.fetchWeatherByCoordinates(latitude, longitude);
    });
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

weather.fetchWeather("Denver");
