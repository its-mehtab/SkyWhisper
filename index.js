import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import "dotenv/config";

const app = express();
const port = process.env.PORT;
const weatherApi = "http://api.openweathermap.org/";
const weatherAdpi = "http://api.openweathermap.org/";
const apiKey = process.env.WEATHER_API_KEY;

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.post("/submit", async (req, res) => {
  const cityName = req.body.cityname;
  console.log(cityName);

  try {
    const responseCity = await axios.get(
      `${weatherApi}geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`
    );

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

    const tomorrowForecast = forecast.map((currForecast) => {
      return {
        time: currForecast.dt_txt.split(" ")[1],
        temperature: currForecast.main.temp,
        feelsLike: currForecast.main.feels_like,
        humidity: currForecast.main.humidity,
        weatherCondition: currForecast.weather[0].main,
        description: currForecast.weather[0].description,
        weatherIcon: currForecast.weather[0].icon,
      };
    });
    console.log(tomorrowForecast);
    res.render("index.ejs", {
      city: cityName,
      tomorrowForecast: tomorrowForecast || null,
    });
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
