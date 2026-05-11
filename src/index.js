import "@fontsource/inter";
import "@fontsource/open-sans";
import './styles.css';
import { WeatherTracker } from './WeatherTracker.js';
import { WeatherDisplay } from './WeatherDisplay.js';

// Sample of cities
const weatherList = [];

for (const city of [
    'Calgary',
    'Sydney'
]) {
    try {
        const cityElement = await WeatherDisplay.create(city);
        cityElement.render();
        weatherList.push(cityElement);
    } catch(error) {
        console.log(error)
    }
}

// Capture user input to add new cities
const input = document.querySelector('.search-bar');
input.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
        const locationName = input.value.trim();
        if (locationName) {
            console.log(locationName);
            const locationElement = await WeatherDisplay.create(locationName);
            locationElement.render();
            weatherList.push(locationElement);

            input.value = "";
            input.blur();
        }
    }
})

// Refresh weather data after click on refresh icon
const refreshIcon = document.querySelector('.refresh-icon');
refreshIcon.addEventListener('click', async () => {
    await Promise.all(
        weatherList.map(el => el.update())
    );
})