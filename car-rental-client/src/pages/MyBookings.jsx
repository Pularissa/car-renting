import React, { useEffect, useState, useCallback } from 'react';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import { motion as Motion } from 'framer-motion';

const MyBookings = () => {
  const { axios, user, currency } = useAppContext();

  const [bookings, setBookings] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [activeTab, setActiveTab] = useState('bookings');

  const fetchMyBookings = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/bookings/user');
      if (data.success) {
        setBookings(data.bookings);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }, [axios]);

  const fetchMyPurchases = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/purchases/user');
      if (data.success) {
        setPurchases(data.purchases);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }, [axios]);

  useEffect(() => {
    if (user) {
      fetchMyBookings();
      fetchMyPurchases();
    }
  }, [user, fetchMyBookings, fetchMyPurchases]);

  return (
    <Motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 text-sm max-w-7xl"
    >
      <Title
        title="My Orders"
        subTitle="View and manage your car bookings and purchases"
        align="left"
      />

      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-lg p-1 mb-8">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
            activeTab === 'bookings' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
          }`}
        >
          Bookings ({bookings.length})
        </button>
        <button
          onClick={() => setActiveTab('purchases')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
            activeTab === 'purchases' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
          }`}
        >
          Purchases ({purchases.length})
        </button>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'bookings' && (
          bookings.length === 0 ? (
            <p className="text-center text-gray-500 mt-8">No bookings found</p>
          ) : (
            bookings.map((booking, index) => (
              <Motion.div
                key={booking._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border border-borderColor rounded-lg mt-5 first:mt-12"
              >
                {/* Car Image + Info */}
                <div className="md:col-span-1">
                  <div className="rounded-md overflow-hidden mb-3">
                    <img
                      src={booking.car.images ? booking.car.images[0] : booking.car.image}
                      alt={`${booking.car.brand} ${booking.car.model}`}
                      className="w-full h-auto aspect-video object-cover"
                    />
                  </div>
                  <p className="text-lg font-medium mt-2">
                    {booking.car.brand} {booking.car.model}
                  </p>
                  <p className="text-gray-500">
                    {booking.car.year} • {booking.car.category} • {booking.car.location}
                  </p>
                </div>

                {/* Booking Info */}
                <div className="md:col-span-2">
                  <div className="flex items-center gap-2">
                    <p className="px-3 py-1.5 bg-light rounded">Booking #{index + 1}</p>
                    <p
                      className={`px-3 py-1 text-xs rounded-full ${
                        booking.status === 'confirmed' ? 'bg-green-400/15 text-green-600' : 'bg-red-400/15 text-red-600'
                      }`}
                    >
                      {booking.status}
                    </p>
                  </div>

                  <div className="flex items-start gap-2 mt-3">
                    <img src={assets.calendar_icon_colored} alt="calendar" className="w-4 h-4 mt-1" />
                    <div>
                      <p className="text-gray-500">Rental Period</p>
                      <p>
                        {booking.pickupDate.split('T')[0]} to {booking.returnDate.split('T')[0]}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 mt-3">
                    <img src={assets.location_icon_colored} alt="location" className="w-4 h-4 mt-1" />
                    <div>
                      <p className="text-gray-500">Pick-up Location</p>
                      <p>{booking.car.location}</p>
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="md:col-span-1 flex flex-col justify-between gap-6">
                  <div className="text-sm text-gray-500 text-right">
                    <p>Total Price</p>
                    <h1 className="text-2xl font-semibold text-primary">
                      {currency}
                      {booking.price}
                    </h1>
                    <p>Booked on {booking.createdAt.split('T')[0]}</p>
                  </div>
                </div>
              </Motion.div>
            ))
          )
        )}

        {activeTab === 'purchases' && (
          purchases.length === 0 ? (
            <p className="text-center text-gray-500 mt-8">No purchases found</p>
          ) : (
            purchases.map((purchase, index) => (
              <Motion.div
                key={purchase._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border border-borderColor rounded-lg mt-5 first:mt-12"
              >
                {/* Car Image + Info */}
                <div className="md:col-span-1">
                  <div className="rounded-md overflow-hidden mb-3">
                    <img
                      src={purchase.car.images ? purchase.car.images[0] : purchase.car.image}
                      alt={`${purchase.car.brand} ${purchase.car.model}`}
                      className="w-full h-auto aspect-video object-cover"
                    />
                  </div>
                  <p className="text-lg font-medium mt-2">
                    {purchase.car.brand} {purchase.car.model}
                  </p>
                  <p className="text-gray-500">
                    {purchase.car.year} • {purchase.car.category} • {purchase.car.location}
                  </p>
                </div>

                {/* Purchase Info */}
                <div className="md:col-span-2">
                  <div className="flex items-center gap-2">
                    <p className="px-3 py-1.5 bg-light rounded">Purchase #{index + 1}</p>
                    <p
                      className={`px-3 py-1 text-xs rounded-full ${
                        purchase.status === 'confirmed' ? 'bg-green-400/15 text-green-600' : 'bg-red-400/15 text-red-600'
                      }`}
                    >
                      {purchase.status}
                    </p>
                  </div>

                  <div className="flex items-start gap-2 mt-3">
                    <img src={assets.location_icon_colored} alt="location" className="w-4 h-4 mt-1" />
                    <div>
                      <p className="text-gray-500">Delivery Address</p>
                      <p>{purchase.deliveryAddress}, {purchase.city}, {purchase.country}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 mt-3">
                    <img src={assets.calendar_icon_colored} alt="calendar" className="w-4 h-4 mt-1" />
                    <div>
                      <p className="text-gray-500">Preferred Delivery Date</p>
                      <p>{purchase.preferredDeliveryDate ? new Date(purchase.preferredDeliveryDate).toLocaleDateString() : 'TBD'}</p>
                    </div>
                  </div>

                  {(purchase.insuranceOption !== 'none' || purchase.warrantyOption !== 'none') && (
                    <div className="flex items-start gap-2 mt-3">
                      <img src={assets.check_icon} alt="options" className="w-4 h-4 mt-1" />
                      <div>
                        <p className="text-gray-500">Options</p>
                        <p>
                          {purchase.insuranceOption !== 'none' && `Insurance: ${purchase.insuranceOption}`}
                          {purchase.insuranceOption !== 'none' && purchase.warrantyOption !== 'none' && ' | '}
                          {purchase.warrantyOption !== 'none' && `Warranty: ${purchase.warrantyOption}`}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Price */}
                <div className="md:col-span-1 flex flex-col justify-between gap-6">
                  <div className="text-sm text-gray-500 text-right">
                    <p>Total Price</p>
                    <h1 className="text-2xl font-semibold text-primary">
                      {currency}
                      {purchase.price}
                    </h1>
                    <p>Purchased on {purchase.createdAt.split('T')[0]}</p>
                  </div>
                </div>
              </Motion.div>
            ))
          )
        )}
      </div>
    </Motion.div>
  );
};

export default MyBookings;