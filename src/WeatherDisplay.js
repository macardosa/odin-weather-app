import { WeatherTracker } from './WeatherTracker.js';
import closeSvg from './assets/icons/close.svg';
import refreshSvg from './assets/icons/refresh.svg';

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
        if (this.card) return [this.card];

        this.card = document.createElement('div');

        // name of the location
        const locationName = document.createElement('h2');
        locationName.textContent = this.tracker.data.location;
        locationName.classList.add('card-location');

        // weather icon reflecting the weather
        const weatherIcon = document.createElement('img');
        this.getIcon(this.tracker.data.icon).then((src) => {
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

        this.card.append(locationName, weatherIcon, tempAndHumid, shortDescription);

        this.card.classList.add('card');
        return [this.card];
    }

    async refresh() {
        await this.tracker.fetchData();
    }

    async update() {
        await this.refresh();

        // name of the location
        this.card.querySelector('.card-location').textContent =
            this.tracker.data.location;

        // weather icon reflecting the weather
        this.getIcon(this.tracker.data.icon).then((src) => {
            this.card.querySelector('.card-icon').src = src;
        });

        // current temperature
        this.card.querySelector('.card-temperature').textContent =
            `${this.tracker.temperature}${WeatherDisplay.DEG}`;

        // humidity
        this.card.querySelector('.card-humidity').textContent =
            `Humidity: ${this.tracker.humidity}%`;

        // short description of the current conditions
        this.card.querySelector('.card-description').textContent =
            this.tracker.data.description;
    }

    windDirection(deg) {
        const directions = [
            'N',
            'NNE',
            'NE',
            'ENE',
            'E',
            'ESE',
            'SE',
            'SSE',
            'S',
            'SSW',
            'SW',
            'WSW',
            'W',
            'WNW',
            'NW',
            'NNW',
        ];

        // normalize to 0–360
        deg = deg % 360;
        if (deg < 0) deg += 360;

        // each sector is 22.5°
        const index = Math.round(deg / 22.5) % 16;

        return directions[index];
    }

    categorizeVisibility(km) {
        if (typeof km !== 'number' || isNaN(km)) {
            return 'Invalid input';
        }

        if (km > 10) {
            return 'Excellent';
        } else if (km > 5) {
            return 'Good';
        } else if (km > 2) {
            return 'Moderate';
        } else if (km > 1) {
            return 'Poor';
        } else {
            return 'Very Poor';
        }
    }

    categorizePressure(hpa) {
        if (typeof hpa !== "number" || isNaN(hpa)) {
            return "Invalid input";
        }

        if (hpa < 1000) {
            return "Low pressure";
        } else if (hpa <= 1020) {
            return "Normal pressure";
        } else {
            return "High pressure";
        }
    }

    categorizeUvIndex(uv) {
        if (typeof uv !== "number" || isNaN(uv)) {
            return "Invalid input";
        }

        if (uv <= 2) {
            return "Low";
        } else if (uv <= 5) {
            return "Moderate (sunscreen recommended)";
        } else if (uv <= 7) {
            return "High (protection needed)";
        } else if (uv <= 10) {
            return "Very high (extra protection needed)";
        } else {
            return "Extreme (avoid sun exposure)";
        }
    }

    getMoonPhaseName(phase) {
        if (phase === 0 || phase === 1) return "New Moon";
        if (phase > 0 && phase < 0.25) return "Waxing Crescent";
        if (phase === 0.25) return "First Quarter";
        if (phase > 0.25 && phase < 0.5) return "Waxing Gibbous";
        if (phase === 0.5) return "Full Moon";
        if (phase > 0.5 && phase < 0.75) return "Waning Gibbous";
        if (phase === 0.75) return "Last Quarter";
        if (phase > 0.75 && phase < 1) return "Waning Crescent";
        return "Unknown";
    }

    categorizeCloudCover(percent) {
        if (typeof percent !== 'number' || isNaN(percent)) return "Invalid input";
        if (percent <= 10) return "Clear";
        if (percent <= 30) return "Mostly Clear";
        if (percent <= 50) return "Partly Cloudy";
        if (percent <= 70) return "Mostly Cloudy";
        if (percent <= 90) return "Cloudy";
        return "Overcast";
    }

    renderDetails() {
        // heading
        document.querySelector('header').classList.add('details');
        const heading = document.querySelector('header h1');
        heading.textContent = `Weather in ${this.tracker.location}`;

        // show time of last update
        this.showLastTimeUpdated();

        // show forecast
        this.sevenDaysForecastCard = document.createElement('div');
        this.sevenDaysForecastCard.classList.add('info-card', 'forecast-card');

        const headingForecast = document.createElement('h2');
        headingForecast.textContent = '7-day forecast';
        this.sevenDaysForecastCard.appendChild(headingForecast);

        this.tracker.data.forecast.forEach((item) => {
            // display day of the week
            const dayOfTheWeekEl = document.createElement('div');
            dayOfTheWeekEl.classList.add('forecast-day');
            dayOfTheWeekEl.textContent = item.dayOfTheWeek;

            // weather icon for that day
            const weatherIcon = document.createElement('img');
            this.getIcon(item.icon).then((src) => {
                weatherIcon.src = src;
            });
            weatherIcon.classList.add('forecast-icon');

            // min/max temperatures using feelslike instead of actual temp
            const minmax = document.createElement('div');
            minmax.classList.add('forecast-minmax');
            minmax.textContent = `${item.feelslikemin}${WeatherDisplay.DEG} / ${item.feelslikemax}${WeatherDisplay.DEG}`;

            this.sevenDaysForecastCard.append(dayOfTheWeekEl, weatherIcon, minmax);
        });

        // wind gust information
        this.windCardEl = document.createElement('div');
        this.windCardEl.classList.add('info-card', 'wind-card');

        const headingWind = document.createElement('h2');
        headingWind.textContent = 'wind';
        this.windCardEl.appendChild(headingWind);

        const windTableEl = document.createElement('table');
        windTableEl.classList.add('wind-table');
        windTableEl.innerHTML = `
            <tr>
                <th>Speed</th>
                <td>${this.tracker.data.windspeed} km/h<td>
            </tr>

            <tr>
                <th>Gusts</th>
                <td>${this.tracker.data.windgust} km/h<td>
            </tr>

            <tr>
                <th>Direction</th>
                <td>${this.tracker.data.winddir}${WeatherDisplay.DEG} ${this.windDirection(this.tracker.data.winddir)}<td>
            </tr>
        `;
        this.windCardEl.appendChild(windTableEl);

        // visibility information
        this.visibilityCardEl = document.createElement('div');
        this.visibilityCardEl.classList.add('info-card', 'visibility-card');
        this.visibilityCardEl.innerHTML = `
            <h2>Visibility</h2>
            <div class='info-large'>${this.tracker.data.visibility} km</div>
            <p>${this.categorizeVisibility(this.tracker.data.visibility)}</p>
        `;

        // humidity and dew information
        this.humidityCardEl = document.createElement('div');
        this.humidityCardEl.classList.add('info-card', 'humidity-card');
        this.humidityCardEl.innerHTML = `
            <h2>Humidity</h2>
            <div class='info-large'>${this.tracker.humidity} %</div>
            <p>The dew point is ${Math.round(this.tracker.data.dew)}${WeatherDisplay.DEG}</p>
        `;

        // precipitation
        this.precipitationCardEl = document.createElement('div');
        this.precipitationCardEl.classList.add('info-card', 'precipitation-card');
        this.precipitationCardEl.innerHTML = `
            <h2>Precipitation</h2>
            <div class='info-large'>${this.tracker.data.precipitation} mm</div>
            <p>Chance of precipitation ${Math.round(this.tracker.data.precipprob)}%</p>
        `;

        // pressure
        this.pressureCardEl = document.createElement('div');
        this.pressureCardEl.classList.add('info-card', 'pressure-card');
        this.pressureCardEl.innerHTML = `
            <h2>Pressure</h2>
            <div class='info-large'>${Math.round(this.tracker.data.pressure)} hPa</div>
            <p>${this.categorizePressure(this.tracker.data.pressure)}</p>
        `;

        // UV Index
        this.uvindexCardEl = document.createElement('div');
        this.uvindexCardEl.classList.add('info-card', 'pressure-card');
        this.uvindexCardEl.innerHTML = `
            <h2>UV Index</h2>
            <div class='info-large'>${Math.round(this.tracker.data.uvindex)}</div>
            <p>${this.categorizeUvIndex(this.tracker.data.uvindex)}</p>
        `;

        // Cloud cover
        this.cloudcoverCardEl = document.createElement('div');
        this.cloudcoverCardEl.classList.add('info-card', 'cloudcover-card');
        this.cloudcoverCardEl.innerHTML = `
            <h2>Cloudcover</h2>
            <div class='info-large'>${Math.round(this.tracker.data.cloudcover)}%</div>
            <p>${this.categorizeCloudCover(this.tracker.data.cloudcover)}</p>
        `;

        // Moonphase, sunset and sunrise
        this.astrologyCardEl = document.createElement('div');
        this.astrologyCardEl.classList.add('info-card', 'astrology-card');

        const headingAstrology = document.createElement('h2');
        headingAstrology.textContent = 'Astrology';
        this.astrologyCardEl.appendChild(headingAstrology);

        const astrologyTableEl = document.createElement('table');
        astrologyTableEl.innerHTML = `
            <tr>
                <th>Moon phase</th>
                <td>${this.getMoonPhaseName(this.tracker.data.moonphase)}<td>
            </tr>

            <tr>
                <th>Sunrise</th>
                <td>${this.tracker.data.sunrise}<td>
            </tr>

            <tr>
                <th>Sunset</th>
                <td>${this.tracker.data.sunset}<td>
            </tr>
        `;
        this.astrologyCardEl.appendChild(astrologyTableEl);

        // control buttons
        this.closeBtn = document.createElement('img');
        this.closeBtn.src = closeSvg;
        this.closeBtn.alt = '';
        this.closeBtn.classList.add('close-icon');

        this.refreshBtn = document.createElement('img');
        this.refreshBtn.src = refreshSvg;
        this.refreshBtn.alt = '';
        this.refreshBtn.classList.add('info-refresh-icon');

        return [
            this.sevenDaysForecastCard,
            this.windCardEl,
            this.humidityCardEl,
            this.visibilityCardEl,
            this.precipitationCardEl,
            this.pressureCardEl,
            this.uvindexCardEl,
            this.cloudcoverCardEl,
            this.astrologyCardEl,
            this.closeBtn,
            this.refreshBtn,
        ];
    }

    showLastTimeUpdated() {
        document.querySelector('.last-update').textContent =
            `Updated ${this.tracker.lastUpdate.toLocaleTimeString()}`;
    }

    updateDetails() {
        // Update header
        const header = document.querySelector('header');
        header.classList.add('details');
        const heading = header.querySelector('h1');
        heading.textContent = `Weather in ${this.tracker.location}`;

        // show update time
        this.showLastTimeUpdated();

        // --- Update 7-day forecast ---
        if (this.sevenDaysForecastCard) {
            // Remove old forecast entries except the heading
            const forecastChildren = Array.from(this.sevenDaysForecastCard.children);
            forecastChildren.slice(1).forEach((child) => this.sevenDaysForecastCard.removeChild(child));

            this.tracker.data.forecast.forEach((item) => {
                const dayOfTheWeekEl = document.createElement('div');
                dayOfTheWeekEl.classList.add('forecast-day');
                dayOfTheWeekEl.textContent = item.dayOfTheWeek;

                const weatherIcon = document.createElement('img');
                weatherIcon.classList.add('forecast-icon');
                this.getIcon(item.icon).then((src) => {
                    weatherIcon.src = src;
                });

                const minmax = document.createElement('div');
                minmax.classList.add('forecast-minmax');
                minmax.textContent = `${item.feelslikemin}${WeatherDisplay.DEG} / ${item.feelslikemax}${WeatherDisplay.DEG}`;

                this.sevenDaysForecastCard.append(dayOfTheWeekEl, weatherIcon, minmax);
            });
        }

        // --- Update wind card ---
        if (this.windCardEl) {
            const table = this.windCardEl.querySelector('table.wind-table');
            table.innerHTML = `
            <tr>
                <th>Speed</th>
                <td>${this.tracker.data.windspeed} km/h<td>
            </tr>
            <tr>
                <th>Gusts</th>
                <td>${this.tracker.data.windgust} km/h<td>
            </tr>
            <tr>
                <th>Direction</th>
                <td>${this.tracker.data.winddir}${WeatherDisplay.DEG} ${this.windDirection(this.tracker.data.winddir)}<td>
            </tr>
        `;
        }

        // --- Update visibility ---
        if (this.visibilityCardEl) {
            this.visibilityCardEl.querySelector('.info-large').textContent =
                `${this.tracker.data.visibility} km`;
            this.visibilityCardEl.querySelector('p').textContent =
                this.categorizeVisibility(this.tracker.data.visibility);
        }

        // --- Update humidity and dew ---
        if (this.humidityCardEl) {
            this.humidityCardEl.querySelector('.info-large').textContent =
                `${this.tracker.humidity} %`;
            this.humidityCardEl.querySelector('p').textContent =
                `The dew point is ${Math.round(this.tracker.data.dew)}${WeatherDisplay.DEG}`;
        }

        // --- Update precipitation ---
        if (this.precipitationCardEl) {
            this.precipitationCardEl.querySelector('.info-large').textContent =
                `${this.tracker.data.precipitation} mm`;
            this.precipitationCardEl.querySelector('p').textContent =
                `Chance of precipitation ${Math.round(this.tracker.data.precipprob)}%`;
        }

        // --- Update pressure ---
        if (this.pressureCardEl) {
            this.pressureCardEl.querySelector('.info-large').textContent =
                `${Math.round(this.tracker.data.pressure)} hPa`;
            this.pressureCardEl.querySelector('p').textContent =
                this.categorizePressure(this.tracker.data.pressure);
        }

        // --- Update UV index ---
        if (this.uvindexCardEl) {
            this.uvindexCardEl.querySelector('.info-large').textContent =
                `${Math.round(this.tracker.data.uvindex)}`;
            this.uvindexCardEl.querySelector('p').textContent =
                this.categorizeUvIndex(this.tracker.data.uvindex);
        }

        // --- Update Cloud Cover ---
        if (this.cloudcoverCardEl) {
            const cloudPercentEl = this.cloudcoverCardEl.querySelector('.info-large');
            const cloudCategoryEl = this.cloudcoverCardEl.querySelector('p');

            cloudPercentEl.textContent = `${Math.round(this.tracker.data.cloudcover)}%`;
            cloudCategoryEl.textContent = this.categorizeCloudCover(this.tracker.data.cloudcover);
        }

        // --- Update Astrology Card ---
        if (this.astrologyCardEl) {
            const astrologyTableEl = this.astrologyCardEl.querySelector('table');
            astrologyTableEl.innerHTML = `
            <tr>
                <th>Moon phase</th>
                <td>${this.getMoonPhaseName(this.tracker.data.moonphase)}<td>
            </tr>

            <tr>
                <th>Sunrise</th>
                <td>${this.tracker.data.sunrise}<td>
            </tr>

            <tr>
                <th>Sunset</th>
                <td>${this.tracker.data.sunset}<td>
            </tr>
        `;
        }
    }
}
