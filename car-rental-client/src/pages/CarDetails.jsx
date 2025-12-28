import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { assets, dummyCarData } from '../assets/assets';
import Loader from '../components/Loader';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import Carousel from '../components/Carousel';

const CarDetails = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { cars, axios, pickupDate, setPickupDate, returnDate, setReturnDate, currency } = useAppContext();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [mode, setMode] = useState(searchParams.get('mode') || 'rent'); // 'rent' or 'buy'
  // Carousel state is now managed by the Carousel component

  // Buy form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [alternatePhone, setAlternatePhone] = useState('');
  const [preferredDeliveryDate, setPreferredDeliveryDate] = useState('');
  const [insuranceOption, setInsuranceOption] = useState('basic');
  const [warrantyOption, setWarrantyOption] = useState('1year');
  const [financingOption, setFinancingOption] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [billingAddress, setBillingAddress] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  // Find car from context or fallback to dummy data
  
  useEffect(() => {
    let foundCar = cars.find((c) => c._id === id);
    if (!foundCar) {
      foundCar = dummyCarData.find((c) => c._id === id);
    }
    setCar(foundCar);
  }, [cars, id]);

  // Carousel auto-play and navigation is now handled by the Carousel component

  const handleRentSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/bookings/create', {
        car: id,
        pickupDate,
        returnDate,
        location,
        phoneNumber: phone,
      });

      if (data.success) {
        toast.success(data.message || 'Booking created successfully!');
        navigate('/my-bookings');
      } else {
        toast.error(data.message || 'Failed to create booking');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Network error');
    }
  };

  const handleBuySubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/purchases/create', {
        car: id,
        fullName,
        email,
        idNumber,
        dateOfBirth,
        deliveryAddress,
        city,
        postalCode,
        country,
        location,
        phoneNumber: phone,
        alternatePhone,
        preferredDeliveryDate,
        insuranceOption,
        warrantyOption,
        financingOption,
        paymentMethod,
        billingAddress,
        termsAccepted,
        privacyAccepted,
      });

      if (data.success) {
        toast.success(data.message || 'Purchase created successfully!');
        navigate('/my-bookings'); // Or a purchases page
      } else {
        toast.error(data.message || 'Failed to create purchase');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Network error');
    }
  };

  if (!car) return <Loader />;

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-16">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-8 text-gray-600 hover:text-gray-800 cursor-pointer"
      >
        <img src={assets.arrow_icon} alt="back" className="rotate-180 opacity-70 h-5" />
        Back to all cars
      </motion.button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Left: Car Image & Details */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-2"
        >
          {/* Car Image Carousel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Carousel 
              images={car.images && car.images.length > 0 ? car.images : [assets.car_image1, assets.car_image2, assets.car_image3, assets.car_image4]}
              autoPlay={true}
              interval={5000}
            />
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2,
                },
              },
            }}
            className="space-y-8"
          >
            {/* Title & Category */}
            <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
              <h1 className="text-4xl font-bold">{car.brand} {car.model}</h1>
              <p className="text-gray-500 text-xl mt-2">{car.category} • {car.year}</p>
            </motion.div>

            <hr className="border-gray-200 my-6" />

            {/* Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[
                { icon: assets.users_icon, text: `${car.seating_capacity} Seats` },
                { icon: assets.fuel_icon, text: car.fuel_type },
                { icon: assets.car_icon, text: car.transmission },
                { icon: assets.location_icon, text: car.location },
              ].map(({ icon, text }, index) => (
                <motion.div
                  key={text}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                  className="flex flex-col items-center bg-gray-50 p-5 rounded-xl shadow-sm hover:shadow-md transition-all"
                >
                  <img src={icon} alt="" className="h-6 mb-3" />
                  <span className="text-sm font-medium text-gray-700">{text}</span>
                </motion.div>
              ))}
            </div>

            {/* Description */}
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
              <h2 className="text-2xl font-semibold mb-4">Description</h2>
              <p className="text-gray-600 leading-relaxed">{car.description || 'No description available.'}</p>
            </motion.div>

            {/* Features */}
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
              <h2 className="text-2xl font-semibold mb-4">Features</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {['360 Camera', 'Bluetooth', 'GPS', 'Heated Seats', 'Rear View Mirror'].map((item, index) => (
                  <motion.li
                    key={item}
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0 },
                    }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center text-gray-700"
                  >
                    <img src={assets.check_icon} alt="check" className="h-5 mr-3" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Right: Booking Form */}
        <motion.form
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          onSubmit={mode === 'rent' ? handleRentSubmit : handleBuySubmit}
          className="lg:sticky lg:top-24 h-max bg-white shadow-2xl rounded-2xl p-8 space-y-6 border border-gray-100"
        >
          {/* Mode Selection */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setMode('rent')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                mode === 'rent' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
              }`}
            >
              Rent
            </button>
            <button
              type="button"
              onClick={() => setMode('buy')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                mode === 'buy' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
              }`}
            >
              Buy
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-end gap-2"
          >
            <span className="text-4xl font-bold text-gray-900">
              {currency}{mode === 'rent' ? car.pricePerDay : car.purchasePrice}
            </span>
            <span className="text-gray-500">{mode === 'rent' ? '/ day' : ''}</span>
          </motion.div>

          <hr className="border-gray-200 my-6" />

          <div className="space-y-5">
            {mode === 'rent' && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="flex flex-col gap-2"
                >
                  <label htmlFor="pickup-date" className="font-medium text-gray-700">Pickup Date</label>
                  <input
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex flex-col gap-2"
                >
                  <label htmlFor="return-date" className="font-medium text-gray-700">Return Date</label>
                  <input
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    type="date"
                    required
                    className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex flex-col gap-2"
                >
                  <label htmlFor="location" className="font-medium text-gray-700">Pickup Location</label>
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    type="text"
                    placeholder="e.g. Gicumbi, Rwanda"
                    required
                    className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex flex-col gap-2"
                >
                  <label htmlFor="phone" className="font-medium text-gray-700">Phone Number</label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    type="tel"
                    placeholder="+250 7XX XXX XXX"
                    required
                    className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                </motion.div>
              </>
            )}

            {mode === 'buy' && (
              <>
                {/* Personal Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="space-y-4"
                >
                  <h3 className="font-semibold text-gray-800 border-b pb-2">Personal Information</h3>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="font-medium text-gray-700">Full Name *</label>
                      <input
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        type="text"
                        placeholder="Enter your full name"
                        required
                        className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="font-medium text-gray-700">Email Address *</label>
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder="your.email@example.com"
                        required
                        className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="font-medium text-gray-700">ID/Passport Number *</label>
                        <input
                          value={idNumber}
                          onChange={(e) => setIdNumber(e.target.value)}
                          type="text"
                          placeholder="123456789"
                          required
                          className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="font-medium text-gray-700">Date of Birth *</label>
                        <input
                          value={dateOfBirth}
                          onChange={(e) => setDateOfBirth(e.target.value)}
                          type="date"
                          required
                          max={new Date().toISOString().split('T')[0]}
                          className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Delivery Address */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="space-y-4"
                >
                  <h3 className="font-semibold text-gray-800 border-b pb-2">Delivery Address</h3>
                  
                  <div className="flex flex-col gap-2">
                    <label className="font-medium text-gray-700">Delivery Address *</label>
                    <textarea
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Enter your complete delivery address"
                      required
                      rows={3}
                      className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="font-medium text-gray-700">City *</label>
                      <input
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        type="text"
                        placeholder="City"
                        required
                        className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="font-medium text-gray-700">Postal Code *</label>
                      <input
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        type="text"
                        placeholder="12345"
                        required
                        className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-medium text-gray-700">Country *</label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      required
                      className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    >
                      <option value="">Select Country</option>
                      <option value="Rwanda">Rwanda</option>
                      <option value="Kenya">Kenya</option>
                      <option value="Tanzania">Tanzania</option>
                      <option value="Uganda">Uganda</option>
                      <option value="Burundi">Burundi</option>
                      <option value="Democratic Republic of Congo">Democratic Republic of Congo</option>
                    </select>
                  </div>
                </motion.div>

                {/* Contact Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="space-y-4"
                >
                  <h3 className="font-semibold text-gray-800 border-b pb-2">Contact Information</h3>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="font-medium text-gray-700">Primary Phone Number *</label>
                      <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        type="tel"
                        placeholder="+250 7XX XXX XXX"
                        required
                        className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="font-medium text-gray-700">Alternate Phone Number</label>
                      <input
                        value={alternatePhone}
                        onChange={(e) => setAlternatePhone(e.target.value)}
                        type="tel"
                        placeholder="+250 7XX XXX XXX"
                        className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="font-medium text-gray-700">Preferred Delivery Location *</label>
                      <input
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        type="text"
                        placeholder="e.g. Kigali, Rwanda"
                        required
                        className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Purchase Options */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="space-y-4"
                >
                  <h3 className="font-semibold text-gray-800 border-b pb-2">Purchase Options</h3>
                  
                  <div className="flex flex-col gap-2">
                    <label className="font-medium text-gray-700">Preferred Delivery Date *</label>
                    <input
                      value={preferredDeliveryDate}
                      onChange={(e) => setPreferredDeliveryDate(e.target.value)}
                      type="date"
                      required
                      min={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                      className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="font-medium text-gray-700">Insurance Option</label>
                      <select
                        value={insuranceOption}
                        onChange={(e) => setInsuranceOption(e.target.value)}
                        className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      >
                        <option value="basic">Basic Insurance (+$500)</option>
                        <option value="comprehensive">Comprehensive Insurance (+$1,200)</option>
                        <option value="none">No Insurance</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="font-medium text-gray-700">Warranty Option</label>
                      <select
                        value={warrantyOption}
                        onChange={(e) => setWarrantyOption(e.target.value)}
                        className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      >
                        <option value="1year">1 Year Warranty (+$300)</option>
                        <option value="2years">2 Years Warranty (+$500)</option>
                        <option value="3years">3 Years Warranty (+$700)</option>
                        <option value="none">No Extended Warranty</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="financing"
                        checked={financingOption}
                        onChange={(e) => setFinancingOption(e.target.checked)}
                        className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <label htmlFor="financing" className="text-gray-700">Apply for financing options</label>
                    </div>
                  </div>
                </motion.div>

                {/* Payment Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="space-y-4"
                >
                  <h3 className="font-semibold text-gray-800 border-b pb-2">Payment Information</h3>
                  
                  <div className="flex flex-col gap-2">
                    <label className="font-medium text-gray-700">Payment Method</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    >
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="credit_card">Credit Card</option>
                      <option value="cash">Cash on Delivery</option>
                      <option value="check">Check</option>
                    </select>
                  </div>

                  {(paymentMethod === 'credit_card' || paymentMethod === 'bank_transfer') && (
                    <div className="flex flex-col gap-2">
                      <label className="font-medium text-gray-700">Billing Address (if different from delivery)</label>
                      <textarea
                        value={billingAddress}
                        onChange={(e) => setBillingAddress(e.target.value)}
                        placeholder="Enter billing address if different from delivery address"
                        rows={2}
                        className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      />
                    </div>
                  )}
                </motion.div>

                {/* Legal Agreements */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="space-y-4"
                >
                  <h3 className="font-semibold text-gray-800 border-b pb-2">Legal Agreements</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        required
                        className="w-4 h-4 mt-1 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <label htmlFor="terms" className="text-sm text-gray-700">
                        I agree to the <a href="#" className="text-primary hover:underline">Terms and Conditions</a> *
                      </label>
                    </div>

                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="privacy"
                        checked={privacyAccepted}
                        onChange={(e) => setPrivacyAccepted(e.target.checked)}
                        required
                        className="w-4 h-4 mt-1 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <label htmlFor="privacy" className="text-sm text-gray-700">
                        I agree to the <a href="#" className="text-primary hover:underline">Privacy Policy</a> *
                      </label>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full bg-primary hover:bg-primary-dull text-white font-semibold py-4 rounded-xl transition-all duration-300 mt-4"
          >
            {mode === 'rent' ? 'Book Now' : 'Complete Purchase'}
          </motion.button>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center text-sm text-gray-500 mt-2"
          >
            {mode === 'rent' ? 'No credit card required to reserve' : 'All information is securely encrypted'}
          </motion.p>
        </motion.form>
      </div>
    </div>
  );
};

export default CarDetails;