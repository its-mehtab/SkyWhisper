var swiper = new Swiper(".weather-slider", {
  loop: true,
  slidesPerView: 5,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    1200: {
      slidesPerView: 5,
    },
    991: {
      slidesPerView: 4,
    },
    767: {
      slidesPerView: 2,
    },
    500: {
      slidesPerView: 4,
    },
    420: {
      slidesPerView: 3,
    },
    0: {
      slidesPerView: 2,
    },
  },
});

// function getLocation() {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(success, error);
//   } else {
//     console.log("Geolocation is not supported by this browser.");
//   }
// }

// function success(position) {
//   const { latitude, longitude } = position.coords;
//   console.log("Latitude: " + latitude, "Longitude: " + longitude);
// }

// function error() {
//   alert("Sorry, no position available.");
// }

// getLocation();

// if (window.location.pathname === "/") {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         const { latitude, longitude } = position.coords;

//         fetch("/", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ latitude, longitude }),
//         })
//           .then((res) => res.json())
//           .then((data) => {
//             console.log("Weather data:", data);
//             // You can update your UI here with the weather data
//           })
//           .catch((err) => console.error("Error:", err));
//       },
//       (error) => {
//         console.error("Geolocation error:", error.message);
//       }
//     );
//   } else {
//     alert("Geolocation is not supported by your browser.");
//   }
// }

if (window.location.pathname === "/") {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Redirect the user to a GET route with the coordinates
        window.location.href = `/weather?lat=${latitude}&lon=${longitude}`;
      },
      (error) => {
        console.error("Geolocation error:", error.message);
      }
    );
  } else {
    alert("Geolocation is not supported by your browser.");
  }
}
