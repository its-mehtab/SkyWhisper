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

// navigator.geolocation.getCurrentPosition(async (pos) => {
//   const { latitude, longitude } = pos.coords;

//   const response = await fetch(`/location?lat=${latitude}&lon=${longitude}`);
//   const data = await response.json();
//   console.log("City:", data.city);
// });

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

function success(position) {
  console.log(
    "Latitude: " + position.coords.latitude,
    "Longitude: " + position.coords.longitude
  );
}

function error() {
  alert("Sorry, no position available.");
}

getLocation();
