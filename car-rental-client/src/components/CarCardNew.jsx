import { useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const CarCardNew = ({ car }) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  // Use assets car images for testing
  const images = car.images && car.images.length > 0 ? car.images : [
    assets.car_image1,
    assets.car_image2,
    assets.car_image3,
    assets.car_image4
  ];

  return (
    <div
      onClick={() => {
        navigate(`/car-details/${car._id}`);
        window.scrollTo(0, 0);
      }}
      className="group rounded-xl overflow-hidden shadow-lg hover:-translate-y-1 transition-all duration-500 cursor-pointer"
    >
      {/* IMAGE SECTION WITH CAROUSEL */}
      <div className="relative h-48 overflow-hidden">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
          pagination={{ 
            clickable: true,
            dynamicBullets: true,
            dynamicMainBullets: 3
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
          }}
          loop={true}
          className="h-full"
          style={{
            '--swiper-navigation-size': '4px',
            '--swiper-navigation-color': '#ffffff',
            '--swiper-navigation-bg': 'rgba(0,0,0,0.5)',
          }}
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <img
                src={image}
                alt={`${car.brand} ${car.model} - View ${index + 1}`}
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {car.isAvailable ? (
          <span className="absolute top-4 left-4 bg-primary text-white text-xs px-3 py-1 rounded-full z-10">
            Available Now
          </span>
        ) : null}

        <div className="absolute bottom-4 right-4 bg-black/80 text-white px-3 py-2 rounded-lg text-xs z-10">
          <div>
            Rent: <b>{currency}{car.pricePerDay}</b>/day
          </div>
          <div>
            Buy: <b>{currency}{car.purchasePrice}</b>
          </div>
        </div>
      </div>

      {/* DETAILS */}
      <div className="p-4">
        <h3 className="text-lg font-semibold">
          {car.brand} {car.model}
        </h3>
        <p className="text-sm text-gray-500">
          {car.category} • {car.year}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-gray-600">
          <div className="flex items-center">
            <img src={assets.users_icon} className="h-4 mr-2" />
            {car.seating_capacity} Seats
          </div>
          <div className="flex items-center">
            <img src={assets.fuel_icon} className="h-4 mr-2" />
            {car.fuel_type}
          </div>
          <div className="flex items-center">
            <img src={assets.car_icon} className="h-4 mr-2" />
            {car.transmission}
          </div>
          <div className="flex items-center">
            <img src={assets.location_icon} className="h-4 mr-2" />
            {car.location}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/car-details/${car._id}?mode=rent`);
            }}
            className="flex-1 bg-primary text-white py-2 rounded-lg text-sm"
          >
            Rent
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/car-details/${car._id}?mode=buy`);
            }}
            className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm"
          >
            Buy
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarCardNew;
