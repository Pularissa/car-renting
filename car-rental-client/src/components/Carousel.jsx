import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';

const Carousel = ({ images, autoPlay = true, interval = 4000 }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  if (!images || images.length === 0) {
    return <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">No images available</div>;
  }

  return (
    <div className="space-y-4">
      {/* Main Carousel */}
      <Swiper
        modules={[Navigation, Pagination, Autoplay, Thumbs]}
        spaceBetween={10}
        slidesPerView={1}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        pagination={{ 
          clickable: true,
          dynamicBullets: true
        }}
        autoplay={autoPlay ? {
          delay: interval,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        } : false}
        thumbs={{ swiper: thumbsSwiper }}
        loop={true}
        className="rounded-lg shadow-md"
        style={{
          '--swiper-navigation-size': '5px',
          '--swiper-navigation-color': '#ffffff',
          '--swiper-navigation-bg': 'rgba(0,0,0,0.5)',
        }}
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="aspect-video w-full overflow-hidden rounded-lg">
              <img
                src={image}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbnail Carousel */}
      {images.length > 1 && (
        <Swiper
          modules={[Thumbs]}
          onSwiper={setThumbsSwiper}
          spaceBetween={10}
          slidesPerView={4}
          freeMode={true}
          watchSlidesProgress={true}
          className="thumbnail-swiper"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <div className="aspect-video w-full overflow-hidden rounded-lg cursor-pointer border-2 border-transparent hover:border-primary transition-all">
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default Carousel;
