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

async function getApiResponse(req, res, city) {
  // const cityName = req.body.cityname;
  const cityName = city;
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
}

app.get("/", (req, res) => {
  async function getCityFromCoords(lat, lon) {
    try {
      const response = await axios.get(
        "https://nominatim.openstreetmap.org/reverse",
        {
          params: {
            format: "json",
            lat: lat,
            lon: lon,
          },
        }
      );

      const address = response.data.address;
      const city = address;
      // address.city || address.town || address.village || address.county;

      console.log("City:", city);
      return city;
    } catch (error) {
      console.error("Reverse geocoding error:", error);
    }
  }
  getCityFromCoords(22.5759431, 88.4844097);

  getApiResponse(req, res, "kolkata");
});

app.post("/submit", (req, res) => {
  const cityName = req.body.cityname;
  getApiResponse(req, res, cityName);
});

// app.post("/submit", async (req, res) => {
//   const cityName = req.body.cityname;
//   console.log(cityName);

//   try {
//     const responseCity = await axios.get(
//       `${weatherApi}geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`
//     );

//     const nowResponse = await axios.get(
//       `${weatherApi}data/2.5/weather?lat=${responseCity.data[0].lat}&lon=${responseCity.data[0].lon}&appid=${apiKey}`
//     );

//     const currWeatherData = {
//       temperature: Math.floor(nowResponse.data.main.temp - 273.15) + "°",
//       feelsLike: Math.floor(nowResponse.data.main.feels_like - 273.15) + "°",
//       humidity: nowResponse.data.main.humidity + "%",
//       weatherCondition: nowResponse.data.weather[0].description,
//     };

//     console.log(nowResponse.data);

//     const response = await axios.get(
//       `${weatherApi}data/2.5/forecast?lat=${responseCity.data[0].lat}&lon=${responseCity.data[0].lon}&appid=${apiKey}`
//     );

//     const tomorrow = new Date();
//     tomorrow.setDate(tomorrow.getDate() + 1);

//     const tomorrowDate = tomorrow.toISOString().split("T")[0];

//     const forecast = response.data.list.filter((currWeather) => {
//       return currWeather.dt_txt.includes(tomorrowDate);
//     });

//     // console.log(forecast[1]);

//     const rainData = forecast.filter((currForecast) => {
//       return currForecast.weather[0].main !== "Clear";
//     });

//     // console.log(rainData[0].weather[0]);
//     // console.log(rainData);

//     const time12 = function (time24) {
//       const [hours, mins] = time24.split(":");
//       const date = new Date();
//       date.setHours(hours, mins);

//       const time12 = date.toLocaleTimeString("en-US", {
//         hour: "numeric",
//         minute: "2-digit",
//         hour12: true,
//       });

//       return time12;
//     };

//     const rainDetails = rainData.map((currRain) => {
//       return {
//         time: time12(currRain.dt_txt.split(" ")[1]),
//         description: currRain.weather[0].description,
//       };
//     });

//     console.log(rainDetails);

//     const tomorrowForecast = forecast.map((currForecast) => {
//       return {
//         time: time12(currForecast.dt_txt.split(" ")[1]),
//         temperature: Math.floor(currForecast.main.temp - 273.15) + "°",
//         feelsLike: Math.floor(currForecast.main.feels_like - 273.15) + "°",
//         humidity: currForecast.main.humidity + "%",
//         weatherCondition: currForecast.weather[0].main,
//         description: currForecast.weather[0].description,
//         weatherIcon: currForecast.weather[0].icon,
//       };
//     });
//     // console.log(tomorrowForecast);
//     res.render("index.ejs", {
//       city: cityName,
//       tomorrowForecast: tomorrowForecast || null,
//       currWeatherData: currWeatherData,
//       rainDetails: rainDetails || null,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
