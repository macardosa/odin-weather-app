import { WeatherTracker } from "./WeatherTracker.js";

export class WeatherDisplay {
    constructor(tracker) {
        this.tracker = tracker;
        this.card = document.createElement('div');
        this.card.classList.add('card');
        this.lastUpdateElement = document.querySelector('.last-update');
    }

    static async create(location) {
        const tracker = new WeatherTracker(location);
        await tracker.fetchData();

        return new WeatherDisplay(tracker);
    }

    async getIcon(name) {
        const iconFile = await import(`./assets/weather-icons/${name}.svg`);
        return iconFile.default;
    }

    addToDOM() {
        const cardsWrapper = document.querySelector('.cards-wrapper');
        cardsWrapper.appendChild(this.card);
    }

    showLastTimeUpdated() {
        this.lastUpdate = new Date();
        this.lastUpdateElement.textContent =
            `Updated ${this.lastUpdate.toLocaleTimeString()}`;
    }

    render() {
        // name of the location
        const locationName = document.createElement('h2');
        locationName.textContent = this.tracker.data.location;
        locationName.classList.add('card-location');

        // weather icon reflecting the weather
        const weatherIcon = document.createElement('img');
        this.getIcon(this.tracker.data.icon)
            .then(src => {
                weatherIcon.src = src;
            });
        weatherIcon.classList.add('card-icon');

        // current temperature 
        const tempAndHumid = document.createElement('div');
        tempAndHumid.classList.add('card-temp-n-humid');

        // current temperature
        const temp = document.createElement('div');
        temp.classList.add('card-temperature');
        const degrees = '\u00B0';
        temp.textContent = `${this.tracker.temperature}${degrees}`;

        // humidity
        const humidity = document.createElement('div');
        humidity.classList.add('card-humidity');
        humidity.textContent = `Humidity: ${this.tracker.humidity}%`;

        tempAndHumid.append(temp, humidity);

        // short description of the current conditions
        const shortDescription = document.createElement('p');
        shortDescription.textContent = this.tracker.data.description;
        shortDescription.classList.add('card-description');

        this.card.append(
            locationName, weatherIcon, tempAndHumid,
            shortDescription,
        );

        this.addToDOM();
        this.showLastTimeUpdated();
    }

    async refresh() {
        await this.tracker.fetchData();
    }

    async update() {
        await this.refresh();

        // name of the location
        this.card.querySelector('.card-location').textContent = this.tracker.data.location;

        // weather icon reflecting the weather
        this.getIcon(this.tracker.data.icon)
            .then(src => {
                this.card.querySelector('.card-icon').src = src;
            });

        // current temperature
        this.card.querySelector('.card-temperature').textContent = `${this.tracker.temperature}\u00B0`;

        // humidity
        this.card.querySelector('.card-humidity').textContent = 
            `Humidity: ${this.tracker.humidity}%`;

        // short description of the current conditions
        this.card.querySelector('.card-description').textContent = this.tracker.data.description;

        this.showLastTimeUpdated();
    }
}