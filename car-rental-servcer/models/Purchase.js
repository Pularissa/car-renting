import mongoose from "mongoose";
const {ObjectId} = mongoose.Schema.Types

const purchaseSchema = new mongoose.Schema({
    car: {type: ObjectId, ref: "Car", required: true},
    user: {type: ObjectId, ref: "User", required: true},
    owner: {type: ObjectId, ref: "User", required: true},
    
    // Personal Information
    fullName: {type: String, required: true},
    email: {type: String, required: true},
    idNumber: {type: String, required: true},
    dateOfBirth: {type: Date, required: true},
    
    // Delivery Address
    deliveryAddress: {type: String, required: true},
    city: {type: String, required: true},
    postalCode: {type: String, required: true},
    country: {type: String, required: true},
    
    // Contact Information
    location: {type: String, required: true},
    phoneNumber: {type: String, required: true},
    alternatePhone: {type: String},
    
    // Purchase Options
    preferredDeliveryDate: {type: Date, required: true},
    insuranceOption: {type: String, enum: ["basic", "comprehensive", "none"], default: "basic"},
    warrantyOption: {type: String, enum: ["1year", "2years", "3years", "none"], default: "1year"},
    financingOption: {type: Boolean, default: false},
    
    // Payment Information
    paymentMethod: {type: String, enum: ["bank_transfer", "credit_card", "cash", "check"], default: "bank_transfer"},
    billingAddress: {type: String}, // Optional, different from delivery
    
    // Legal Agreements
    termsAccepted: {type: Boolean, required: true, default: false},
    privacyAccepted: {type: Boolean, required: true, default: false},
    
    // Status and Price
    status: {type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending"},
    price: {type: Number, required: true}
},{timestamps: true})

const Purchase = mongoose.model('Purchase', purchaseSchema)

export default Purchase