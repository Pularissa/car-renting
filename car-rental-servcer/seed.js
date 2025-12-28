import mongoose from 'mongoose';
import User from './models/User.js';
import Car from './models/Car.js';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

// Load environment variables
dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Clear existing data
    await User.deleteMany({});
    await Car.deleteMany({});

    // Create a test user
    const hashedPassword = await bcrypt.hash('nelson', 10);
    
    const user = new User({
      name: 'Nelson',
      email: 'user@gmail.com',
      password: hashedPassword,
      role: 'user'
    });

    await user.save();
    console.log('User seeded successfully');
    
    // Create a test owner
    const owner = new User({
      name: 'Owner Nelson',
      email: 'owner@gmail.com',
      password: await bcrypt.hash('nelson', 10),
      role: 'owner'
    });

    await owner.save();
    console.log('Owner seeded successfully');

    // Seed some cars
    const cars = [
      {
        owner: owner._id,
        brand: 'Toyota',
        model: 'Camry',
        image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400',
        year: 2020,
        category: 'Sedan',
        seating_capacity: 5,
        fuel_type: 'Petrol',
        transmission: 'Automatic',
        pricePerDay: 50,
        purchasePrice: 25000,
        location: 'New York',
        description: 'Comfortable and reliable sedan perfect for city driving.',
        isAvaliable: true
      },
      {
        owner: owner._id,
        brand: 'Honda',
        model: 'Civic',
        image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400',
        year: 2019,
        category: 'Sedan',
        seating_capacity: 5,
        fuel_type: 'Petrol',
        transmission: 'Manual',
        pricePerDay: 45,
        purchasePrice: 22000,
        location: 'Los Angeles',
        description: 'Fuel-efficient and sporty compact car.',
        isAvaliable: true
      },
      {
        owner: owner._id,
        brand: 'Ford',
        model: 'Mustang',
        image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400',
        year: 2021,
        category: 'Sports',
        seating_capacity: 4,
        fuel_type: 'Petrol',
        transmission: 'Automatic',
        pricePerDay: 80,
        purchasePrice: 35000,
        location: 'Miami',
        description: 'Iconic American muscle car with powerful performance.',
        isAvaliable: true
      },
      {
        owner: owner._id,
        brand: 'BMW',
        model: 'X3',
        image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400',
        year: 2022,
        category: 'SUV',
        seating_capacity: 5,
        fuel_type: 'Diesel',
        transmission: 'Automatic',
        pricePerDay: 90,
        purchasePrice: 45000,
        location: 'Chicago',
        description: 'Luxury SUV with advanced features and comfort.',
        isAvaliable: true
      },
      {
        owner: owner._id,
        brand: 'Tesla',
        model: 'Model 3',
        image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400',
        year: 2023,
        category: 'Electric',
        seating_capacity: 5,
        fuel_type: 'Electric',
        transmission: 'Automatic',
        pricePerDay: 100,
        purchasePrice: 50000,
        location: 'San Francisco',
        description: 'Electric vehicle with autopilot and modern design.',
        isAvaliable: true
      },
      {
        owner: owner._id,
        brand: 'Jeep',
        model: 'Wrangler',
        image: 'https://images.unsplash.com/photo-1606220838315-056192d5e927?w=400',
        year: 2020,
        category: 'SUV',
        seating_capacity: 5,
        fuel_type: 'Petrol',
        transmission: 'Manual',
        pricePerDay: 70,
        purchasePrice: 32000,
        location: 'Denver',
        description: 'Off-road capable SUV for adventure seekers.',
        isAvaliable: true
      }
    ];

    await Car.insertMany(cars);
    console.log(`${cars.length} cars seeded successfully`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();