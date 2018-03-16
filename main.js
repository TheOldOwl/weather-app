
// DOM NODES
const loc = document.querySelector('.location')
const temp = document.querySelector('.temperature')
const cond = document.querySelector('.athmosphere')
const icon = document.querySelector('.icon')
const bckgr = document.querySelector('.content-box')
const body = document.querySelector('body')
const humid = document.querySelector('.humidity')
const wind = document.querySelector('.wind')
const units = document.querySelector('#units')

// weather data obj
let weather = {}
let map, infoWindow, marker;


function initMap() {
let position
// 1. append g.map to html
map = new google.maps.Map(document.querySelector('#map'), {
    //remove center
    // center: {lat: -34.397, lng: 150.644},
zoom: 12
})
infoWindow = new google.maps.InfoWindow;

// MAPS EVENT LISTENERS

    // 2. WEATHER DISPLAY BOX FADE OUT ON DRAGSTART
    map.addListener('dragstart', fadeOut)

    // 3. DRAG
    map.addListener('drag', dragCoordinates)

    // 4. GET NEW CENTER AND WEATHER DISPLAY BOX FADE IN ON DRAGEND
    map.addListener('dragend', positionChange)

// 2. HTML5 geolocation.
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((pos) => {
        position = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
    }

    // infoWindow.setPosition(pos);
    // infoWindow.setContent('Location found.');
    // infoWindow.open(map);

    // Center Map on user position
    map.setCenter(position)

    // Fetcht Weather API
    getWeather(position.lat, position.lng)
    const icon = 'https://www.shareicon.net/data/128x128/2015/12/15/208680_marker_48x48.png'
    marker = new google.maps.Marker({
        position: position,
        map: map,
        clickable: false,
        title: 'Hello World!',
        icon: icon
    })
    console.log(marker)

    }, function() {
    handleLocationError(true, infoWindow, map.getCenter());
    })

    } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
    }

}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                            'Error: The Geolocation service failed.' :
                            'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}

const getWeather = (lat, lon) => {
    // const url = `https://fcc-weather-api.glitch.me/api/current?lat=${lat}&lon=${lon}`
    const url = `https://api.apixu.com/v1/current.json?key=71d9af2f70b44a24a1f93205181503&q=${lat},${lon}`
    fetch(url)
        .then(resp => resp.json())
        .then(UIController)
}

// UI DISPLAY

const UIController = (data) => {
    weather.name = data.location.name
    weather.country = data.location.country
    weather.tempCelsius = Math.round(data.current.temp_c)
    weather.tempFarenheit = Math.round(data.current.temp_f)
    weather.cond = data.current.condition.text
    weather.condId = data.current.condition.code
    weather.humid = data.current.humidity
    weather.wind = data.current.wind_kph
    weather.isDay = data.current.is_day
    weather.layer = "linear-gradient(rgba(255,255,255,.5), rgba(255,255,255,.3), rgba(255,255,255,.3)),"

    // 1. Display Location + Temperature + Conditions + Wind + Humidity
    displayData()
    
    // 2. Display Media (icons and images)
    displayMedia()
    
    // 3. Make data visible after it's fetched
    bckgr.style.opacity = 1
}


// Display API Data
const displayData = () => {
    loc.textContent = 'current weather in: ' + weather.name + '  [' + weather.country + ']'
    temp.textContent = 'Temp: ' + weather.tempCelsius
    cond.textContent = weather.cond
    humid.textContent = 'Humidity: ' + weather.humid + ' %'
    wind.textContent = 'Wind speed: ' + weather.wind + ' km/h'
}

//Display icons and images
const displayMedia = () => {
    weather.cond = weather.cond.toLowerCase()

    if (weather.isDay) {
        if (weather.cond.includes('rain') || weather.cond.includes('drizzle')) {
            icon.src = 'assets/rain.svg'
            bckgr.style.background = weather.layer + " url('https://www.metoffice.gov.uk/binaries/content/gallery/mohippo/images/migrated-image/r/heavy_rain_splashes_shutterstock_148721882.jpg')"
        } else if (weather.cond.includes('sunny')) {
            icon.src = 'assets/sun.svg'
            bckgr.style.background = weather.layer + " url('https://wallpapersite.com/images/wallpapers/sunset-1440x900-clear-sky-hd-5168.jpg')"
        } else if (weather.cond.includes('cloudy') || weather.cond.includes('overcast')) {
            icon.src = 'assets/cloud.svg'
            bckgr.style.background = weather.layer + " url('https://steemitimages.com/DQmf9L6CsxfDPegYuc3gnjQXdqiyausCfJa3bPyMWwu3Pif/Clouds-and-stars.jpg')"
        } else if (weather.cond.includes('mist') || weather.cond.includes('fog')) {
            icon.src = 'assets/mist.svg'
            bckgr.style.background = weather.layer + " url('http://dreamicus.com/data/mist/mist-07.jpg')"
        } else if (weather.cond.includes('snow') || weather.cond.includes('ice') || weather.cond.includes('sleet')) {
            icon.src = 'assets/snow.svg'
            // update snow pic
            bckgr.style.background = weather.layer + " url('http://dreamicus.com/data/mist/mist-07.jpg')"
        }
    } else {
        if (weather.cond.includes('rain') || weather.cond.includes('drizzle')) {
            icon.src = 'assets/rain-night.svg'
            bckgr.style.background = weather.layer + " url('https://www.metoffice.gov.uk/binaries/content/gallery/mohippo/images/migrated-image/r/heavy_rain_splashes_shutterstock_148721882.jpg')"
        } else if (weather.cond.includes('clear')) {
            icon.src = 'assets/clear-night.svg'
            bckgr.style.background = weather.layer + " url('https://wallpapersite.com/images/wallpapers/sunset-1440x900-clear-sky-hd-5168.jpg')"
        } else if (weather.cond.includes('cloudy') || weather.cond.includes('overcast')) {
            icon.src = 'assets/cloud-night.svg'
            bckgr.style.background = weather.layer + " url('https://steemitimages.com/DQmf9L6CsxfDPegYuc3gnjQXdqiyausCfJa3bPyMWwu3Pif/Clouds-and-stars.jpg')"
        } else if (weather.cond.includes('mist') || weather.cond.includes('fog')) {
            icon.src = 'assets/mist.svg'
            bckgr.style.background = weather.layer + " url('http://dreamicus.com/data/mist/mist-07.jpg')"
        } else if (weather.cond.includes('snow') || weather.cond.includes('ice') || weather.cond.includes('sleet')) {
            icon.src = 'assets/snow.svg'
            // update snow pic
            bckgr.style.background = weather.layer + " url('http://dreamicus.com/data/mist/mist-07.jpg')"
        }
    }
}

const positionChange = () => {
    
    // 1. new center of the map
    const coords = map.getCenter();

    // 2. new location after dragging
    const position = {
        lat: coords.lat(),
        lng: coords.lng()
    }

    // 3. weather for new coordinates
    getWeather(position.lat, position.lng);
    
    // 4. After map dragends brings widget to opacity 1
    fadeIn()
}

const dragCoordinates = () => {
    // 1. new center of the map
    const coords = map.getCenter();

    // 2. new location after dragging
    const position = {
        lat: coords.lat(),
        lng: coords.lng()
    }

    marker.setPosition(position)
    
}


const fadeOut = () => {
    if((bckgr.style.opacity-=.1)<.3) {
        bckgr.style.opacity = '.3'
    } else {
        setTimeout(fadeOut, 30)
    }
}

const fadeIn = () => {
    
    if((bckgr.style.opacity = parseFloat(bckgr.style.opacity)+.1)> 1) {
        bckgr.style.opacity = '1'
    } else {
        setTimeout(fadeIn, 30)
    }
}


// EVENT LISTENERS

//Display celsius or fahrenheit
const changeUnits = (e) => {
    if (e.target.textContent.includes('C')) {
        temp.textContent = 'Temp: ' + weather.tempFarenheit
        e.target.textContent = '°F'
    } else {
        temp.textContent = 'Temp: ' + weather.tempCelsius
        e.target.textContent = '°C'
    }
}
units.addEventListener('click', changeUnits)