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
    // when window width is >= 1200px
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
