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


document
    .querySelector(".search-form")
    .addEventListener('submit', (e) => {
        e.preventDefault();
        
        const input = document.querySelector('.search-bar');
        const location = input.value || "";

        if (location) {
            getWeatherData(input.value)
                .then(data => {
                    displayWeatherInfo(data);
                    console.table(data);
                });
        }
    });