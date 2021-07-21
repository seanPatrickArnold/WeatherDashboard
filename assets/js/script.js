//Get array of cities
var getCities = function() {
    var cities = JSON.parse(localStorage.getItem('cities'));
    if (!cities) {
        var cities = [];
    }
    return(cities)
}

//Get last viewed city
var getCity = function() {
    var city = JSON.parse(localStorage.getItem('city'));
    if (!city) {
        var city = 'London';
    }
    return(city)
}

//fetch coordinates from open weather API form city search
//fetch weather data for coordinates
//pass weather data to funciton to populate forecast display
var getWeatherData = function(city) {
    apiURL = 'https://api.openweathermap.org/data/2.5/weather?'
            + 'q=' + city
            + '&appid=62e4918665c866b39e985e39e8c04205'
            ;

    fetch(apiURL).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                getWeather(data.coord.lat, data.coord.lon);
            });
        }
        else {
            getWeather(0, 0);
        } 
    });
}

var getWeather = function(lat, lon) {
    apiURL = 'https://api.openweathermap.org/data/2.5/onecall?'
            + 'lat=' + lat
            + '&lon=' + lon
            + '&units=' + 'imperial'
            + '&appid=62e4918665c866b39e985e39e8c04205';

    fetch(apiURL).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                populateForecast(data);

            });
        }
        else {
            return(undefined);
        }
    });
};

//collection of functions to populate dashboard display
var createDashboard = function() {
    document.body.innerHTML = '';

    createHeader();
    createSearch();

    var forecastContainerDiv = document.createElement('div');
    forecastContainerDiv.id = 'forecast-container-div';
    document.body.appendChild(forecastContainerDiv);

    createCurrent(forecastContainerDiv);
    createForecast(forecastContainerDiv);
    populateCities();
    var city = getCity();
    getWeatherData(city);
    var currentH2 = document.querySelector('#dashboard-current-h2');
    currentH2.textContent = city + ' (' + moment().format('M/DD/YYYY') + ')';
}

//display header elements
var createHeader = function() {
    var headerDiv = document.createElement('div');
    headerDiv.id = 'dashboard-header-div';
    document.body.appendChild(headerDiv);

    var header = document.createElement('header');
    header.id = 'dashboard-header';
    header.textContent = 'Weather Dashboard';
    headerDiv.appendChild(header);
}

//display search section and add button listener for search
var createSearch = function(forecastContainerDiv) {
    var searchDiv = document.createElement('div');
    searchDiv.id = 'dashboard-search-div';
    document.body.appendChild(searchDiv);

    var searchBarDiv = document.createElement('div');
    searchBarDiv.id = 'search-bar-div';
    searchDiv.appendChild(searchBarDiv);

    var searchH2 = document.createElement('h2');
    searchH2.id = 'dashboard-search-h2';
    searchH2.textContent = 'Search for a City:';
    searchBarDiv.appendChild(searchH2);

    var searchInput = document.createElement('input');
    searchInput.id = 'dashboard-search-input';
    searchBarDiv.appendChild(searchInput);

    var searchButton = document.createElement('button');
    searchButton.id = 'dashboard-search-button';
    searchButton.textContent = 'Search';
    searchBarDiv.appendChild(searchButton);

    var searchCity = function() {
        var city = searchInput.value;
        searchInput.value = ''
        var cities = getCities();
        var cityInCities = false;
        for (i=0; i <cities.length; i++) {
            if (city===cities[i]) {
                cityInCities = true;
            }
        }
        if (!cityInCities) {
            cities.push(city);
        }
        localStorage.setItem('cities', JSON.stringify(cities));
        localStorage.setItem('city', JSON.stringify(city));
        getWeatherData(city);
        populateCities();
        var currentH2 = document.querySelector('#dashboard-current-h2');
        currentH2.textContent = city + ' (' + moment().format('m/dd/yyyy') + ')';

    }

    searchButton.addEventListener('click', searchCity)

    var cityDiv = document.createElement('div');
    cityDiv.id = 'city-div';
    searchDiv.appendChild(cityDiv);


}

//display current weather div
var createCurrent = function(forecastContainerDiv) {
    var currentDiv = document.createElement('div');
    currentDiv.id = 'dashboard-current-div';
    forecastContainerDiv.appendChild(currentDiv);

    var currentH2 = document.createElement('h2');
    currentH2.id = 'dashboard-current-h2';
    currentH2.textContent = '';
    currentDiv.appendChild(currentH2);

    var icon = document.createElement('img');
    icon.setAttribute('src', '')
    icon.id = 'current-icon';
    currentDiv.appendChild(icon)

    var currentH1Temperature = document.createElement('h1');
    currentH1Temperature.id = 'dashboard-current-h1-temperature';
    currentH1Temperature.textContent = 'Temperature: ';
    currentDiv.appendChild(currentH1Temperature);

    var currentH1Wind = document.createElement('h1');
    currentH1Wind.id = 'dashboard-current-h1-wind';
    currentH1Wind.textContent = 'Wind: ';
    currentDiv.appendChild(currentH1Wind);

    var currentH1Humidity = document.createElement('h1');
    currentH1Humidity.id = 'dashboard-current-h1-humidity';
    currentH1Humidity.textContent = 'Humidity: ';
    currentDiv.appendChild(currentH1Humidity);

    var currentUVDiv = document.createElement('div');
    currentUVDiv.id = 'current-uv-div';
    currentDiv.appendChild(currentUVDiv);

    var currentH1Uv = document.createElement('h1');
    currentH1Uv.id = 'dashboard-current-h1-uv-title';
    currentH1Uv.textContent = 'UV Index: ';
    currentUVDiv.appendChild(currentH1Uv);

    var currentH1Uv = document.createElement('h1');
    currentH1Uv.id = 'dashboard-current-h1-uv';
    currentH1Uv.textContent = '';
    currentUVDiv.appendChild(currentH1Uv);
}

//display 5 day forecast div
var createForecast = function(forecastContainerDiv) {
    var forecastDiv = document.createElement('div');
    forecastDiv.id = 'dashboard-forecast-div';
    forecastContainerDiv.appendChild(forecastDiv);

    var forecastH2 = document.createElement('h2');
    forecastH2.id = 'dashboard-forecast-h2';
    forecastH2.textContent = '5-Day Forecast:';
    forecastDiv.appendChild(forecastH2);

    var forecastDayDiv = document.createElement('div');
    forecastDayDiv.id = 'dashboard-forecast-day-div';
    forecastDiv.appendChild(forecastDayDiv);

    var forecast = {};

    for (i=0; i<5; i++) {
        var day = i + 1;
        forecast['div'+day] = document.createElement('div');
        forecast['div'+day].id = 'dashboard-forecast' + day + '-div';
        forecast['div'+day].setAttribute('class', 'forecast-day');
        forecastDayDiv.appendChild(forecast['div'+day]);
        createDay(day, forecast['div'+day]);
    }
}

//function to fill out 5 day forecast divs
var createDay = function(day, forecastDayDiv) {
    var dayH1 = document.createElement('h1');
    dayH1.id = 'day'+day+'-h1';
    dayH1.textContent = 'Day ' + day;
    forecastDayDiv.appendChild(dayH1);

    var icon = document.createElement('img');
    icon.id = 'icon'+day;
    forecastDayDiv.appendChild(icon)

    var temperatureH1 = document.createElement('h1');
    temperatureH1.id = 'temperature'+day+'-h1';
    temperatureH1.textContent = 'Temperature: ';
    forecastDayDiv.appendChild(temperatureH1);

    var windH1 = document.createElement('h1');
    windH1.id = 'wind'+day+'-h1';
    windH1.textContent = 'Wind: ';
    forecastDayDiv.appendChild(windH1);

    var humidityH1 = document.createElement('h1');
    humidityH1.id = 'humidity'+day+'-h1';
    humidityH1.textContent = 'Humidity: ';
    forecastDayDiv.appendChild(humidityH1);
}

//function to populate list of city buttons
var populateCities = function() {
    var cities = getCities();
    var cityDiv = document.querySelector('#city-div');
    cityDiv.innerHTML = '';
    for (i=0; i<cities.length; i++) {
        var cityButton = document.createElement('button');
        cityButton.className = 'city-button';
        cityButton.textContent = cities[i];
        cityButton.setAttribute('data-city', cities[i])
        cityDiv.appendChild(cityButton);

        var populateForecastButton = function() {
            var city = this.getAttribute('data-city');
            localStorage.setItem('city', JSON.stringify(city));
            getWeatherData(city);
        }

        cityButton.addEventListener('click', populateForecastButton);

    }
}

//function to fill out forecast information
var populateForecast = function(data) {
    var iconCode = data.current.weather[0].icon;
    var iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";
    var currentIcon = document.querySelector('#current-icon');
    currentIcon.setAttribute('src', iconURL);


    var city = getCity();
    var currentH2 = document.querySelector('#dashboard-current-h2');
    currentH2.textContent = city + ' (' + moment().format('M/DD/YYYY') + ')';


    var currentTempH1 = document.querySelector('#dashboard-current-h1-temperature');
    currentTempH1.textContent = 'Temperature: ' + data.current.temp + 'F';
    var currentWindH1 = document.querySelector('#dashboard-current-h1-wind');
    currentWindH1.textContent = 'Wind: ' + data.current.wind_speed + 'MPH';
    var currentHumidityH1 = document.querySelector('#dashboard-current-h1-humidity');
    currentHumidityH1.textContent = 'Humidity: ' + data.current.humidity + '%';
    var currentUVH1 = document.querySelector('#dashboard-current-h1-uv');
    currentUVH1.textContent = data.current.uvi;
    var currentUVI = data.current.uvi;
    if (currentUVI <3.3) {
        var rating = 'mild';
    }
    else if (currentUVI >=3.3 && currentUVI<6.6) {
        var rating = 'moderate';
    }
    else if (currentUVI >= 6.6) {
        var rating = 'severe';
    }
    currentUVH1.className = rating;

    for (i=0; i<5; i++) {
        var day = i+1;
        var iconCode = data.daily[i].weather[0].icon;
        var iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";
        var currentIcon = document.querySelector('#icon'+day);
        currentIcon.setAttribute('src', iconURL);
        var tempH1 = document.querySelector('#temperature'+day+'-h1');
        tempH1.textContent = 'Temperature: ' + data.daily[i].temp.day + 'F';
        var windH1 = document.querySelector('#wind'+day+'-h1');
        windH1.textContent = 'Wind: ' + data.daily[i].wind_speed + 'MPH';
        var humidityH1 = document.querySelector('#humidity'+day+'-h1');
        humidityH1.textContent = 'Humidity: ' + data.daily[i].humidity + '%';
    }
}

//call main function
createDashboard();