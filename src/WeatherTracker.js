export class WeatherTracker {
    constructor(location) {
        this.location = location;
    }

    getApiUrl() { // https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/[location]/[date1]/[date2]?key=YOUR_API_KEY
        const API_KEY = "2ZMBX25MBPANSURDSP9UN3RWW";
        return `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${this.location}?key=${API_KEY}`;
    }

    parseJson(json) {
        return {
            "location": json?.address,
            "description": json?.description,
            "conditions": json?.currentConditions?.conditions,
            "datetime": json?.currentConditions?.datetime,
            "moonphase": json?.currentConditions?.moonphase,
            "precipitation": json?.currentConditions?.precip,
            "temperature": json?.currentConditions?.temp,
            "feelslike": json?.currentConditions?.feelslike,
            "windspeed": json?.currentConditions?.windspeed,
            "windgust": json?.currentConditions?.windgust,
            "sunrise": json?.currentConditions?.sunrise,
            "sunset": json?.currentConditions?.sunset,
            "icon": json?.currentConditions?.icon,
            "humidity": json?.currentConditions?.humidity,
            "visibility": json?.currentConditions?.visibility,
        }
    }

    async fetchData() {
        try {
            const url = this.getApiUrl();
            const response = await fetch(url);
            const json = await response.json();
            this.data = this.parseJson(json);
        } catch (error) {
            console.log('Invalid input data passed', error);
            this.data = null;
        }
    }

    static fahrenheitToCelsius(fahrenheit) {
        return (fahrenheit - 32) * (5 / 9);
    }

    get temperature() {
        if (this.data?.temperature == null) return null;

        return Math.round(
            WeatherTracker.fahrenheitToCelsius(this.data.temperature)
        );
    }

    get humidity() {
        if (this.data?.humidity == null) return null;

        return Math.round(this.data.humidity);
    }
}