let info = {
    fetchInfo: function(countryName) {
        fetch("https://restcountries.com/v3.1/name/"+ countryName + "?fullText=true").
        then((response) => response.json())
        .then((data) => this.displayInfo(data));
    },
    displayInfo: function(data) {
        const capitalLatLong = data[0].capitalInfo.latlng;
        const name = data[0].name.common;
        const capital = data[0].capital;
        const population = data[0].population;
        const languages = Object.values(data[0].languages).toString().split(",").join(", ");
        const flagImg = data[0].flags.svg;

        document.querySelector(".capitalLatLong").innerText = capitalLatLong;
        time.fetchTime(capitalLatLong[0], capitalLatLong[1]);

        document.querySelector(".countryName").innerText = "Country name: " + name;
        document.querySelector(".countryLocation").innerText = "Map location of " + name;
        
        document.querySelector(".capitalCity").innerText = "Capital city: " + capital;
        weather.fetchWeather(capital);
        locationPic.fetchLocation(capital);
        
        document.querySelector(".population").innerText = "Population: " + population;
        document.querySelector(".languages").innerText = "National language(s): " + languages;
        document.querySelector(".flag").src = flagImg;
        document.querySelector(".flagText").innerText = "Flag of " + name;
    },
};

function setupMap(centerOfCountry) {
    mapboxgl.accessToken = 'pk.eyJ1Ijoic2FtZWVyc2FlZWQiLCJhIjoiY2xiY2cwbTdqMGYwbzQxcGN0djZ1eHAzcyJ9.6-0Lz4Yaw3hslnnW-HTx9g';
    const start = {
        center: [50,30],
        zoom: 1,
        pitch: 0,
        bearing: 0
    };

    const end = {
        center: centerOfCountry,
        zoom: 2.33,
    };
    
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v12',
        center: centerOfCountry,
        ...start
    });

    let isAtStart = true;
    const target = isAtStart ? end : start;
    isAtStart = !isAtStart;
    
    map.flyTo({
        ...target,
        duration: 12000,
        essential: true,
    });
}

let locationPic = {
    locationPicApiKey: "2MPU5v1gJObjC7NLsKsLCQt2HuQ07vclNApBR5NJ0ro",
    fetchLocation: function(countryCapital) {
        fetch("https://api.unsplash.com/search/photos?client_id=" + 
              this.locationPicApiKey + "&query=" + countryCapital + " skyline")
        .then((response) => response.json())
        .then((data) => this.displayLocation(data));
    },
    displayLocation: function(data) {
        const capitalCityImg = data.results[0].urls.regular;
        document.querySelector(".location").src = capitalCityImg;    
    },
}

let country = {
    geoApiKey: "599910a8edae1b7d3d76954c7c16dc6d4c959c29",
    fetchCoords: function(countryName) {
        fetch("https://api.geocodify.com/v2/geocode?api_key=" + this.geoApiKey + 
              "&q=" + countryName + "")
        .then((response) => response.json())
        .then((data) => this.displayCountry(data));
    },   
    displayCountry: function(data) { // getting center of country for map
        setupMap([data.response.features[0].geometry.coordinates[0], 
                  data.response.features[0].geometry.coordinates[1]]);    
    },
};

let time = {
    timeApiKey: "OCSOZ9O8BBRO",
    fetchTime: function(lat, long) {
        fetch("http://api.timezonedb.com/v2.1/get-time-zone?key=" + this.timeApiKey +
              "&format=json&by=position&lat="+ lat +"&lng=" + long)
        .then((response) => response.json())
        .then((data) => this.displayTime(data));
    },
    displayTime: function(data) {
        const time = data.formatted + " " + data.abbreviation;
        document.querySelector(".timeInfo").innerText = "Current time in " + data.cityName + ": " + time;
    },
}

let weather = {
    weatherApiKey: "e59c10ff0b4b31052d389233c901eeaa",
    fetchWeather: function(cityName) {
        fetch("https://api.openweathermap.org/data/2.5/weather?q=" + cityName +
              "&units=metric&appid=" + this.weatherApiKey)
        .then((response) => response.json())
        .then((data) => this.displayWeather(data));
    },
    displayWeather: function(data) {
        const { icon, description } = data.weather[0];
        const { temp, humidity } = data.main;
        const { speed } = data.wind;
        document.querySelector(".weatherHeader").innerText = "Current weather in " + data.name + ": "
        document.querySelector(".temperature").innerText = "Temperature: " + temp + "°C";
        document.querySelector(".weatherDescriptionSky").innerText = "Sky conditions: " + description;
        document.querySelector(".weatherIcon").src = "http://openweathermap.org/img/wn/" + icon + ".png";
        document.querySelector(".weatherDescriptionHumidity").innerText = "Humidity: " +  humidity + "%";
        document.querySelector(".weatherDescriptionWind").innerText = "Wind speed: " +  speed  + "km/h ";
    },
};

document.getElementById("submitCountry").onsubmit = function() {
    var countryInput = document.getElementById("search").value;
    info.fetchInfo(countryInput);
    country.fetchCoords(countryInput);
    return false;
}

function toggleVisibility() {
    var hidden = document.getElementById("hidden").value;
    if (hidden.style.display === 'none') {
        hidden.style.display = 'content';
    }
}