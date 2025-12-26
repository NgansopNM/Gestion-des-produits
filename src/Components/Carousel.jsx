// Carousel.jsx
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const Carousel = () => {
  const settings = {
    dots: true,            // Points de navigation
    infinite: true,        // Boucle infinie
    speed: 800,            // Vitesse de transition en ms
    slidesToShow: 1,       // Nombre de slides visibles
    slidesToScroll: 1,     // Nombre de slides à défiler
    autoplay: true,        // Lecture automatique
    autoplaySpeed: 2000,   // Intervalle de l'autoplay en ms
    arrows: true,          // Afficher les flèches
    responsive: [
      {
        breakpoint: 1024,  // Écran ≤ 1024px
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,   // Écran ≤ 600px
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
        },
      },
    ],
  };

  return (
    <div className="mx-auto w-3/5 h-3/5 bg-yellow-700 rounded-2xl">
      <Slider {...settings}>
        <div>
          <img
           src="/image-4.jpeg"
            alt="Slide 1"
            style={{ width: "10", height:" 30", borderRadius: "10px" }}
          />
        </div>
        <div>
          <img
            src="/image-3.jpeg"
            alt="Slide 2"
            style={{ width: "20", height:"30", borderRadius: "10px" }}
          />
        </div>
         <div>
          <img
            src="/image-5.jpeg"
            alt="Slide 2"
            style={{ width: "20", height:"30", borderRadius: "10px" }}
          />
        </div>
        <div>
          <img
            src="/image-4.jpeg"
            alt="Slide 3"
           style={{ width: "20", height:"5", borderRadius: "10px" }}
          />
        </div>
        <div>
          <img
            src="/image-1.JPG"
            alt="Slide 4"
          style={{ width: "20", height:"30", borderRadius: "10px" }}
          />
        </div>
      </Slider>
    </div>
  );
};

export default Carousel;
