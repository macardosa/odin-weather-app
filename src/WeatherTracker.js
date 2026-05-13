export class WeatherTracker {
  constructor(location) {
    this.location = location;
  }

  getApiUrl() {
    // https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/[location]/[date1]/[date2]?key=YOUR_API_KEY
    const API_KEY = '2ZMBX25MBPANSURDSP9UN3RWW';
    return `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${this.location}?key=${API_KEY}`;
  }

  parseJson(json) {
    const obj = {
      location: json?.address,
      description: json?.description,
      conditions: json?.currentConditions?.conditions,
      datetime: json?.currentConditions?.datetime,
      moonphase: json?.currentConditions?.moonphase,
      precipitation: json?.currentConditions?.precip,
      precipprob: json?.currentConditions?.precipprob,
      temperature: json?.currentConditions?.temp,
      feelslike: json?.currentConditions?.feelslike,
      windspeed: json?.currentConditions?.windspeed,
      windgust: json?.currentConditions?.windgust,
      winddir: json?.currentConditions?.winddir,
      sunrise: json?.currentConditions?.sunrise,
      sunset: json?.currentConditions?.sunset,
      icon: json?.currentConditions?.icon,
      humidity: json?.currentConditions?.humidity,
      visibility: json?.currentConditions?.visibility,
      dew: WeatherTracker.fahrenheitToCelsius(json?.currentConditions?.dew),
      pressure: json?.currentConditions?.pressure,
      uvindex: json?.currentConditions?.uvindex,
      moonphase: json?.currentConditions?.moonphase,
      sunset: json?.currentConditions?.sunset,
      sunrise: json?.currentConditions?.sunrise,
      cloudcover: json?.currentConditions?.cloudcover,
    };

    obj.forecast = [];
    json?.days?.slice(0, 7).map((day, index) => {
      obj.forecast[index] = {
        dayOfTheWeek: new Date(day.datetime).toLocaleDateString('en-US', {
          weekday: 'long',
        }),
        icon: day.icon,
        feelslikemin: Math.round(WeatherTracker.fahrenheitToCelsius(day.feelslikemin)),
        feelslikemax: Math.round(WeatherTracker.fahrenheitToCelsius(day.feelslikemax)),
      };
    });

    return obj;
  }

  async fetchData() {
    try {
      const url = this.getApiUrl();
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const json = await response.json();
      this.data = this.parseJson(json);
      this.lastUpdate = new Date();
    } catch (error) {
      console.log('Invalid input data passed', error);
      // this.data = null;
    }
  }

  static fahrenheitToCelsius(fahrenheit) {
    return (fahrenheit - 32) * (5 / 9);
  }

  get temperature() {
    if (this.data?.feelslike == null) return null;

    return Math.round(
      WeatherTracker.fahrenheitToCelsius(this.data.feelslike)
    );
  }

  get humidity() {
    if (this.data?.humidity == null) return null;

    return Math.round(this.data.humidity);
  }
}
