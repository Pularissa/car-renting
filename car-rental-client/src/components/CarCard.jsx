import { useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const CarCard = ({ car }) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // ✅ Safe fallback (handles empty array too)
  const images =
    car.images && car.images.length > 0 ? car.images : [car.image];

  const nextImage = (e) => {
    e?.stopPropagation();
    setCurrentImageIndex(
      (prev) => (prev + 1) % images.length
    );
  };

  const prevImage = (e) => {
    e?.stopPropagation();
    setCurrentImageIndex(
      (prev) => (prev - 1 + images.length) % images.length
    );
  };

  useEffect(() => {
    if (images.length <= 1 || isHovered) return;

    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prev) => (prev + 1) % images.length
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length, isHovered]);

  return (
    <div
      onClick={() => {
        navigate(`/car-details/${car._id}`);
        window.scrollTo(0, 0); // ✅ FIXED
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group rounded-xl overflow-hidden shadow-lg hover:-translate-y-1 transition-all duration-500 cursor-pointer"
    >
      {/* IMAGE SECTION */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={images[currentImageIndex]}
          alt={`${car.brand} ${car.model}`}
          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
        />

        {images.length > 1 && (
          <>
            {/* LEFT ARROW */}
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            >
              ‹
            </button>

            {/* RIGHT ARROW */}
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            >
              ›
            </button>

            {/* INDICATORS */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/30 px-2 py-1 rounded-full">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className={`h-2 rounded-full transition-all ${
                    index === currentImageIndex
                      ? 'bg-white w-6'
                      : 'bg-white/50 w-2'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {car.isAvailable ? (
          <span className="absolute top-4 left-4 bg-primary text-white text-xs px-3 py-1 rounded-full">
            Available Now
          </span>
        ) : null}

        <div className="absolute bottom-4 right-4 bg-black/80 text-white px-3 py-2 rounded-lg text-xs">
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

export default CarCard;
