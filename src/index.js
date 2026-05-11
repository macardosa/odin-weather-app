import "@fontsource/inter";
import "@fontsource/open-sans";
import './styles.css';
import { WeatherApp } from "./WeatherApp.js";

// Sample of cities
const app = await WeatherApp.create(['Madrid', 'Sydney']);

// Capture user input to add new cities
const input = document.querySelector('.search-bar');
input.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
        const locationName = input.value.trim();
        if (locationName) {
            await app.add(locationName);

            input.value = "";
            input.blur();
        }
    }
})

// Refresh weather data after click on refresh icon
const refreshIcon = document.querySelector('.refresh-icon');
refreshIcon.addEventListener('click', async () => {
    await app.refresh();
})