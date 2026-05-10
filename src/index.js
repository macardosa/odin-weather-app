import "@fontsource/inter";
import "@fontsource/open-sans";
import './styles.css';
import { WeatherTracker } from './WeatherTracker.js';
import { WeatherDisplay } from './WeatherDisplay.js';

// Sample of cities
for (const city of [
    'Calgary',
    'Madrid',
    'Sydney'
]) {
    const cityElement = await WeatherDisplay.create(city);
    cityElement.render();
}

// Capture user input to add new cities
const input = document.querySelector('.search-bar');
input.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
        const locationName = input.value || "";
        if (locationName) {
            const locationElement = await WeatherDisplay.create(locationName);
            locationElement.render();
            input.value = "";
            input.blur();
        }
    }
})
