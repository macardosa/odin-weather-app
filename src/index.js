import '@fontsource/inter';
import '@fontsource/open-sans';
import './styles.css';
import { WeatherApp } from './WeatherApp.js';
import { WeatherDisplay } from './WeatherDisplay.js';

// Sample of cities
// const app = await WeatherApp.create(['Madrid', 'Sydney']);
const app = WeatherApp.create();
// const app = await WeatherApp.create(['Sydney']);
