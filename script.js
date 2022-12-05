let countryInp = document.getElementById("country-inp");
let searchBtn = document.getElementById("search-btn");

$(".loading").delay(1000).fadeOut("fast");

let weather = {
    weatherApiKey:"e59c10ff0b4b31052d389233c901eeaa",
    fetchWeather: function(city) {
        fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city +
              "&units=metric&appid=" + this.weatherApiKey)
        .then((response) => response.json())
        .then((data) => this.displayWeather(data));
    },
    displayWeather: function(data) {
        const { name } = data;
        const { icon, description } = data.weather[0];
        const { temp, humidity } = data.main;
        const { speed } = data.wind;
        document.querySelector(".city").innerText = "Weather in " + name;
        document.querySelector(".icon").src = "http://openweathermap.org/img/wn/" + icon + ".png";
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp").innerText = temp + "°C";
        document.querySelector(".humidity").innerText = "Humidity: " +  humidity + "%";
        document.querySelector(".wind").innerText = "Wind speed: " +  speed  + "km/h ";
        document.querySelector(".temp-content").remove();
        document.querySelector(".content").classList.remove("loading");
        document.querySelector(".content-two").classList.remove("loading");
        document.querySelector(".module").classList.remove("loading");
    },
    search: function() {
        this.fetchWeather(countryInp.value);
    },
};

let guide = {
    fetchGuide: function(countryName) {
        fetch("https://restcountries.com/v3.1/name/"+ countryName + "?fullText=true").
        then((response) => response.json())
        .then((data) => this.displayGuide(data));
    },
    displayGuide: function(data) {
        const capital = data[0].capital[0];
        const continent = data[0].continents[0];
        const population = data[0].population;
        const languages = Object.values(data[0].languages).toString().split(",").join(", ");
        const img = data[0].flags.svg
        document.querySelector(".capital").innerText = "Capital: " + capital;
        document.querySelector(".continent").innerText = "Continent: " + continent;
        document.querySelector(".population").innerText = "Population: " + population;
        document.querySelector(".languages").innerText = "Languages: " + languages;
        document.querySelector(".icon-one").src = img;
    },
    search: function() {
        this.fetchGuide(countryInp.value);
    },
};

let country = {
    geoApiKey: "599910a8edae1b7d3d76954c7c16dc6d4c959c29",
    fetchCountry: function(countryName) {
        fetch("https://api.geocodify.com/v2/geocode?api_key=" + geoApiKey + 
              "&q=" + countryName)
        .then((response) => response.json())
        .then((data) => this.displayCountry(data));
    },   
    displayCountry: function(data) {
        const long = data.response.features[0].geometry.coordinates[0];
        const lat = data.response.features[0].geometry.coordinates[1];
        time.fetchTime(long, lat);
        setupMap([long, lat]);    
    },
    search: function() {
        this.fetchCountry(countryInp.value);
    },
};

let time = {
    timeApiKey: "OCSOZ9O8BBRO",
    fetchTime: function(long, lat) {
        fetch("http://api.timezonedb.com/v2.1/get-time-zone?key=" + timeApiKey +
              "&format=json&by=position&lat="+ lat +"&lng=" + long)
        .then((response) => response.json())
        .then((data) => this.displayTime(data));
    },
    displayTime: function(data) {
        const time = data.formatted;
        const timeZone = data.zoneName;
        document.querySelector(".time").innerText = "Time: " + time;
        document.querySelector(".timeZone").innerText = "Time Zone: " + timeZone;
    },
}

let locationPic = {
    fetchLocation: function(countryName) {
        fetch("https://api.unsplash.com/search/photos?client_id=m6xfShS-RTIdJiWrCku2jVbNr0iM42YtCmopz4VTtx8&query=" + countryName + "")
        .then((response) => response.json())
        .then((data) => this.displayLocation(data));
    },
    displayLocation: function(data) {
        const imgTwo = data.results[0].urls.regular;
        document.querySelector(".location-pic").src = imgTwo;    
    },
    search: function() {
        this.fetchLocation(countryInp.value);
    },
}

mapboxgl.accessToken = 'pk.eyJ1IjoicHJpdGFtc2Fwa290YSIsImEiOiJjbGFiazVjamYwMTRsNDBtaWtxdGU2dnUxIn0.vD8yySjgQEd96lF6tSKQ6Q';
function setupMap(center) {
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: center,
        zoom: 2,
    });
    const marker = new mapboxgl.Marker()
    .setLngLat(center)
    .addTo(map);
}

countryInp.addEventListener("keyup", (event) => {
    if(event.key == "Enter") {
      guide.search();
      weather.search();
      country.search();
      locationPic.search();
    }
});

searchBtn.addEventListener('click', () => {
    guide.search();
    weather.search();
    country.search();
    locationPic.search();
});