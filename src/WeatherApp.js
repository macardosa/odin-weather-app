import { WeatherDisplay } from "./WeatherDisplay.js";

export class WeatherApp {
    constructor() {
        this.weatherList = [];
    }

    static async create(locations = []) {
        const app = new WeatherApp();

        for (const location of locations) {
            await app.add(location);
        }

        return app;
    }

    async add(location) {
        const weatherDisplayObj = await WeatherDisplay.create(location);

        weatherDisplayObj.render();

        this.weatherList.push(weatherDisplayObj);
    }

    async refresh() {
        await Promise.all(
            this.weatherList.map(el => el.update())
        );
    }
}