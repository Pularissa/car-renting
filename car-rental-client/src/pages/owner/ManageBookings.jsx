import React, { useEffect, useState } from 'react'
import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const ManageBookings = () => {

  const { currency, axios } = useAppContext()

  const [bookings, setBookings] = useState([])
  const [purchases, setPurchases] = useState([])
  const [activeTab, setActiveTab] = useState('bookings')

  const fetchOwnerBookings = async ()=>{
    try {
      const { data } = await axios.get('/api/bookings/owner')
      data.success ? setBookings(data.bookings) : toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const fetchOwnerPurchases = async ()=>{
    try {
      const { data } = await axios.get('/api/purchases/owner')
      data.success ? setPurchases(data.purchases) : toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const changeBookingStatus = async (bookingId, status)=>{
    try {
      const { data } = await axios.post('/api/bookings/change-status', {bookingId, status})
      if(data.success){
        toast.success(data.message)
        fetchOwnerBookings()
      }else{
        toast.error(data.message)
      }
      
    } catch (error) {
      toast.error(error.message)
    }
  }

  const changePurchaseStatus = async (purchaseId, status)=>{
    try {
      const { data } = await axios.put(`/api/purchases/status/${purchaseId}`, { status })
      if(data.success){
        toast.success(data.message)
        fetchOwnerPurchases()
      }else{
        toast.error(data.message)
      }
      
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    fetchOwnerBookings()
    fetchOwnerPurchases()
  },[])

  return (
    <div className='px-4 pt-10 md:px-10 w-full'>
      
      <Title title="Manage Orders" subTitle="Track all customer bookings and purchases, approve or cancel requests, and manage order statuses."/>

      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
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

      {activeTab === 'bookings' && (
        <div className='max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6'>
          <table className='w-full border-collapse text-left text-sm text-gray-600'>
            <thead className='text-gray-500'>
              <tr>
                <th className="p-3 font-medium">Car</th>
                <th className="p-3 font-medium max-md:hidden">Date Range</th>
                <th className="p-3 font-medium">Total</th>
                <th className="p-3 font-medium max-md:hidden">Payment</th>
                <th className="p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index)=>(
                <tr key={index} className='border-t border-borderColor text-gray-500'>

                  <td className='p-3 flex items-center gap-3'>
                    <img src={booking.car.images ? booking.car.images[0] : booking.car.image} alt="" className='h-12 w-12 aspect-square rounded-md object-cover'/>
                    <p className='font-medium max-md:hidden'>{booking.car.brand} {booking.car.model}</p>
                  </td>

                  <td className='p-3 max-md:hidden'>
                    {booking.pickupDate.split('T')[0]} to {booking.returnDate.split('T')[0]}
                  </td>

                  <td className='p-3'>{currency}{booking.price}</td>

                  <td className='p-3 max-md:hidden'>
                    <span className='bg-gray-100 px-3 py-1 rounded-full text-xs'>offline</span>
                  </td>

                  <td className='p-3'>
                    {booking.status === 'pending' ? (
                      <select onChange={e=> changeBookingStatus(booking._id, e.target.value)} value={booking.status} className='px-2 py-1.5 mt-1 text-gray-500 border border-borderColor rounded-md outline-none'>
                        <option value="pending">Pending</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="confirmed">Confirmed</option>
                      </select>
                    ): (
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${booking.status === 'confirmed' ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'}`}>{booking.status}</span>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'purchases' && (
        <div className='max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6'>
          <table className='w-full border-collapse text-left text-sm text-gray-600'>
            <thead className='text-gray-500'>
              <tr>
                <th className="p-3 font-medium">Car</th>
                <th className="p-3 font-medium max-md:hidden">Customer</th>
                <th className="p-3 font-medium">Total</th>
                <th className="p-3 font-medium max-md:hidden">Payment</th>
                <th className="p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((purchase, index)=>(
                <tr key={index} className='border-t border-borderColor text-gray-500'>

                  <td className='p-3 flex items-center gap-3'>
                    <img src={purchase.car.images ? purchase.car.images[0] : purchase.car.image} alt="" className='h-12 w-12 aspect-square rounded-md object-cover'/>
                    <p className='font-medium max-md:hidden'>{purchase.car.brand} {purchase.car.model}</p>
                  </td>

                  <td className='p-3 max-md:hidden'>
                    {purchase.fullName}
                  </td>

                  <td className='p-3'>{currency}{purchase.price}</td>

                  <td className='p-3 max-md:hidden'>
                    <span className='bg-gray-100 px-3 py-1 rounded-full text-xs'>offline</span>
                  </td>

                  <td className='p-3'>
                    {purchase.status === 'pending' ? (
                      <select onChange={e=> changePurchaseStatus(purchase._id, e.target.value)} value={purchase.status} className='px-2 py-1.5 mt-1 text-gray-500 border border-borderColor rounded-md outline-none'>
                        <option value="pending">Pending</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="confirmed">Confirmed</option>
                      </select>
                    ): (
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${purchase.status === 'confirmed' ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'}`}>{purchase.status}</span>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  )
}

export default ManageBookings
