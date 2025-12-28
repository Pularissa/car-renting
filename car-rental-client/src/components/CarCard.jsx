import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const CarCard = ({car}) => {

    const currency = import.meta.env.VITE_CURRENCY
    const navigate = useNavigate()

  return (
    <div onClick={()=> {navigate(`/car-details/${car._id}`); scrollTo(0,0)}} className='group rounded-xl overflow-hidden shadow-lg hover:-translate-y-1 transition-all duration-500 cursor-pointer'>
      
      <div className='relative h-48 overflow-hidden'> 
        <img src={car.image} alt="Car Image" className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'/>

        {car.isAvaliable && <p className='absolute top-4 left-4 bg-primary/90 text-white text-xs px-2.5 py-1 rounded-full'>Available Now</p>}

        <div className='absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-lg'>
            <div className='text-xs'>Rent: <span className='font-semibold'>{currency}{car.pricePerDay}</span>/day</div>
            <div className='text-xs'>Buy: <span className='font-semibold'>{currency}{car.purchasePrice}</span></div>
        </div>
      </div>

      <div className='p-4 sm:p-5'>
        <div className='flex justify-between items-start mb-2'>
            <div>
                <h3 className='text-lg font-medium'>{car.brand} {car.model}</h3>
                <p className='text-muted-foreground text-sm'>{car.category} • {car.year}</p>
            </div>
        </div>

        <div className='mt-4 grid grid-cols-2 gap-y-2 text-gray-600'>
            <div className='flex items-center text-sm text-muted-foreground'>
                <img src={assets.users_icon} alt="" className='h-4 mr-2'/>
                <span>{car.seating_capacity} Seats</span>
            </div>
            <div className='flex items-center text-sm text-muted-foreground'>
                <img src={assets.fuel_icon} alt="" className='h-4 mr-2'/>
                <span>{car.fuel_type}</span>
            </div>
            <div className='flex items-center text-sm text-muted-foreground'>
                <img src={assets.car_icon} alt="" className='h-4 mr-2'/>
                <span>{car.transmission}</span>
            </div>
            <div className='flex items-center text-sm text-muted-foreground'>
                <img src={assets.location_icon} alt="" className='h-4 mr-2'/>
                <span>{car.location}</span>
            </div>
        </div>

        {/* Action Buttons */}
        <div className='mt-4 flex gap-2'>
          <button 
            onClick={(e) => { e.stopPropagation(); navigate(`/car-details/${car._id}?mode=rent`); }}
            className='flex-1 bg-primary text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-primary-dull transition-colors'
          >
            Rent
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); navigate(`/car-details/${car._id}?mode=buy`); }}
            className='flex-1 bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors'
          >
            Buy
          </button>
        </div>

      </div>

    </div>
  )
}

export default CarCard
