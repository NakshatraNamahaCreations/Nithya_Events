// ImageSlider.js
import React from "react";
import Slider from "react-slick";
import Tent1 from "../../../../assets/tent1.jpg";
import Tent2 from "../../../../assets/tent2.jpg";
import Tent3 from "../../../../assets/tent3.jpg";
import Tent4 from "../../../../assets/tent4.jpg";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./styles.scss";

const Gallery = () => {
  const images = [
    { id: 1, src: Tent1, alt: "Tent 1" },
    { id: 2, src: Tent2, alt: "Tent 2" },
    { id: 3, src: Tent3, alt: "Tent 3" },
    { id: 4, src: Tent4, alt: "Tent 4" },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 2000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
  };

  return (
    <div className="image-slider">
      <h2>The Gallery</h2>
      <Slider {...settings}>
        {images.map((image) => (
          <div key={image.id} className="slider-item">
            <img src={image.src} alt={image.alt} className="slider-image" />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Gallery;
