
/* 
------------------------------------------------------------
VARIABLES
------------------------------------------------------------
*/
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

// Universal variables
let weather = {}
let map, infoWindow, marker;
let placeName;

/* 
------------------------------------------------------------
API'S
------------------------------------------------------------
*/
// Google Maps - called back by script 
function initMap() {

// 1. APPEND GOOGLE MAPS TO DOM
map = new google.maps.Map(document.querySelector('#map'), {
    fullscreenControl: false,
    zoom: 12,
    mapTypeId: 'roadmap'
})

// insert code to throw error when maps API doesn't work
// not sure i need infoWindow for this !!!
infoWindow = new google.maps.InfoWindow;

// 2. POSITION AND WEATHER DATA CONTROLLER
weatherController()

// 3. SEARCH FIELD
searchField()

//

// MAPS EVENT LISTENERS

    // 1. WEATHER DISPLAY BOX FADE OUT ON DRAGSTART
    map.addListener('dragstart', fadeOut)

    // 2. DRAG
    map.addListener('drag', dragCoordinates)

    // 3. GET NEW CENTER AND WEATHER DISPLAY BOX FADE IN ON DRAGEND
    map.addListener('dragend', positionChange)

    // mapInit f end
}

// THROW ERROR IF BROWSER DOESN'T HAVE GEOLOCATION
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                            'Error: The Geolocation service failed.' :
                            'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}

// WEATHER API (APIXU.com)
const getWeather = (lat, lon) => {
    // const url = `https://fcc-weather-api.glitch.me/api/current?lat=${lat}&lon=${lon}`
    const url = `https://api.apixu.com/v1/current.json?key=71d9af2f70b44a24a1f93205181503&q=${lat},${lon}`
    fetch(url)
        .then(resp => resp.json())
        .then(UIController)
}

/* 
------------------------------------------------------------
UI CONTROLLER
------------------------------------------------------------
*/

// UI DISPLAY
const UIController = (data) => {
    // the name is from g.maps api
    weather.name = placeName
    weather.country = data.location.country
    weather.tempCelsius = Math.round(data.current.temp_c)
    weather.tempFarenheit = Math.round(data.current.temp_f)
    weather.cond = data.current.condition.text
    weather.condId = data.current.condition.code
    weather.humid = data.current.humidity
    weather.wind = data.current.wind_kph
    weather.isDay = data.current.is_day
    weather.layer = "linear-gradient(rgba(255,255,255,.5), rgba(255,255,255,.3), rgba(255,255,255,.3)),"
    // console.log(data)
    
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
            bckgr.style.background = weather.layer + " url('https://www.publicdomainpictures.net/pictures/40000/velka/cloudy-day-1366798736VRh.jpg')"
        } else if (weather.cond.includes('mist') || weather.cond.includes('fog')) {
            icon.src = 'assets/mist.svg'
            bckgr.style.background = weather.layer + " url('http://www.wallpaperawesome.com/wallpapers-awesome/wallpapers-for-monitors-widescreen-panoramic-16-9-awesome/fog-city-awesome.jpg')"
        } else if (weather.cond.includes('snow') || weather.cond.includes('ice') || weather.cond.includes('sleet')) {
            icon.src = 'assets/snow.svg'
            bckgr.style.background = weather.layer + " url('https://d1o50x50snmhul.cloudfront.net/wp-content/uploads/2017/08/21150000/gettyimages-498152026.jpg')"
        }
    } else {
        if (weather.cond.includes('rain') || weather.cond.includes('drizzle')) {
            icon.src = 'assets/rain-night.svg'
            bckgr.style.background = weather.layer + " url('https://i.ytimg.com/vi/q76bMs-NwRk/maxresdefault.jpg')"
        } else if (weather.cond.includes('clear')) {
            icon.src = 'assets/clear-night.svg'
            bckgr.style.background = weather.layer + " url('https://i.pinimg.com/originals/0c/71/3b/0c713bb4d34b2f29134f236d53a5037d.jpg')"
        } else if (weather.cond.includes('cloudy') || weather.cond.includes('overcast')) {
            icon.src = 'assets/cloud-night.svg'
            bckgr.style.background = weather.layer + " url('https://avante.biz/wp-content/uploads/Cloud-Backgrounds/Cloud-Backgrounds-014.jpg')"
        } else if (weather.cond.includes('mist') || weather.cond.includes('fog')) {
            icon.src = 'assets/mist.svg'
            bckgr.style.background = weather.layer + " url('http://www.fubiz.net/wp-content/uploads/2016/11/nightligtsfog7-900x600.jpg')"
        } else if (weather.cond.includes('snow') || weather.cond.includes('ice') || weather.cond.includes('sleet')) {
            icon.src = 'assets/snow.svg'
            bckgr.style.background = weather.layer + " url('https://i.ytimg.com/vi/qkq3E5G3cow/maxresdefault.jpg')"
        }
    }
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

// Makes marker for the location
const locationMarker = () => {
    const icon = 'https://www.shareicon.net/data/128x128/2015/12/15/208679_marker_48x48.png'
        marker = new google.maps.Marker({
            position: position,
            map: map,
            clickable: false,
            icon: icon
    })
}

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

// EVENT LISTENERS
units.addEventListener('click', changeUnits)

/* 
------------------------------------------------------------
DATA CONTROLLER
------------------------------------------------------------
*/

// WEATHER CONTROLLER
const weatherController = () => {
    if (navigator.geolocation) {
        // 1. get coordinates
        navigator.geolocation.getCurrentPosition((pos) => {
            position = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
        }
    
        // 2. Center Map
        map.setCenter(position)
    
        // 3. Fetch Weather API
        newLocationStats(position.lat, position.lng)

        // 4. Mark location
        locationMarker()
        
        // ERROR HANDLERS
        }, function() {
        handleLocationError(true, infoWindow, map.getCenter());
        })
        
        } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
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
    newLocationStats(position.lat, position.lng)
    
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

// Gets name from Google API and then runs the weather API
const newLocationStats = (lat, lng) => {
    // console.log(lat, lng)
    const curLoc = new google.maps.LatLng(lat, lng)

    const request = {
        location: curLoc,
        radius: 1,
    }

    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);

    function callback(results, status) {
        console.log('PlacesService all',status, results)
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            placeName = results[0].name
            console.log('PlacesService status ok',results)
            getWeather(lat, lng)
        }
    }
}


/* 
------------------------------------------------------------
SEARCH FIELD
------------------------------------------------------------
*/

// AUTOCOMPLETE SEARCH BAR
const searchField = () => {
    
    const input = document.getElementById('pac-input');
    const options = {
        types: ['geocode']
      }

    const autocomplete = new google.maps.places.Autocomplete(input, options);
    autocomplete.bindTo('bounds', map);
    
    // LISTENER on search change
    autocomplete.addListener('place_changed', function() {
        const place = autocomplete.getPlace()
        console.log(autocomplete)
        if (!place.geometry) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            window.alert("No details available for input: '" + place.name + "'");
            return;
        }

        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(13);  // Why 17? Because it looks good.
        }

        // New place name
        searchPlace(place)
        
        // get new map center
        const coords = map.getCenter();
        const position = {
            lat: coords.lat(),
            lng: coords.lng()
        }

        //GET WEATHER FOR LOCATION
        getWeather(coords.lat(), coords.lng())

        //UPDATE MARKER POSITION
        marker.setPosition(position)

        // Clear search bar
        input.value = ''

    // Listener end
    })
//Autocmplete end        
}

const searchPlace = (location) => {
    if (location.vicinity) {
        placeName = location.vicinity
    } else {
        placeName = location.address_components[0].short_name
    }
}

//TEST






