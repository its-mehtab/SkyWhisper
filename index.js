import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import "dotenv/config";

const app = express();
const port = process.env.PORT;
const weatherApi = "http://api.openweathermap.org/";
const apiKey = process.env.WEATHER_API_KEY;

app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.json());

app.use(express.static("public"));

async function getApiResponse(req, res, latitude, longitude, cityName) {
  try {
    const nowResponse = await axios.get(
      `${weatherApi}data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`
    );

    const currWeatherData = {
      city: nowResponse.data.name,
      temperature: Math.floor(nowResponse.data.main.temp - 273.15) + "°",
      feelsLike: Math.floor(nowResponse.data.main.feels_like - 273.15) + "°",
      humidity: nowResponse.data.main.humidity + "%",
      weatherCondition: nowResponse.data.weather[0].description,
    };

    const response = await axios.get(
      `${weatherApi}data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}`
    );

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const tomorrowDate = tomorrow.toISOString().split("T")[0];

    const forecast = response.data.list.filter((currWeather) => {
      return currWeather.dt_txt.includes(tomorrowDate);
    });

    const rainData = forecast.filter((currForecast) => {
      return currForecast.weather[0].main !== "Clear";
    });

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

    res.render("index.ejs", {
      city: cityName || currWeatherData.city,
      tomorrowForecast: tomorrowForecast || null,
      currWeatherData: currWeatherData,
      rainDetails: rainDetails || null,
    });
  } catch (error) {
    console.log(error);
  }
}

app.get("/", (req, res) => {
  res.render("index.ejs", {
    city: null,
    tomorrowForecast: null,
    currWeatherData: null,
    rainDetails: null,
  });
});

app.get("/weather", (req, res) => {
  const { lat, lon } = req.query;
  getApiResponse(req, res, lat, lon);
});

// app.post("/", (req, res) => {
//   const { latitude, longitude } = req.body;

//   if (!latitude || !longitude) {
//     return res.status(400).send("Latitude and longitude are required");
//   }

//   console.log("Received location:", latitude, longitude);

//   getApiResponse(req, res, latitude, longitude);
// });

app.post("/submit", async (req, res) => {
  const cityName = req.body.cityname;

  try {
    const responseCity = await axios.get(
      `${weatherApi}geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`
    );

    const cityLat = responseCity.data[0].lat;
    const cityLon = responseCity.data[0].lon;

    getApiResponse(req, res, cityLat, cityLon, cityName);
  } catch (error) {
    console.error("Error fetching city coordinates:", error);
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
