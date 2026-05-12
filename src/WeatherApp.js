import { WeatherDisplay } from "./WeatherDisplay.js";
import refreshSvg from './assets/icons/refresh.svg';
import searchSvg from './assets/icons/search.svg';

export class WeatherApp {
    constructor() {
        this.weatherList = [];
    }

    static async create(locations = []) {
        const app = new WeatherApp();

        app.renderCardsLayout();

        for (const location of locations) {
            await app.add(location);
        }

        return app;
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
        })

        const lastUpdate = document.createElement('div');
        lastUpdate.classList.add('last-update');

        header.append(title, refreshIcon, lastUpdate);

        // Cards wrapper
        const cardsWrapper = document.createElement('div');
        cardsWrapper.classList.add('cards-wrapper');

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

                    searchBar.value = "";
                    searchBar.blur();
                }
            }
        })

        const searchIcon = document.createElement('img');
        searchIcon.src = searchSvg;
        searchIcon.alt = '';
        searchIcon.classList.add('search-icon');

        searchForm.append(searchBar, searchIcon);

        main.append(header, cardsWrapper, searchForm);
    }

    renderInfoLayout() {
        const main = document.querySelector('main');
        main.innerHTML = '';

        // Header
        const header = document.createElement('header');

        const title = document.createElement('h1');
        title.textContent = 'Weather';

        const lastUpdate = document.createElement('div');
        lastUpdate.classList.add('last-update');

        header.append(title, lastUpdate);

        // Cards wrapper
        const cardsWrapper = document.createElement('div');
        cardsWrapper.classList.add('cards-wrapper');

        main.append(header, cardsWrapper);
    }

    showLastTimeUpdated(lastUpdate) {
        document.querySelector('.last-update').textContent =
            `Updated ${lastUpdate.toLocaleTimeString()}`;
    }

    addToDOM(elements) {
        const cardsWrapper = document.querySelector('.cards-wrapper');
        elements.forEach((el) => {
            cardsWrapper.appendChild(el)
        });
    }

    async render() {
        this.renderCardsLayout();
        for (const item of this.weatherList) {
            this.addToDOM(item.renderCard());

            item.card.addEventListener('click', () => {
                this.renderInfoLayout();
                this.addToDOM(item.renderDetails());
                this.showLastTimeUpdated(item.tracker.lastUpdate);

                item.closeBtn.addEventListener('click', () => {
                    this.render();
                })
            });
        }
    }

    async add(location) {
        const weatherDisplayObj = await WeatherDisplay.create(location);

        this.addToDOM(weatherDisplayObj.renderCard());

        weatherDisplayObj.card.addEventListener('click', () => {
            this.renderInfoLayout();
            this.addToDOM(weatherDisplayObj.renderDetails());
            this.showLastTimeUpdated(weatherDisplayObj.tracker.lastUpdate);

            weatherDisplayObj.closeBtn.addEventListener('click', () => {
                this.render();
            })
        });

        this.weatherList.push(weatherDisplayObj);
    }

    async refresh() {
        await Promise.all(
            this.weatherList.map(el => el.update())
        );
    }
}