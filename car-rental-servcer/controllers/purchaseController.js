import Purchase from "../models/Purchase.js";
import Car from "../models/Car.js";

// API to Create Purchase
export const createPurchase = async (req, res) => {
    try {
        const { _id } = req.user;
        const { 
            car, 
            fullName,
            email,
            idNumber,
            dateOfBirth,
            deliveryAddress,
            city,
            postalCode,
            country,
            location,
            phoneNumber,
            alternatePhone,
            preferredDeliveryDate,
            insuranceOption,
            warrantyOption,
            financingOption,
            paymentMethod,
            billingAddress,
            termsAccepted,
            privacyAccepted
        } = req.body;

        // Validate required fields
        if (!car || !fullName || !email || !idNumber || !dateOfBirth || !deliveryAddress || 
            !city || !postalCode || !country || !location || !phoneNumber || 
            !preferredDeliveryDate || !termsAccepted || !privacyAccepted) {
            return res.json({ success: false, message: "All required fields must be filled" });
        }

        // Validate agreements
        if (!termsAccepted || !privacyAccepted) {
            return res.json({ success: false, message: "You must accept the terms and conditions and privacy policy" });
        }

        const carData = await Car.findById(car);
        if (!carData) {
            return res.json({ success: false, message: "Car not found" });
        }

        // Check if car is available for purchase
        if (!carData.isAvaliable) {
            return res.json({ success: false, message: "Car is not available for purchase" });
        }

        const price = carData.purchasePrice;

        // Create purchase
        const purchase = await Purchase.create({
            car,
            owner: carData.owner,
            user: _id,
            fullName,
            email,
            idNumber,
            dateOfBirth,
            deliveryAddress,
            city,
            postalCode,
            country,
            location,
            phoneNumber,
            alternatePhone,
            preferredDeliveryDate,
            insuranceOption,
            warrantyOption,
            financingOption,
            paymentMethod,
            billingAddress,
            termsAccepted,
            privacyAccepted,
            price
        });

        // Mark car as not available
        await Car.findByIdAndUpdate(car, { isAvaliable: false });

        res.json({ success: true, message: "Purchase Created Successfully", purchase });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// API to List User Purchases
export const getUserPurchases = async (req, res) => {
    try {
        const { _id } = req.user;
        const purchases = await Purchase.find({ user: _id })
            .populate("car")
            .sort({ createdAt: -1 });

        res.json({ success: true, purchases });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// API to get Owner Purchases
export const getOwnerPurchases = async (req, res) => {
    try {
        if (req.user.role !== 'owner') {
            return res.json({ success: false, message: "Unauthorized" });
        }

        const purchases = await Purchase.find({ owner: req.user._id })
            .populate("car")
            .populate("user")
            .sort({ createdAt: -1 });

        res.json({ success: true, purchases });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// API to Update Purchase Status
export const updatePurchaseStatus = async (req, res) => {
    try {
        if (req.user.role !== 'owner') {
            return res.json({ success: false, message: "Unauthorized" });
        }

        const { id } = req.params;
        const { status } = req.body;

        if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
            return res.json({ success: false, message: "Invalid status" });
        }

        const purchase = await Purchase.findById(id);
        if (!purchase) {
            return res.json({ success: false, message: "Purchase not found" });
        }

        if (purchase.owner.toString() !== req.user._id.toString()) {
            return res.json({ success: false, message: "Unauthorized" });
        }

        purchase.status = status;
        await purchase.save();

        res.json({ success: true, message: "Purchase status updated", purchase });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};