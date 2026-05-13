import { WeatherDisplay } from './WeatherDisplay.js';
import refreshSvg from './assets/icons/refresh.svg';
import searchSvg from './assets/icons/search.svg';

export class WeatherApp {
    constructor() {
        this.weatherList = [];
    }

    static async create(locations = []) {
        const app = new WeatherApp();

        app.renderCardsLayout();

        // add passed locations
        for (const location of locations) {
            await app.add(location);
        }

        // add locations saved in localStorage
        const savedLocations = JSON.parse(localStorage.getItem('weatherLocations')) || [];
        for (const location of savedLocations) {
            await app.add(location);
        }

        return app;
    }

    save() {
        const locations = this.weatherList.map(w => w.tracker.location);
        localStorage.setItem('weatherLocations', JSON.stringify(locations));
    }

    renderCardsLayout() {
        const main = document.querySelector('main');
        main.innerHTML = '';

        // Header
        const header = document.createElement('header');

        const title = document.createElement('h1');
        title.textContent = 'Weather';

        const refreshIcon = document.createElement('img');
        refreshIcon.src = refreshSvg;
        refreshIcon.alt = '';
        refreshIcon.classList.add('refresh-icon');
        refreshIcon.addEventListener('click', async () => {
            await this.refresh();
        });

        const lastUpdate = document.createElement('div');
        lastUpdate.classList.add('last-update');

        header.append(title, refreshIcon, lastUpdate);

        // Cards wrapper
        const cardsWrapper = document.createElement('div');
        cardsWrapper.classList.add('wrapper', 'cards-wrapper');

        // Search form
        const searchForm = document.createElement('div');
        searchForm.classList.add('search-form');

        const searchBar = document.createElement('input');
        searchBar.name = 'search-bar';
        searchBar.placeholder = 'Search for a city, town or airport';
        searchBar.classList.add('search-bar');
        searchBar.addEventListener('keydown', async (e) => {
            if (e.key === 'Enter') {
                const locationName = searchBar.value.trim();
                if (locationName) {
                    await this.add(locationName);
                    this.save();

                    searchBar.value = '';
                    searchBar.blur();
                }
            }
        });

        const searchIcon = document.createElement('img');
        searchIcon.src = searchSvg;
        searchIcon.alt = '';
        searchIcon.classList.add('search-icon');

        searchForm.append(searchBar, searchIcon);

        main.append(header, cardsWrapper, searchForm);
    }

    renderInfoLayout() {
        const main = document.querySelector('main');
        main.replaceChildren();

        // Header
        const header = document.createElement('header');

        const title = document.createElement('h1');
        title.textContent = 'Weather';

        const lastUpdate = document.createElement('div');
        lastUpdate.classList.add('last-update');

        header.append(title, lastUpdate);

        // Cards wrapper
        const cardsWrapper = document.createElement('div');
        cardsWrapper.classList.add('wrapper', 'info-wrapper');

        main.append(header, cardsWrapper);
    }

    addToDOM(elements) {
        const wrapper = document.querySelector('.wrapper');
        elements.forEach((el) => {
            wrapper.appendChild(el);
        });
    }

    async render() {
        this.renderCardsLayout();

        for (const item of this.weatherList) {
            this.addToDOM(item.renderCard());

            item.card.querySelector('.expand-card-btn').onclick = async () => {
                this.renderInfoLayout();
                await item.refresh();
                this.addToDOM(item.renderDetails());

                item.closeBtn.onclick = () => {
                    this.render();
                };

                item.refreshBtn.onclick = async () => {
                    await item.refresh();
                    item.updateDetails();
                };
            };

            item.card.querySelector('.delete-card-btn').onclick = () => {
                this.remove(item);
                item.card.remove(); // delete from DOM
            };
        }
    }

    remove(itemToRemove) {
        this.weatherList = this.weatherList.filter(
            item => item !== itemToRemove
        );

        this.save();
    }

    async add(location) {
        const weatherDisplayObj = await WeatherDisplay.create(location);

        this.addToDOM(weatherDisplayObj.renderCard());

        weatherDisplayObj.card.querySelector('.expand-card-btn').onclick = () => {
            this.renderInfoLayout();
            this.addToDOM(weatherDisplayObj.renderDetails());

            weatherDisplayObj.closeBtn.onclick = () => {
                this.render();
            };

            weatherDisplayObj.refreshBtn.onclick = async () => {
                await weatherDisplayObj.refresh();
                weatherDisplayObj.updateDetails();
            };
        };

        weatherDisplayObj.card.querySelector('.delete-card-btn').onclick = () => {
            this.remove(weatherDisplayObj);
            weatherDisplayObj.card.remove(); // delete from DOM
        };

        this.weatherList.push(weatherDisplayObj);
    }

    async refresh() {
        await Promise.all(this.weatherList.map((el) => el.update()));
    }
}
