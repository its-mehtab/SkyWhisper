import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import "dotenv/config";
import { name } from "ejs";

const app = express();
const port = process.env.PORT;
const weatherApi = "http://api.openweathermap.org/";
const apiKey = process.env.WEATHER_API_KEY;

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", async (req, res) => {
  const cityName = "kolkata";

  try {
    const responseCity = await axios.get(
      `${weatherApi}geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`
    );

    const nowResponse = await axios.get(
      `${weatherApi}data/2.5/weather?lat=${responseCity.data[0].lat}&lon=${responseCity.data[0].lon}&appid=${apiKey}`
    );

    const currWeatherData = {
      temperature: nowResponse.data.main.temp,
      feelsLike: nowResponse.data.main.feels_like,
      humidity: nowResponse.data.main.humidity + "%",
      weatherCondition: nowResponse.data.weather.description,
    };

    console.log(nowResponse.data);

    res.render("index.ejs", {
      city: nowResponse.data.name,
      currWeatherData: currWeatherData,
    });
  } catch (errror) {
    console.error(errror);
  }

  // res.render("index.ejs");
});

app.post("/submit", async (req, res) => {
  const cityName = req.body.cityname;
  console.log(cityName);

  try {
    const responseCity = await axios.get(
      `${weatherApi}geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`
    );

    const nowResponse = await axios.get(
      `${weatherApi}data/2.5/weather?lat=${responseCity.data[0].lat}&lon=${responseCity.data[0].lon}&appid=${apiKey}`
    );

    const currWeatherData = {
      temperature: Math.floor(nowResponse.data.main.temp - 273.15) + "°",
      feelsLike: Math.floor(nowResponse.data.main.feels_like - 273.15) + "°",
      humidity: nowResponse.data.main.humidity + "%",
      weatherCondition: nowResponse.data.weather[0].description,
    };

    console.log(nowResponse.data);

    const response = await axios.get(
      `${weatherApi}data/2.5/forecast?lat=${responseCity.data[0].lat}&lon=${responseCity.data[0].lon}&appid=${apiKey}`
    );

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const tomorrowDate = tomorrow.toISOString().split("T")[0];

    const forecast = response.data.list.filter((currWeather) => {
      return currWeather.dt_txt.includes(tomorrowDate);
    });

    // console.log(forecast[1]);

    const rainData = forecast.filter((currForecast) => {
      return currForecast.weather[0].main !== "Clear";
    });

    // console.log(rainData[0].weather[0]);
    // console.log(rainData);

    const time12 = function (time24) {
      const [hours, mins] = time24.split(":");
      const date = new Date();
      date.setHours(hours, mins);

      const time12 = date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      return time12;
    };

    const rainDetails = rainData.map((currRain) => {
      return {
        time: time12(currRain.dt_txt.split(" ")[1]),
        description: currRain.weather[0].description,
      };
    });

    console.log(rainDetails);

    const tomorrowForecast = forecast.map((currForecast) => {
      return {
        time: time12(currForecast.dt_txt.split(" ")[1]),
        temperature: Math.floor(currForecast.main.temp - 273.15) + "°",
        feelsLike: Math.floor(currForecast.main.feels_like - 273.15) + "°",
        humidity: currForecast.main.humidity + "%",
        weatherCondition: currForecast.weather[0].main,
        description: currForecast.weather[0].description,
        weatherIcon: currForecast.weather[0].icon,
      };
    });
    // console.log(tomorrowForecast);
    res.render("index.ejs", {
      city: cityName,
      tomorrowForecast: tomorrowForecast || null,
      currWeatherData: currWeatherData,
      rainDetails: rainDetails || null,
    });
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
