import React, { useEffect, useState } from 'react'
import { assets, dummyDashboardData } from '../../assets/assets'
import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const Dashboard = () => {

  const {axios, isOwner, currency, navigate} = useAppContext()

  const [data, setData] = useState({
    totalCars: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    averageBookingValue: 0,
    activeUsers: 0,
    recentBookings: [],
    revenueData: [],
  })

  const dashboardCards = [
    {title: "Total Cars", value: data.totalCars, icon: assets.carIconColored, bgColor: "bg-blue-50", textColor: "text-blue-600"},
    {title: "Total Bookings", value: data.totalBookings, icon: assets.listIconColored, bgColor: "bg-green-50", textColor: "text-green-600"},
    {title: "Pending", value: data.pendingBookings, icon: assets.cautionIconColored, bgColor: "bg-yellow-50", textColor: "text-yellow-600"},
    {title: "Confirmed", value: data.completedBookings, icon: assets.check_icon, bgColor: "bg-green-50", textColor: "text-green-600"},
    {title: "Total Revenue", value: `${currency}${data.totalRevenue}`, icon: assets.star_icon, bgColor: "bg-purple-50", textColor: "text-purple-600"},
    {title: "Active Users", value: data.activeUsers, icon: assets.users_icon, bgColor: "bg-indigo-50", textColor: "text-indigo-600"},
  ]

  const fetchDashboardData = async ()=>{
    try {
       const { data } = await axios.get('/api/owner/dashboard')
       if (data.success){
        setData(data.dashboardData)
       }else{
        toast.error(data.message)
       }
    } catch (error) {
      toast.error(error.message)
      // Fallback to dummy data for development
      setData({
        totalCars: 12,
        totalBookings: 45,
        pendingBookings: 8,
        completedBookings: 32,
        cancelledBookings: 5,
        totalRevenue: 15420,
        monthlyRevenue: 2840,
        averageBookingValue: 342,
        activeUsers: 28,
        recentBookings: [
          {
            _id: "1",
            car: { brand: "Toyota", model: "Camry" },
            user: { name: "John Doe" },
            status: "confirmed",
            price: 450,
            createdAt: "2025-12-20T10:00:00.000Z"
          },
          {
            _id: "2",
            car: { brand: "Honda", model: "Civic" },
            user: { name: "Jane Smith" },
            status: "pending",
            price: 380,
            createdAt: "2025-12-19T14:30:00.000Z"
          },
          {
            _id: "3",
            car: { brand: "BMW", model: "X3" },
            user: { name: "Mike Johnson" },
            status: "confirmed",
            price: 650,
            createdAt: "2025-12-18T09:15:00.000Z"
          }
        ],
        revenueData: [1200, 1800, 2200, 1900, 2400, 2840]
      })
    }
  }

  useEffect(()=>{
    if(isOwner){
      fetchDashboardData()
    }
  },[isOwner])

  return (
    <div className='px-4 pt-10 md:px-10 flex-1'>
      <Title title="Admin Dashboard" subTitle="Monitor overall platform performance including total cars, bookings, revenue, and recent activities"/>

      {/* Quick Stats Grid */}
      <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 my-8'>
        {dashboardCards.map((card, index)=>(
          <div key={index} className={`flex flex-col gap-2 p-4 rounded-lg border border-borderColor hover:shadow-md transition-shadow ${card.bgColor}`}>
            <div className='flex items-center justify-between'>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${card.bgColor} ${card.textColor}`}>
                <img src={card.icon} alt="" className='h-5 w-5'/>
              </div>
              <div className='text-right'>
                <h1 className='text-xs text-gray-500 uppercase tracking-wide'>{card.title}</h1>
                <p className='text-xl font-bold text-gray-800'>{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>


      {/* Main Content Grid */}
      <div className='grid lg:grid-cols-3 gap-6 mb-8'>
        {/* Recent Bookings */}
        <div className='lg:col-span-2 p-6 border border-borderColor rounded-lg bg-white shadow-sm'>
          <div className='flex items-center justify-between mb-4'>
            <div>
              <h1 className='text-xl font-semibold text-gray-800'>Recent Bookings</h1>
              <p className='text-gray-500 text-sm'>Latest customer bookings and their status</p>
            </div>
            <button className='text-primary hover:text-primary/80 text-sm font-medium'>View All</button>
          </div>

          <div className='space-y-4'>
            {data.recentBookings.map((booking, index)=>(
              <div key={index} className='flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'>
                <div className='flex items-center gap-4'>
                  <div className='flex items-center justify-center w-12 h-12 rounded-full bg-primary/10'>
                    <img src={assets.carIconColored} alt="" className='h-6 w-6'/>
                  </div>
                  <div>
                    <p className='font-medium text-gray-800'>{booking.car.brand} {booking.car.model}</p>
                    <p className='text-sm text-gray-500'>by {booking.user?.name || 'Customer'}</p>
                    <p className='text-xs text-gray-400'>{new Date(booking.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className='flex items-center gap-4'>
                  <div className='text-right'>
                    <p className='font-semibold text-gray-800'>{currency}{booking.price}</p>
                    <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue & Analytics */}
        <div className='space-y-6'>
          {/* Monthly Revenue */}
          <div className='p-6 border border-borderColor rounded-lg bg-linear-to-br from-primary/5 to-primary/10'>
            <h1 className='text-lg font-semibold text-gray-800 mb-2'>Monthly Revenue</h1>
            <p className='text-gray-500 text-sm mb-4'>Revenue for current month</p>
            <p className='text-4xl font-bold text-primary mb-2'>{currency}{data.monthlyRevenue}</p>
            <div className='flex items-center gap-2'>
              <span className='text-green-600 text-sm font-medium'>↑ 12.5%</span>
              <span className='text-gray-500 text-sm'>vs last month</span>
            </div>
          </div>

          {/* Average Booking Value */}
          <div className='p-6 border border-borderColor rounded-lg bg-white'>
            <h1 className='text-lg font-semibold text-gray-800 mb-2'>Average Booking Value</h1>
            <p className='text-gray-500 text-sm mb-4'>Average revenue per booking</p>
            <p className='text-3xl font-bold text-gray-800'>{currency}{data.averageBookingValue}</p>
          </div>

          {/* Quick Actions */}
          <div className='p-6 border border-borderColor rounded-lg bg-white'>
            <h1 className='text-lg font-semibold text-gray-800 mb-4'>Quick Actions</h1>
            <div className='space-y-3'>
              <button 
                onClick={() => navigate('/owner/add-car')}
                className='w-full flex items-center gap-3 p-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors'
              >
                <img src={assets.addIconColored} alt="" className='h-5 w-5'/>
                Add New Car
              </button>
              <button 
                onClick={() => navigate('/owner/manage-bookings')}
                className='w-full flex items-center gap-3 p-3 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors'
              >
                <img src={assets.listIconColored} alt="" className='h-5 w-5'/>
                Manage Bookings
              </button>
              <button className='w-full flex items-center gap-3 p-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'>
                <img src={assets.edit_icon} alt="" className='h-5 w-5'/>
                View Reports
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Chart Placeholder */}
      <div className='p-6 border border-borderColor rounded-lg bg-white mb-8'>
        <h1 className='text-xl font-semibold text-gray-800 mb-4'>Revenue Trends</h1>
        <div className='h-64 flex items-center justify-center bg-gray-50 rounded-lg'>
          <div className='text-center'>
            <img src={assets.chart_icon || assets.listIconColored} alt="" className='h-12 w-12 mx-auto mb-4 opacity-50'/>
            <p className='text-gray-500'>Revenue chart will be displayed here</p>
            <p className='text-sm text-gray-400'>Integration with charting library needed</p>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Dashboard
