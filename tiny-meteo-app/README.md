# Tiny Meteo - Weather App

A simple, beautiful weather application that shows current weather conditions for any city.

## Features

- 🌍 Search weather by city name
- 📍 Automatic location detection
- 🎨 Beautiful gradient UI with modern design
- 📱 Responsive design for mobile and desktop
- 🌡️ Shows temperature, humidity, wind speed, UV index
- 🔄 Real-time weather data

## How to Run Locally

1. Navigate to the `tiny-meteo-app` folder:
   ```bash
   cd tiny-meteo-app
   ```

2. Open `index.html` in your web browser:
   - **Option 1**: Double-click the `index.html` file
   - **Option 2**: Right-click `index.html` and select "Open with" → Your preferred browser
   - **Option 3**: Use a local server (recommended for best experience):
     ```bash
     # If you have Python installed:
     python -m http.server 8000
     # Then open http://localhost:8000 in your browser
     
     # Or if you have Node.js:
     npx serve
     # Follow the URL shown in the terminal
     ```

## Usage

1. When you first open the app, it will try to detect your location and show your local weather
2. To search for another city, type the city name in the search box and press Enter or click the search button
3. The app will display:
   - Current temperature
   - Weather condition with icon
   - Feels like temperature
   - Humidity percentage
   - Wind speed
   - UV index

## API Key

The app comes with a free API key for testing. For production use, you should get your own free API key:

1. Go to [WeatherAPI.com](https://www.weatherapi.com/)
2. Sign up for a free account
3. Copy your API key from the dashboard
4. Replace the `API_KEY` in `script.js` with your own key

## Technologies Used

- HTML5
- CSS3 (with modern gradients and animations)
- Vanilla JavaScript
- WeatherAPI.com for weather data

## Browser Support

Works on all modern browsers including:
- Chrome
- Firefox
- Safari
- Edge

Enjoy your weather tracking! 🌤️ 