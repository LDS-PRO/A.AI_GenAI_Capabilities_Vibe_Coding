// Configuration
const API_KEY = 'a7b7e3c5e5d94d5a98d103501242312'; // Free tier API key - replace with your own
const API_BASE_URL = 'https://api.weatherapi.com/v1';

// DOM Elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const loading = document.getElementById('loading');
const weatherData = document.getElementById('weatherData');
const error = document.getElementById('error');

// Weather display elements
const cityName = document.getElementById('cityName');
const country = document.getElementById('country');
const temp = document.getElementById('temp');
const weatherIcon = document.getElementById('weatherIcon');
const description = document.getElementById('description');
const feelsLike = document.getElementById('feelsLike');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const uvIndex = document.getElementById('uvIndex');
const lastUpdated = document.getElementById('lastUpdated');
const errorMessage = document.getElementById('errorMessage');

// Event listeners
searchBtn.addEventListener('click', searchWeather);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchWeather();
    }
});

// Load weather for user's location on page load
window.addEventListener('load', () => {
    // Try to get user's location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                fetchWeatherByCoords(latitude, longitude);
            },
            () => {
                // If location access is denied, load weather for a default city
                fetchWeatherByCity('New York');
            }
        );
    } else {
        // If geolocation is not supported, load weather for a default city
        fetchWeatherByCity('New York');
    }
});

function searchWeather() {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeatherByCity(city);
    }
}

async function fetchWeatherByCity(city) {
    showLoading();
    hideError();
    hideWeatherData();

    try {
        const response = await fetch(`${API_BASE_URL}/current.json?key=${API_KEY}&q=${city}&aqi=yes`);
        
        if (!response.ok) {
            throw new Error('City not found');
        }

        const data = await response.json();
        displayWeather(data);
    } catch (err) {
        showError(err.message === 'City not found' ? 'City not found. Please try another city.' : 'Something went wrong. Please try again.');
    } finally {
        hideLoading();
    }
}

async function fetchWeatherByCoords(lat, lon) {
    showLoading();
    hideError();
    hideWeatherData();

    try {
        const response = await fetch(`${API_BASE_URL}/current.json?key=${API_KEY}&q=${lat},${lon}&aqi=yes`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch weather data');
        }

        const data = await response.json();
        displayWeather(data);
    } catch (err) {
        showError('Failed to fetch weather for your location. Showing default city.');
        fetchWeatherByCity('New York');
    } finally {
        hideLoading();
    }
}

function displayWeather(data) {
    // Update location info
    cityName.textContent = data.location.name;
    country.textContent = data.location.country;

    // Update current weather
    temp.textContent = Math.round(data.current.temp_c);
    weatherIcon.src = `https:${data.current.condition.icon}`;
    weatherIcon.alt = data.current.condition.text;
    description.textContent = data.current.condition.text;

    // Update weather details
    feelsLike.textContent = `${Math.round(data.current.feelslike_c)}°C`;
    humidity.textContent = `${data.current.humidity}%`;
    windSpeed.textContent = `${data.current.wind_kph} km/h`;
    uvIndex.textContent = data.current.uv;

    // Update last updated time
    const updateTime = new Date(data.current.last_updated);
    lastUpdated.textContent = updateTime.toLocaleString();

    showWeatherData();
}

// UI Helper functions
function showLoading() {
    loading.classList.remove('hidden');
}

function hideLoading() {
    loading.classList.add('hidden');
}

function showWeatherData() {
    weatherData.classList.remove('hidden');
}

function hideWeatherData() {
    weatherData.classList.add('hidden');
}

function showError(message) {
    errorMessage.textContent = message;
    error.classList.remove('hidden');
}

function hideError() {
    error.classList.add('hidden');
} 