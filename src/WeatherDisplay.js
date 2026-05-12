import { WeatherTracker } from "./WeatherTracker.js";
import closeSvg from './assets/icons/close.svg';

export class WeatherDisplay {
    static DEG = '\u00B0';

    constructor(tracker) {
        this.tracker = tracker;
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

    renderCard() {
        this.card = document.createElement('div');
        
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
        temp.textContent = `${this.tracker.temperature}${WeatherDisplay.DEG}`;

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

        this.card.classList.add('card');
        return [this.card];
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
        this.card.querySelector('.card-temperature').textContent = `${this.tracker.temperature}${WeatherDisplay.DEG}`;

        // humidity
        this.card.querySelector('.card-humidity').textContent =
            `Humidity: ${this.tracker.humidity}%`;

        // short description of the current conditions
        this.card.querySelector('.card-description').textContent = this.tracker.data.description;
    }

    renderDetails() {
        // heading
        document.querySelector('header').classList.add('details');
        const heading = document.querySelector('header h1');
        heading.textContent = `Weather in ${this.tracker.location}`;   

        // show forecast
        this.sevenDaysForecastCard = document.createElement('div');
        this.sevenDaysForecastCard.classList.add('forecast-card');

        const h2 = document.createElement('h2');
        h2.textContent = '7-day forecast';
        this.sevenDaysForecastCard.appendChild(h2);

        this.tracker.data.forecast.forEach((item) => {
            // display day of the week
            const dayOfTheWeekEl = document.createElement('div');
            dayOfTheWeekEl.classList.add('forecast-day');
            dayOfTheWeekEl.textContent = item.dayOfTheWeek;

            // weather icon for that day
            const weatherIcon = document.createElement('img');
            this.getIcon(item.icon)
                .then(src => {
                    weatherIcon.src = src;
                });
            weatherIcon.classList.add('forecast-icon');

            // min/max temperatures using feelslike instead of actual temp
            const minmax = document.createElement('div');
            minmax.classList.add('forecast-minmax');
            minmax.textContent = `${item.feelslikemin}${WeatherDisplay.DEG} / ${item.feelslikemax}${WeatherDisplay.DEG}`;

            this.sevenDaysForecastCard.append(dayOfTheWeekEl, weatherIcon, minmax);
        });

        // control buttons
        this.closeBtn = document.createElement('img');
        this.closeBtn.src = closeSvg;
        this.closeBtn.alt = '';
        this.closeBtn.classList.add('close-icon');

        return [this.sevenDaysForecastCard, this.closeBtn];
    }
}